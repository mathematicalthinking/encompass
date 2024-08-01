import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ProblemLIstComponent extends Component {
  @tracked dataLoadErrors = [];

  @action refreshList() {
    this.args.refreshList();
  }
}
