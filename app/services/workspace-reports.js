import Service from '@ember/service';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class WorkspaceReportsService extends Service {
  @service jsonCsv;
  @service currentUrl;

  submissionReportCsv(model) {
    const submissionsArray = model.submissions.toArray();

    // Sort the submissions by date in descending order
    const sortedSubmissions = submissionsArray.sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateA - dateB; // For descending order
    });
    return sortedSubmissions.map((submission, index) => {
      // regex used on below to remove <p> tags, model returning such tags.
      const text = `${
        submission.shortAnswer
          ? submission.shortAnswer
          : submission.get('answer.answer')
      }  ${
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

      const firstSelector = submission.get('selectors.firstObject');
      const selectorInfo = this.createSelectorInfo(firstSelector);

      return {
        'Name of workspace': workspace,
        'Workspace URL': workspaceUrl,
        'Workspace Owner': workspaceOwner,
        'Original Submitter': submitter,
        'Text of Submission': text,
        'Date of Submission': dateOfSubmission,
        'Submission #': submissionNumber,
        'Submission ID': submissionId,
        'Selector of text': selectorInfo.username,
        'Text of Selection': selectorInfo.text,
        'Date of Selection': selectorInfo.createDate,
        'Number of Folders': foldersLength,
        'Number of Notice/Wonder/Feedback': commentsLength,
      };
    });
  }

  createSelectorInfo(selector) {
    const defaultSelection = {
      createDate: '',
      text: '',
      username: '',
      annotator: '',
      annotatorText: '',
    };

    // Extract values, potentially undefined
    const createDate = selector.get('createDate');
    const text = selector.get('text');
    const username = selector.get('comments.firstObject.createdBy.username');

    // Create an object with the extracted values
    const selectorInfo = { createDate, text, username };

    // Use Object.assign to fill in defaults for undefined values
    return Object.assign({}, defaultSelection, selectorInfo);
  }

  submissionReport(model) {
    return this.jsonCsv.arrayToCsv(this.submissionReportCsv(model));
  }

  //   responseReport(model) {
  //     return this.jsonCsv.arrayToCsv(this.responseReportCsv(model));
  //   }
}
