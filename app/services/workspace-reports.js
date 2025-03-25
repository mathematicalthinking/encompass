import Service from '@ember/service';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class WorkspaceReportsService extends Service {
  @service jsonCsv;
  @service currentUrl;

  getUniqueFolderNames(submission) {
    const folderNames = new Set();
    const selections = submission.get('selections') || [];
    selections.forEach((selection) => {
      const folders = selection.get('folders') || [];
      folders.forEach((folder) => {
        folderNames.add(folder.get('name'));
      });
    });
    return Array.from(folderNames);
  }

  submissionReportCsv(model) {
    const submissionsArray = model.submissions.slice();

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
      const baseData = {
        'Name of workspace': submission.get('workspaces.firstObject.name'),
        'Workspace URL': this.currentUrl.currentUrl,
        'Workspace Owner': model.workspace.get('owner.username'),
        'Original Submitter': submission.student,
        'Text of Submission': `Summary: ${
          submission.shortAnswer
            ? submission.shortAnswer
            : submission.get('answer.answer')
        }  Full Answer: ${
          submission.longAnswer
            ? submission.longAnswer
            : submission.get('answer.explanation')
            ? submission
                .get('answer.explanation')
                .replace(/<\/?[^>]+(>|$)/g, '')
            : ''
        }`,
        'Submission ID': submission.id,
        'Submission or Revision': submission.submissionLabel,
        'Number of Workspace Folders': model.workspace.foldersLength,
        'Number of Notice/Wonder/Feedback': model.workspace.commentsLength,
        'Folders used for this submission':
          this.getUniqueFolderNames(submission).join(';'),
      };
      const selections = submission.get('selections').slice();
      if (selections.length === 0) {
        // For submissions without selections, return the base data only
        return [baseData];
      } else {
        // For submissions with selections, add additional columns
        return selections.map((selection, index) => {
          const selectorInfo = this.createSelectorInfo(selection);
          let selectionData = {
            [`Selector of Text ${index + 1}`]: selectorInfo.username,
            [`Text of Selection ${index + 1}`]: selectorInfo.text,
            [`Selector Date ${index + 1}`]: selectorInfo.selectionCreateDate,
            [`Annotator ${index + 1}`]: selectorInfo.annotatorUsername,
            [`Text of Annotator ${index + 1}`]: selectorInfo.annotatorText,
            [`Annotator Date ${index + 1}`]: selectorInfo.annotatorCreateDate,
          };

          return { ...baseData, ...selectionData };
        });
      }
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

    const selectionCreateDate = moment(selector.get('createDate')).format(
      'MM/DD/YYYY'
    );
    const text = selector.get('text');
    const username = selector.get('createdBy.username');
    const annotatorText = selector.get('comments.firstObject.text');
    const annotatorUsername = selector.get(
      'comments.firstObject.createdBy.username'
    );
    const annotatorCreateDate = moment(
      selector.get('comments.firstObject.createDate')
    ).format('MM/DD/YYYY');
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
  submissionReport(model) {
    const { headers, data } = this.submissionReportCsv(model);
    return this.jsonCsv.arrayToCsv(data, headers);
  }

  responseReport(model) {
    return this.jsonCsv.arrayToCsv(this.responseReportCsv(model));
  }
}
