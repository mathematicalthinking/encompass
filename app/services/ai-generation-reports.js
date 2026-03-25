import Service from '@ember/service';
import { service } from '@ember/service';
import { format, isValid } from 'date-fns';

const AI_GENERATION_REPORT_HEADERS = [
  'Name of workspace',
  'Workspace URL',
  'Workspace Owner',
  'Original Submitter',
  'Submission ID',
  'Submission or Revision',
  'Text of Submission',
  'AI Variant Key',
  'AI Variant Label',
  'AI Draft Text',
  'AI Rating',
  'AI Rating Text',
  'AI Is Selected',
  'AI Response Time (ms)',
  'AI RAG Enabled',
  'AI Generated At',
  'AI Request Made By',
  'Sent Selection Count',
  'Sent Annotation Count',
  'Sent Annotation Snapshot',
  'Final Edit Text',
];

export default class AiGenerationReportsService extends Service {
  @service jsonCsv;

  readPath(source, path) {
    if (!source || !path) return undefined;
    const segments = String(path).split('.');
    let current = source;

    for (let index = 0; index < segments.length; index++) {
      if (current == null) return undefined;

      const segment = segments[index];
      if (segment === 'firstObject' && Array.isArray(current)) {
        current = current[0];
        continue;
      }

      if (typeof current.get === 'function') {
        const remainingPath = segments.slice(index).join('.');
        const valueFromGet = current.get(remainingPath);
        if (valueFromGet !== undefined) {
          return valueFromGet;
        }
      }

      current = current[segment];
    }

    return current;
  }

  canonicalVariantInfo(variant) {
    const rawKey = String(variant?.variantKey || '')
      .trim()
      .toUpperCase();
    const rawLabel = String(variant?.variantLabel || '').trim();

    // Preserve stored keys for historical rows (including legacy C/D).
    // New rows are expected to persist as A/B/E/F from backend config.
    const defaultLabels = {
      A: 'Variant A: Student Work Only (RAG On)',
      B: 'Variant B: Student Work + Selections + Comments (All) (RAG On)',
      C: 'Variant C: Student Work Only (RAG Off)',
      D: 'Variant D: Student Work + Selections + Comments (All) (RAG Off)',
      E: 'Variant E: Student Work Only (RAG Off)',
      F: 'Variant F: Student Work + Selections + Comments (All) (RAG Off)',
    };

    return {
      key: rawKey,
      label: rawLabel || defaultLabels[rawKey] || '',
    };
  }

  stripHtml(text) {
    if (!text) return '';
    const withoutTags = String(text).replace(/<\/?[^>]+(>|$)/g, '');
    if (typeof document === 'undefined') return withoutTags;
    const decoder = document.createElement('textarea');
    decoder.innerHTML = withoutTags;
    return decoder.value;
  }

