import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { select } from 'underscore';

export default class MetricsWorkspaceController extends Controller {
  @tracked showSubmissions = false;
  @tracked showCloud = false;
  @service jsonCsv;
  @service currentUrl;
  submissionsColumns = [
    { name: 'Record', valuePath: 'recordType' },
    { name: 'Creator', valuePath: 'creator' },
    { name: 'Text', valuePath: 'text' },
  ];
  get prepWorkspaceForCsv() {
    return this.model.submissions.map((submission) => {
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
      const workspaceOwner = this.model.workspace.get('owner.username');

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
      const foldersLength = this.model.workspace.foldersLength;
      const commentsLength = this.model.workspace.commentsLength;
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

  get workspaceCsv() {
    return this.jsonCsv.arrayToCsv(this.prepWorkspaceForCsv);
  }
  @action
  handleToggle(prop) {
    this.showSubmissions = false;
    this.showCloud = false;
    this[prop] = true;
  }
  get tableRows() {
    return this.model.submissions.map((submission) => {
      const text = `<div>${
        submission.shortAnswer
          ? submission.shortAnswer
          : submission.get('answer.answer')
      } <br><br> ${
        submission.longAnswer
          ? submission.longAnswer
          : submission.get('answer.explanation')
      }</div>`;
      const selections = submission.get('selections');
      const children = selections.map((selection) => {
        const comments = selection.get('comments');
        const taggings = selection.get('folders');
        const selectionComments = comments.map((comment) => {
          return {
            text: comment.text,
            recordType: comment.constructor.modelName,
            creator: comment.get('createdBy.displayName'),
          };
        });
        const selectionTaggings = taggings.map((tagging) => {
          return {
            text: tagging.get('name'),
            recordType: 'folder',
            creator: tagging.get('createdBy.displayName'),
          };
        });
        return {
          text: selection.text,
          recordType: selection.constructor.modelName,
          creator: selection.get('createdBy.displayName'),
          children: [...selectionTaggings, ...selectionComments],
        };
      });
      return {
        text,
        recordType: submission.constructor.modelName,
        creator: submission.student,
        id: submission.id,
        children,
      };
    });
  }
  get list() {
    // eslint-disable-next-line prettier/prettier
    const ignore = [
      'the',
      'and',
      'of',
      'in',
      'on',
      'into',
      'to',
      'a',
      'is',
      'that',
      'you',
      'i',
      'was',
      'would',
      'at',
      'your',
      'my',
      'for',
      'but',
      'it',
      'if',
      'or',
      '',
      'this',
      'what',
      'she',
      'he',
      'off',
      'be',
      'is',
      'are',
      'was',
      'have',
      'can',
      'did',
      'we',
      'me',
      'our',
      'very',
      'which',
      'had',
      'not',
      'do',
    ];
    const result = {};
    const comments = this.model.workspace.comments.mapBy('text');
    const responses = this.model.workspace.comments.mapBy('responses');
    comments.forEach((comment) => {
      if (!comment) return;
      comment
        // eslint-disable-next-line no-useless-escape
        .replace(/[:\(\)",!\?\.]/gm, '')
        .split(/\s/g)
        .forEach((word) => {
          if (
            result[word.toLowerCase()] &&
            !ignore.includes(word.toLowerCase())
          ) {
            result[word.toLowerCase()]++;
          } else if (!ignore.includes(word.toLowerCase())) {
            result[word.toLowerCase()] = 1;
          }
        });
    });
    responses.forEach((comment) => {
      if (!comment) return;
      comment
        // eslint-disable-next-line no-useless-escape
        .replace(/[:\(\)",!\?\.]/gm, '')
        .split(/\s/g)
        .forEach((word) => {
          if (
            result[word.toLowerCase()] &&
            !ignore.includes(word.toLowerCase())
          ) {
            result[word.toLowerCase()]++;
          } else if (!ignore.includes(word.toLowerCase())) {
            result[word.toLowerCase()] = 1;
          }
        });
    });
    return Object.keys(result).map((key) => [key, result[key]]);
  }
}
