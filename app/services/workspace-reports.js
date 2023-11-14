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

      const selector = submission.selections.map((item) => {
        return item.comments
          .map((comment) => {
            const usernameOfSelector = comment.get('createdBy.username');
            return usernameOfSelector;
          })
          .filter(Boolean)
          .join('');
      });
      const filteredSelector = selector.toArray()[0];
      const textOfSelection = submission.selections.toArray()[0].text;

      const selectionDate = moment(
        submission.selections.toArray().length > 0
          ? submission.selections.toArray()[0].createDate
          : ''
      ).format('MM/DD/YYYY');

      const submissionNumber = index + 1;
      const submissionId = submission.id;
      const foldersLength = model.workspace.foldersLength;
      const commentsLength = model.workspace.commentsLength;
      const dateOfSubmission = moment(submission.createDate).format(
        'MM/DD/YYYY'
      );
      return {
        'Name of workspace': workspace,
        'Workspace URL': workspaceUrl,
        'Workspace Owner': workspaceOwner,
        'Original Submitter': submitter,
        'Text of Submission': text,
        'Date of Submission': dateOfSubmission,
        'Submission #': submissionNumber,
        'Submission ID': submissionId,
        'Selector of text': filteredSelector,
        'Text of Selection': textOfSelection,
        'Date of Selection':
          selectionDate === 'Invalid date' ? '' : selectionDate,
        'Number of Folders': foldersLength,
        'Number of Notice/Wonder/Feedback': commentsLength,
      };
    });
  }

  submissionReport(model) {
    return this.jsonCsv.arrayToCsv(this.submissionReportCsv(model));
  }

  //   responseReport(model) {
  //     return this.jsonCsv.arrayToCsv(this.responseReportCsv(model));
  //   }
}
