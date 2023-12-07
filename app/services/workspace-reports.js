import Service from '@ember/service';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class WorkspaceReportsService extends Service {
  @service jsonCsv;
  @service currentUrl;

  submissionReportCsv(model) {
    const submissionsArray = model.submissions.toArray();


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

    return labeledSubmissions.map((submission, index) => {
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

      let selectorInfo = {};
      submission.get('selections').map((selection) => {
        selectorInfo = this.createSelectorInfo(selection);
      });

      return {
        'Name of workspace': workspace,
        'Workspace URL': workspaceUrl,
        'Workspace Owner': workspaceOwner,
        'Original Submitter': submitter,
        'Text of Submission': text,
        'Date of Submission': dateOfSubmission,
        'Submission ID': submissionId,
        'Submission or Revision': submission.submissionLabel,
        'Selector of text': selectorInfo.username,
        'Text of Selection': selectorInfo.text,
        'Date of Selection': selectorInfo.createDate,
        'Original Annotator': selectorInfo.username,
        'Text of annotator': selectorInfo.commentText,
        'Date of annotation': selectorInfo.createDate,
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
      commentText: '',
    };

    if (!selector) return defaultSelection;

    const createDate = moment(selector.get('createDate')).format('MM/DD/YYYY');
    const text = selector.get('text');
    const username = selector.get('createdBy.username');
    const commentText = selector.get('comments.firstObject.text');

    const selectorInfo = { createDate, text, username, commentText };
    return Object.assign({}, defaultSelection, selectorInfo);
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
