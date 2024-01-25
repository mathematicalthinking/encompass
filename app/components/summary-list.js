import Component from '@glimmer/component';

export default class SummaryList extends Component {
  get sortedSubmissions() {
    return this.args.submissions.toArray().sort((submission1, submission2) => {
      const username1 = submission1.get('createdBy.username') || '';
      const username2 = submission2.get('createdBy.username') || '';
      return username1.localeCompare(username2);
    });
  }
}
