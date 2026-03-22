import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { format, isValid } from 'date-fns';

export default class WorkspaceReportsService extends Service {
  @service jsonCsv;

  stripHtml(text) {
    if (!text) return '';
    const withoutTags = String(text).replace(/<\/?[^>]+(>|$)/g, '');
    if (typeof document === 'undefined') return withoutTags;
    const decoder = document.createElement('textarea');
    decoder.innerHTML = withoutTags;
    return decoder.value;
  }

  getUniqueFolderNames(selection) {
    const folderNames = new Set();
    const folders = (selection.get('folders') || []).filterBy(
      'isTrashed',
      false
    );
    folders.forEach((folder) => {
      folderNames.add(folder.get('name'));
    });
    return Array.from(folderNames);
  }

  async fetchProblemTextsForSubmissions(submissions, workspaceId) {
    if (!workspaceId || !Array.isArray(submissions) || submissions.length === 0)
      return {};

    const submissionIds = submissions.map((s) => s.id).join(',');

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/problemTexts?submissionIds=${submissionIds}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        return {};
      }

      const data = await response.json();
      return data.problemTexts || {};
    } catch (error) {
      console.error('[Workspace Report] Error fetching problem texts:', error);
      return {};
    }
  }

  getPuzzleText(submission) {
    if (!submission) {
      return 'The student is sharing their mathematical thinking and work.';
    }

    try {
      // Primary: assignment problem description
      const answer = submission.get('answer');
      if (answer) {
        const assignment = answer.get('assignment');
        if (assignment) {
          const problem = assignment.get('problem');
          if (problem) {
            const text = this.stripHtml(problem.get('text'));
            if (text) return text;
          }
        }
      }
    } catch (e) {
      // Continue to fallback
    }

    try {
      // Secondary: problem text via problemId
      const publication = submission.get('publication');
      if (publication && publication.get('puzzle.problemId')) {
        const problem = submission.get('problem');
        if (problem) {
          const text = this.stripHtml(problem.get('text'));
          if (text) return text;
        }
      }
    } catch (e) {
      // Continue to fallback
    }

    try {
      // Fallback: pdSet context for legacy data
      const pdSetTitle = this.stripHtml(submission.get('pdSet'));
      if (pdSetTitle) {
        const fallbackParts = [pdSetTitle.split(' - ')[0].trim()];

        const publication = submission.get('publication');
        if (publication) {
          const powId = publication.get('publicationId');
          if (powId) fallbackParts.push(`PoW ID: ${powId}`);
        }

        const clazz = submission.get('clazz');
        if (clazz) {
          const className = this.stripHtml(clazz.get('name'));
          if (className) fallbackParts.push(`Class: ${className}`);
        }

        return `${fallbackParts.join(
          '. '
        )}. The student is sharing their mathematical thinking and work.`;
      }
    } catch (e) {
      // Continue to final fallback
    }

    // Final fallback
    return 'The student is sharing their mathematical thinking and work.';
  }

  buildSelectionRowsFromSubmission(submission) {
    const selections = submission
      .get('selections')
      .filterBy('isTrashed', false)
      .slice();

    return selections.length === 0
      ? [
          {
            [`Selector of Text`]: '',
            [`Text of Selection`]: '',
            [`Selector Date`]: '',
            [`Annotator`]: '',
            [`Text of Annotator`]: '',
            [`Annotation Label`]: '',
            [`Annotator Date`]: '',
            [`Folder(s) for Selection`]: '',
          },
        ]
      : selections.flatMap((selection) => {
          const selectorInfo = this.createSelectorInfo(selection);
          const folders = this.getUniqueFolderNames(selection).join('; ');
          const comments = (selection.get('comments') || []).filterBy(
            'isTrashed',
            false
          );

          if (comments.length === 0) {
            return [
              {
                [`Selector of Text`]: selectorInfo.username,
                [`Text of Selection`]: selectorInfo.text,
                [`Selector Date`]: selectorInfo.selectionCreateDate,
                [`Annotator`]: '',
                [`Text of Annotator`]: '',
                [`Annotation Label`]: '',
                [`Annotator Date`]: '',
                [`Folder(s) for Selection`]: folders,
              },
            ];
          }

          return comments.map((comment) => {
            const annotatorText = this.stripHtml(comment.get('text'));
            const annotatorUsername = comment.get('createdBy.username');
            const commentDate = new Date(comment.get('createDate'));
            const annotatorCreateDate = isValid(commentDate)
              ? format(commentDate, 'MM/dd/yyyy')
              : '';
            return {
              [`Selector of Text`]: selectorInfo.username,
              [`Text of Selection`]: selectorInfo.text,
              [`Selector Date`]: selectorInfo.selectionCreateDate,
              [`Annotator`]: annotatorUsername,
              [`Text of Annotator`]: annotatorText,
              [`Annotation Label`]: comment.get('label') || '',
              [`Annotator Date`]: annotatorCreateDate,
              [`Folder(s) for Selection`]: folders,
            };
          });
        });
  }

  async submissionReportCsv(model) {
    const submissionsArray = model.submissions.slice();
    const problemTextsBySubmission = await this.fetchProblemTextsForSubmissions(
      submissionsArray,
      model.workspace?.id
    );

    // Group submissions by submitter
    const submissionsByUser = submissionsArray.reduce((acc, submission) => {
      const submitter = submission.student;
      if (!acc[submitter]) {
        acc[submitter] = [];
      }
      acc[submitter].push(submission);
      return acc;
    }, {});

    // Sort each group by date and label submissions
    Object.keys(submissionsByUser).forEach((submitter) => {
      submissionsByUser[submitter].sort(
        (a, b) => new Date(a.createDate) - new Date(b.createDate)
      );

      submissionsByUser[submitter].forEach((submission, index) => {
        submission.submissionLabel =
          index === 0 ? 'Original Submission' : `R${index}`;
      });
    });

    // Flatten the grouped submissions back into an array
    const labeledSubmissions = [].concat(...Object.values(submissionsByUser));

    // Generate CSV data with dynamic columns for selections
    const data = labeledSubmissions.flatMap((submission) => {
      const staticData = {
        'Name of workspace': submission.get('workspaces.firstObject.name'),
        'Workspace URL': window.location.href,
        'Workspace Owner': model.workspace.get('owner.username'),
        'Original Submitter': submission.student,
        'Puzzle Text': this.stripHtml(
          problemTextsBySubmission[submission.id] ||
            this.getPuzzleText(submission)
        ),
        'Text of Submission': `Summary: ${
          submission.shortAnswer
            ? this.stripHtml(submission.shortAnswer)
            : this.stripHtml(submission.get('answer.answer'))
        }  Full Answer: ${
          submission.longAnswer
            ? this.stripHtml(submission.longAnswer)
            : submission.get('answer.explanation')
            ? this.stripHtml(submission.get('answer.explanation'))
            : ''
        }`,
        'Submission ID': submission.id,
        'Submission or Revision': submission.submissionLabel,
        'Number of Workspace Folders': model.workspace.foldersLength,
        'Number of Notice/Wonder/Feedback': model.workspace.commentsLength,
      };
      const selectionRows = this.buildSelectionRowsFromSubmission(submission);
      return selectionRows.map((selectionData) => ({
        ...staticData,
        ...selectionData,
      }));
    });

    const headers = [...new Set(data.flatMap((row) => Object.keys(row)))];
    return { headers, data };
  }

  createSelectorInfo(selector) {
    const defaultSelection = {
      createDate: '',
      text: '',
      username: '',
      commentText: '',
    };

    if (!selector) return defaultSelection;

    const createDate = new Date(selector.get('createDate'));
    const selectionCreateDate = isValid(createDate)
      ? format(createDate, 'MM/dd/yyyy')
      : '';

    const text = this.stripHtml(selector.get('text'));
    const username = selector.get('createdBy.username');
    const annotatorText = this.stripHtml(
      selector.get('comments.firstObject.text')
    );
    const annotatorUsername = selector.get(
      'comments.firstObject.createdBy.username'
    );

    const commentCreateDate = new Date(
      selector.get('comments.firstObject.createDate')
    );
    const annotatorCreateDate = isValid(commentCreateDate)
      ? format(commentCreateDate, 'MM/dd/yyyy')
      : '';
    const selectorInfo = {
      selectionCreateDate,
      text,
      username,
      annotatorText,
      annotatorUsername,
      annotatorCreateDate,
    };
    return Object.assign({}, defaultSelection, selectorInfo);
  }

  generateRevisionFields(submissionLabel, maxRevisions) {
    let revisionFields = {};
    for (let i = 1; i <= maxRevisions; i++) {
      revisionFields[`R${i}`] =
        submissionLabel === `R${i}` ? format(new Date(), 'MM/dd/yyyy') : '';
    }
    return revisionFields;
  }
  responseReportCsv(model) {
    const submissionsArray = model.submissions.toArray();
    const sortedSubmissions = submissionsArray.sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateA - dateB; // For descending order
    });
    return sortedSubmissions.map((submission) => {
      // TODO: Name of mentoring responder should not be the submission creator
      // - grab through submission.response? Username
      // const mentoringResponder = submission.get('createdBy.username')
      const submitter = submission.student;
      const submissionId = submission.id;
      const responseText = submission.responses
        .map((response) => {
          if (response.text !== undefined && response.text !== null) {
            if (typeof response.text === 'string') {
              return response.text.replace(/<\/?[^>]+(>|$)/g, '');
            }
          }
          return ''; // Ensure that there is always a return value.
        })
        .join('\n'); // Join responses with a newline character.
      const responseCreateDate = submission.responses
        .map((response) => {
          const responseDate = new Date(response.createDate);
          return isValid(responseDate)
            ? format(responseDate, 'MM/dd/yyyy')
            : 'No Date';
        })
        .join('\n');
      const responseId = submission.responses
        .map((response) => {
          return response.id;
        })
        .join('\n');
      // ** TODO ** Add another mentoring responder to make sure this looks good.
      const mentoringResponder = submission.responses.map((response) => {
        return response.get('createdBy.username')
          ? response.get('createdBy.username')
          : 'No Mentoring Responder';
      });
      return {
        'Mentoring Responder': mentoringResponder,
        'Original Submitter': submitter,
        'Submission #': submissionId,
        'Text of mentoring response': responseText,
        'Date of response': responseCreateDate,
        'Response ID': responseId,
      };
    });
  }
  async submissionReport(model) {
    const { headers, data } = await this.submissionReportCsv(model);
    return this.jsonCsv.arrayToCsv(data, headers);
  }

  responseReport(model) {
    return this.jsonCsv.arrayToCsv(this.responseReportCsv(model));
  }
}
