import Service from '@ember/service';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class WorkspaceReportsService extends Service {
  @service jsonCsv;
  @service currentUrl;

  submissionReportCsv(model) {
    return model.submissions.map((submission) => {
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
      const filteredSelector = selector.filter(Boolean).join(', ');
      const textOfSelection = submission.selections.map((item) => {
        return item.text;
      });
      const filteredTextOfSelection = textOfSelection
        .filter(Boolean)
        .join(', ');

      // This is returning multiple different dates, adding new columns in csv file.
      // What do we want to do when there are multiple selections? Do we want the original date? Do we add columns (can get messy)
      const selectionDate = submission.selections.map((item) => {
        return moment(item.createDate).format('MM/DD/YYYY');
      });
      console.log('submission:', submission);
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
        'Selector of text': filteredSelector,
        'Text of Selection': filteredTextOfSelection,
        'Date of Selection': selectionDate,
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
