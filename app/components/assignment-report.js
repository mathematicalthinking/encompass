import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AssignmentReportComponent extends Component {
  @tracked sortCriterion = {
    name: 'A-Z',
    sortParam: { param: 'username', direction: 'asc' },
    icon: 'fas fa-sort-alpha-down sort-icon',
    type: 'username',
  };

  get sortedReportItems() {
    const reportObj = this.reportWithUser;

    const items = Object.entries(reportObj).map(([username, info]) => ({
      ...info,
      username,
      //make sure latestRevision is instanceof Date
      latestRevision: info.latestRevision
        ? new Date(info.latestRevision)
        : info.latestRevision,
    }));

    const { param: sortValue = 'username', direction: sortDirection = 'asc' } =
      this.sortCriterion.sortParam;

    const sorted = [...items].sort((a, b) => {
      const valA = a[sortValue];
      const valB = b[sortValue];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });

    return sortDirection === 'desc' ? sorted.reverse() : sorted;
  }

  get reportWithUser() {
    const { details, students } = this.args;

    return Object.entries(details).reduce((acc, [userId, val]) => {
      const user = students.find((s) => s.id === userId);
      const username = user?.username;
      if (username) {
        acc[username] = val;
      }
      return acc;
    }, {});
  }

  sortOptions = {
    student: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { param: 'username', direction: 'asc' },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'username',
      },
      {
        name: 'Z-A',
        sortParam: { param: 'username', direction: 'desc' },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'username',
      },
    ],
    revisionCount: [
      { sortParam: null, icon: '' },
      {
        name: '1-9',
        sortParam: { param: 'count', direction: 'asc' },
        icon: 'fas fa-sort-numeric-down sort-icon',
        type: 'count',
      },
      {
        name: '9-1',
        sortParam: { param: 'count', direction: 'desc' },
        icon: 'fas fa-sort-numeric-up sort-icon',
        type: 'count',
      },
    ],
    latestRevisionDate: [
      { sortParam: null, icon: '' },
      {
        id: 3,
        name: 'Newest',
        sortParam: { param: 'latestRevision', direction: 'asc' },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'latestRevision',
      },
      {
        id: 4,
        name: 'Oldest',
        sortParam: { param: 'latestRevision', direction: 'desc' },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'latestRevision',
      },
    ],
  };

  get totalSubmissionsCount() {
    return this.sortedReportItems.reduce(
      (acc, item) => acc + (item.count || 0),
      0
    );
  }

  get uniqueSubmitters() {
    return this.sortedReportItems.filter((item) => item.count > 0);
  }

  get summaryMessage() {
    const numStudents = this.sortedReportItems.length;
    const numSubmitters = this.uniqueSubmitters.length;
    const numSubmissions = this.totalSubmissionsCount;

    const studentNoun = numStudents === 1 ? 'student' : 'students';
    const submissionNoun = numSubmissions === 1 ? 'submission' : 'submissions';

    return `${numSubmitters} out of ${numStudents} ${studentNoun} have submitted to this assignment, for a total of ${numSubmissions} ${submissionNoun}.`;
  }

  @action updateSortCriterion(criterion) {
    this.sortCriterion = criterion;
  }
}
