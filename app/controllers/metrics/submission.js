import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MetricsSubmissionController extends Controller {
  @tracked showSelections = false;
  @tracked showFolders = false;
  @tracked showComments = false;
  @tracked showResponses = false;
  ws = 'workspace name';

  // workspaceName: Ember.computed('model', function(){
  //   this.get('model.workspaces')
  //     .then((res)=>{
  //       let [name] = res.mapBy('name');
  //       this.set('ws', name);
  //   });
  // }),

  get answer() {
    return this.model.shortAnswer
      ? this.model.shortAnswer
      : this.model.answer.answer;
  }

  get explanation() {
    return this.model.longAnswer
      ? this.model.longAnswer
      : this.model.answer.explanation;
  }

  @action handleToggle(prop) {
    this.showSelections = false;
    this.showFolders = false;
    this.showComments = false;
    this.showResponses = false;
    this[prop] = true;
  }
}
