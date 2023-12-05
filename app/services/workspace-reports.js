import Service from '@ember/service';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class WorkspaceReportsService extends Service {
  @service jsonCsv;
  @service currentUrl;

  submissionReportCsv(model) {
    const submissionsArray = model.submissions.toArray();
    let allRows = []; // This will store all the rows for the CSV file

    const sortedSubmissions = submissionsArray.sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateA - dateB; // For descending order
    });

    sortedSubmissions.forEach((submission, index) => {
      // Common data for all rows related to this workspace report
      const commonData = {
        'Name of workspace': submission.get('workspaces.firstObject.name'),
        'Workspace URL': this.currentUrl.currentUrl,
        'Workspace Owner': model.workspace.get('owner.username'),
        'Original Submitter': submission.student,
        'Text of Submission':
          submission.shortAnswer || submission.get('answer.answer') || '',
        'Date of Submission': moment(submission.createDate).format(
          'MM/DD/YYYY'
        ),
        'Submission ID': submission.id,
        'Submission or Revision':
          index === 0 ? 'Original Submission' : `Revision: ${index}`,
        'Number of Folders': model.workspace.foldersLength,
        'Number of Notice/Wonder/Feedback': model.workspace.commentsLength,
        'Submission Order': index + 1,
      };

      // If no selections, output the submission with empty selection details
      if (!submission.get('selections.length')) {
        allRows.push({
          ...commonData,
          'Selector of text': '',
          'Text of Selection': '',
          'Date of Selection': '',
          'Original Annotator': '',
          'Text of annotator': '',
          'Date of annotation': '',
        });
      } else {
        // For submissions with selections, output a row for each selection
        submission.get('selections').forEach((selection) => {
          const selectorInfo = this.createSelectorInfo(selection);
          let selectionRow = {
            ...commonData, // Spread common data
            'Selector of text': selectorInfo.username,
            'Text of Selection': selectorInfo.text,
            'Date of Selection': selectorInfo.createDate,
            'Original Annotator': selectorInfo.username,
            'Text of annotator': selectorInfo.commentText,
            'Date of annotation': selectorInfo.createDate,
          };
          allRows.push(selectionRow);
        });
      }
    });

    return allRows;
  }

  createSelectorInfo(selector) {
    const defaultSelection = {
      createDate: '',
      text: '',
      username: '',
      commentText: '',
    };

    if (!selector) {
      return defaultSelection;
    }

    const createDate = moment(selector.get('createDate')).format('MM/DD/YYYY');
    const text = selector.get('text');
    const username = selector.get('createdBy.username');
    const commentText = selector.get('comments.firstObject.text');

    return {
      createDate: createDate,
      text: text,
      username: username,
      commentText: commentText,
    };
  }

  generateRevisionFields(submissionLabel, maxRevisions) {
    let revisionFields = {};
    for (let i = 1; i <= maxRevisions; i++) {
      revisionFields[`R${i}`] =
        submissionLabel === `R${i}` ? moment().format('MM/DD/YYYY') : '';
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
      const mentoringResponder = submission.get('createdBy.username');
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
          return response.createDate
            ? moment(response.createDate).format('MM/DD/YYYY')
            : 'No Date';
        })
        .join('\n');
      const responseId = submission.responses
        .map((response) => {
          return response.id;
        })
        .join('\n');
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
  submissionReport(model) {
    return this.jsonCsv.arrayToCsv(this.submissionReportCsv(model));
  }

  responseReport(model) {
    return this.jsonCsv.arrayToCsv(this.responseReportCsv(model));
  }
}
