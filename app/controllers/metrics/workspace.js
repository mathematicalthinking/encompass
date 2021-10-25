import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MetricsWorkspaceController extends Controller {
  @tracked showSelections = false;
  @tracked showFolders = false;
  @tracked showComments = false;
  @tracked showResponses = false;
  @tracked showSubmissions = false;
  @tracked showAll = false;
  @tracked showCloud = false;
  submissionsColumns = [
    { name: 'Record', valuePath: 'constructor.modelName' },
    { name: 'Creator', valuePath: 'createdBy.displayName' },
    { name: 'Text', valuePath: 'text' },
  ];
  @action
  toggleShowAll() {
    this.showAll = !this.showAll;
  }
  @action
  handleToggle(prop) {
    this.showSelections = false;
    this.showFolders = false;
    this.showComments = false;
    this.showResponses = false;
    this.showSubmissions = false;
    this.showCloud = false;
    this[prop] = true;
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
