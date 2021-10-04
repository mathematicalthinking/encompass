import Component from '@glimmer/component';

export default class DashboardWorkspaceRowComponent extends Component {
  myAssignment = this.args.workspace.linkedAssignment;
  student = '';
}
