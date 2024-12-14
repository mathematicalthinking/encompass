import Component from '@glimmer/component';
export default class AssignmentInfoComponent extends Component {
  get currentProblem() {
    return this.args.assignment?.problem ?? null;
  }

  get currentSection() {
    return this.args.assignment?.section ?? null;
  }
}
