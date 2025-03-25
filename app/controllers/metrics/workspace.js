import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
export default class MetricsWorkspaceController extends Controller {
  @tracked showSubmissions = false;
  @tracked showCloud = false;
  @service workspaceReports;

  submissionsColumns = [
    { name: 'Record', valuePath: 'recordType' },
    { name: 'Creator', valuePath: 'creator' },
    { name: 'Text', valuePath: 'text' },
  ];

  get workspaceCsv() {
    return encodeURIComponent(
      this.workspaceReports.submissionReport(this.model)
    );
  }
  get responseCsv() {
    return encodeURIComponent(this.workspaceReports.responseReport(this.model));
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