  normalizeObjectId(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (value._id) return this.normalizeObjectId(value._id);
      if (value.id) return String(value.id);
    }
    return String(value);
  }

  formatDateTimeOrEmpty(value) {
    if (!value) return '';
    const dateValue = value instanceof Date ? value : new Date(value);
    return isValid(dateValue) ? format(dateValue, 'MM/dd/yyyy HH:mm') : '';
  }

  formatDateOnlyOrEmpty(value) {
    if (!value) return '';
    const dateValue = value instanceof Date ? value : new Date(value);
    return isValid(dateValue) ? format(dateValue, 'MM/dd/yyyy') : '';
  }

  getUserDisplay(user) {
    if (!user) return '';
    if (typeof user === 'string') return user;
    if (typeof user === 'object') {
      if (user.username) return user.username;
      if (user._id) return this.normalizeObjectId(user._id);
      if (user.id) return String(user.id);
    }
    return this.normalizeObjectId(user);
  }

  buildSubmissionLabels(submissions) {
    const bySubmitter = submissions.reduce((acc, submission) => {
      const submitter = submission.student || 'Unknown Submitter';
      if (!acc[submitter]) {
        acc[submitter] = [];
      }
      acc[submitter].push(submission);
      return acc;
    }, {});

    const labels = new Map();
    Object.keys(bySubmitter).forEach((submitter) => {
      bySubmitter[submitter]
        .slice()
        .sort((a, b) => new Date(a.createDate) - new Date(b.createDate))
        .forEach((submission, index) => {
          labels.set(
            submission.id,
            index === 0 ? 'Original Submission' : `Revision ${index}`
          );
        });
    });

    return labels;
  }

  getSubmissionText(submission) {
    const answerText = this.readPath(submission, 'answer.answer');
    const answerExplanation = this.readPath(submission, 'answer.explanation');
    const summary = submission?.shortAnswer
      ? this.stripHtml(submission.shortAnswer)
      : this.stripHtml(answerText);

    const fullAnswer = submission?.longAnswer
      ? this.stripHtml(submission.longAnswer)
      : answerExplanation
      ? this.stripHtml(answerExplanation)
      : '';

    return `Summary: ${summary}  Full Answer: ${fullAnswer}`;
  }

  countSentAnnotations(sentAnnotations) {
    const selections = Array.isArray(sentAnnotations) ? sentAnnotations : [];
    return selections.reduce((count, selection) => {
      const comments = Array.isArray(selection?.comments)
        ? selection.comments
        : [];
      return count + comments.length;
    }, 0);
  }

  buildSentAnnotationSnapshot(sentAnnotations) {
    const selections = Array.isArray(sentAnnotations) ? sentAnnotations : [];
    if (!selections.length) return '';

    return selections
      .map((selection) => {
        const selectedText = this.stripHtml(selection?.selectedText || '');
        const selector = selection?.selectorUsername || '';
        const selectorDate = this.formatDateOnlyOrEmpty(
          selection?.selectorDate
        );
        const comments = Array.isArray(selection?.comments)
          ? selection.comments
          : [];
        const commentSummary = comments.length
          ? comments
              .map((comment) => {
                const type = comment?.type || 'Annotation';
                const annotator = comment?.annotatorUsername || '';
                const annotatorDate = this.formatDateOnlyOrEmpty(
                  comment?.annotatorDate
                );
                const text = this.stripHtml(comment?.text || '');
                return `${type} by ${annotator} (${annotatorDate}): ${text}`;
              })
              .join(' | ')
          : 'No annotation';
        return `[${selector} ${selectorDate}] ${selectedText} => ${commentSummary}`;
      })
      .join(' || ');
  }

  async fetchVariantsForSubmissions(submissions, workspaceId) {
    if (!Array.isArray(submissions) || submissions.length === 0) {
      return [];
    }

    const submissionIds = submissions
      .map((submission) => submission.id)
      .join(',');
    const queryParams = new URLSearchParams();
    queryParams.set('submissionIds', submissionIds);
    if (workspaceId) {
      queryParams.set('workspaceId', workspaceId);
    }

    try {
      const response = await fetch(
        `/api/aiVariants?${queryParams.toString()}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.variants) ? data.variants : [];
    } catch (error) {
      console.error(
        '[AI Generation Report] Error fetching AI variants:',
        error
      );
      return [];
    }
  }

  normalizeRows(rows) {
    return rows.map((row) =>
      AI_GENERATION_REPORT_HEADERS.reduce((acc, header) => {
        acc[header] = row[header] ?? '';
        return acc;
      }, {})
    );
  }

  async aiGenerationReportCsv(model) {
    const submissionsArray = model?.submissions?.slice?.() || [];
    const submissionLabels = this.buildSubmissionLabels(submissionsArray);
    const submissionById = new Map(
      submissionsArray.map((submission) => [submission.id, submission])
    );
    const variants = await this.fetchVariantsForSubmissions(
      submissionsArray,
      model?.workspace?.id
    );

    const rows = variants.map((variant) => {
      const normalizedVariant = this.canonicalVariantInfo(variant);
      const submissionId = this.normalizeObjectId(
        variant?.submission?._id || variant?.submission
      );
      const submission = submissionById.get(submissionId);
      const sentAnnotations = Array.isArray(variant?.sentAnnotations)
        ? variant.sentAnnotations
        : [];
      return {
        'Name of workspace':
          this.readPath(submission, 'workspaces.firstObject.name') ||
          model?.workspace?.name,
        'Workspace URL': window.location.href,
        'Workspace Owner':
          this.readPath(model?.workspace, 'owner.username') || '',
        'Original Submitter':
          submission?.student || variant?.submission?.student || '',
        'Submission ID': submissionId,
        'Submission or Revision': submissionLabels.get(submissionId) || '',
        'Text of Submission': submission
          ? this.getSubmissionText(submission)
          : '',
        'AI Variant Key': normalizedVariant.key || '',
        'AI Variant Label': normalizedVariant.label || '',
        'AI Draft Text': this.stripHtml(variant?.draftText || ''),
        'AI Rating': variant?.rating ?? '',
        'AI Rating Text': this.stripHtml(variant?.teacherNotes || ''),
        'AI Is Selected': variant?.isSelected ? 'Yes' : 'No',
        'AI Response Time (ms)': variant?.responseTime ?? '',
        'AI RAG Enabled': variant?.ragEnabled ? 'Yes' : 'No',
        'AI Generated At': this.formatDateTimeOrEmpty(variant?.createDate),
        'AI Request Made By': this.getUserDisplay(variant?.createdBy),
        'Sent Selection Count': sentAnnotations.length,
        'Sent Annotation Count': this.countSentAnnotations(sentAnnotations),
        'Sent Annotation Snapshot':
          this.buildSentAnnotationSnapshot(sentAnnotations),
        'Final Edit Text': this.stripHtml(
          variant?.finalVersionText || submission?.aiFinalEditText || ''
        ),
      };
    });

    return {
      headers: AI_GENERATION_REPORT_HEADERS,
      data: this.normalizeRows(rows),
    };
  }

  async aiGenerationReport(model) {
    const { headers, data } = await this.aiGenerationReportCsv(model);
    return this.jsonCsv.arrayToCsv(data, headers);
  }
}
