import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MetricsProblemController extends Controller {
  @tracked showTable = false;
  @tracked showProblemText = false;
  @tracked showAnswers = false;
  // @tracked relevantWorkspaces = [];
  @tracked problemAnswers = [];
  @tracked currentTableColumns = this.workspacesHead;
  @tracked currentTableRows = this.model.workspacesRows;
  workspacesHead = [
    { name: 'Name', valuePath: 'name' },
    { name: 'Owner', valuePath: 'owner' },
    { name: 'Submissions', valuePath: 'submissionsLength' },
    { name: 'Comments', valuePath: 'commentsLength' },
    { name: 'Selections', valuePath: 'selectionsLength' },
    { name: 'Responses', valuePath: 'responsesLength' },
  ];
  answersHead = [
    { name: 'Name', valuePath: 'name' },
    { name: 'Answer', valuePath: 'answer' },
    { name: 'Explanation', valuePath: 'explanation' },
  ];
  @action toggleProblemText() {
    this.showProblemText = !this.showProblemText;
    this.showTable = false;
  }
  @action findWorkspaces() {
    this.showTable = true;
    this.currentTableColumns = this.workspacesHead;
    this.currentTableRows = this.model.workspacesRows;
  }
  // unsure if there are enough workspaces to need this
  // @action findWorkspaces2() {
  //   this.store
  //     .query('workspace', {
  //       filterBy: {
  //         'submissionSet.criteria.puzzle.puzzleId': this.model.puzzleId,
  //       },
  //     })
  //     .then((res) => {
  //       this.relevantWorkspaces = res;
  //       this.showAnswers = false;
  //       this.showWorkspaces = true;
  //       this.showProblemText = false;
  //     });
  // }
  @action findSubmissions() {
    this.showTable = true;
    this.currentTableColumns = this.answersHead;
    this.currentTableRows = this.model.answersRows;
  }
}
