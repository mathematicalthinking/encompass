import Service from '@ember/service';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class WorkspaceReportsService extends Service {
  @service jsonCsv;
  @service currentUrl;

  submissionReportCsv(model) {
    const submissionsArray = model.submissions.toArray();
    const sortedSubmissions = submissionsArray.sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateA - dateB; // For descending order
    });

    return sortedSubmissions.map((submission, index) => {
      // regex used on below to remove <p> tags, model returning such tags.
      // Submission answers should describe the short answer (which is the summary), and the long answer (which is the full answer).
      const text = `Summary: ${
        submission.shortAnswer
          ? submission.shortAnswer
          : submission.get('answer.answer')
      }  Full Answer: ${
        submission.longAnswer
          ? submission.longAnswer
          : submission.get('answer.explanation')
          ? submission.get('answer.explanation').replace(/<\/?[^>]+(>|$)/g, '')
          : ''
      }`;

      const workspaceUrl = this.currentUrl.currentUrl;
      const workspace = submission.get('workspaces.firstObject.name');
      const submitter = submission.student;
      const workspaceOwner = model.workspace.get('owner.username');

      const submissionNumber = index + 1;
      const submissionId = submission.id;
      const foldersLength = model.workspace.foldersLength;
      const commentsLength = model.workspace.commentsLength;
      const dateOfSubmission = moment(submission.createDate).format(
        'MM/DD/YYYY'
      );
      const firstSelector = submission.get('selections.firstObject');
      // Selector info is only getting the first selector info, not all of them for the annotator.
      // The annotator needs to bring all the selectors, not just the first one.
      const selectorInfo = this.createSelectorInfo(firstSelector);
      const annotator = firstSelector
        ? firstSelector.get('comment.createdBy.username')
        : '';
      const annotatorText = firstSelector ? firstSelector.get('text') : '';

      return {
        'Name of workspace': workspace,
        'Workspace URL': workspaceUrl,
        'Workspace Owner': workspaceOwner,
        'Original Submitter': submitter,
        'Text of Submission': text,
        'Date of Submission': dateOfSubmission,
        'Submission ID': submissionId,
        'Original Annotator': annotator,
        'Text of annotator': annotatorText,
        'Date of annotation': selectorInfo.createDate,
        'Selector of text': selectorInfo.username,
        'Text of Selection': selectorInfo.text,
        'Date of Selection': selectorInfo.createDate,
        'Number of Folders': foldersLength,
        'Number of Notice/Wonder/Feedback': commentsLength,
        'Submission Order': submissionNumber,
      };
    });
  }

  createSelectorInfo(selector) {
    const defaultSelection = {
      createDate: '',
      text: '',
      username: '',
    };
    if (!selector) return defaultSelection;
    // Extract values, potentially undefined
    const createDate = selector.get('createDate');
    const text = selector.get('text');
    const username = selector.get('comments.firstObject.createdBy.username');
    // Create an object with the extracted values
    const selectorInfo = { createDate, text, username };

    // Use Object.assign to fill in defaults for undefined values
    return Object.assign({}, defaultSelection, selectorInfo);
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
