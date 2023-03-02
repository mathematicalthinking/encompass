import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import moment from 'moment';

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
      const selections = submission.get('selections');
      let taggings = selections.map((selection) =>
        selection.get('taggings').toArray()
      );
      taggings = taggings.flat();
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
      console.log(workspaceUrl);
      const workspace = submission.get('workspaces.firstObject.name');
      const submitter = submission.student;
      const selectionsLength = submission.selections.length;
      const commentsLength = submission.comments.length;
      const dateOfSubmission = moment(submission.createDate).format(
        'MM/DD/YYYY'
      );
      const responsesLength = submission.responses.length;
      return {
        workspace,
        workspaceUrl,
        submitter,
        text,
        dateOfSubmission,
        selectionsLength,
        foldersLength: taggings.length,
        commentsLength,
        responsesLength,
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
