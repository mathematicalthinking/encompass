import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import _ from 'underscore';

export default class AssignmentReportComponent extends Component {
  @tracked sortCriterion = {
    name: 'A-Z',
    sortParam: { param: 'username', direction: 'asc' },
    icon: 'fas fa-sort-alpha-down sort-icon',
    type: 'username',
  };

  get sortedReportItems() {
    let reportObj = this.reportWithUser;
    let items = [];
    _.each(reportObj, (info, username) => {
      // eslint-disable-next-line prefer-object-spread
      let obj = Object.assign({}, info);
      obj.username = username;
      //make sure latestRevision is instanceof Date
      obj.latestRevision = obj.latestRevision
        ? new Date(obj.latestRevision)
        : obj.latestRevision;
      items.push(obj);
    });
    let sortValue = this.sortCriterion.sortParam.param || 'username';
    let sortDirection = this.sortCriterion.sortParam.direction || 'asc';
    let sorted = items.sortBy(sortValue);

    if (sortDirection === 'desc') {
      return sorted.reverse();
    }
    return sorted;
  }

  get reportWithUser() {
    let details = this.args.details;

    let results = {};

    _.each(details, (val, userId) => {
      let user = this.args.students.findBy('id', userId);
      if (user) {
        let username = user.get('username');
        if (username) {
          results[username] = val;
        }
      }
    });

    return results;
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
    return this.sortedReportItems.mapBy('count').reduce((acc, val) => {
      return acc + val;
    }, 0);
  }

  get uniqueSubmitters() {
    return this.sortedReportItems.filter((item) => {
      return item.count > 0;
    });
  }

  get summaryMessage() {
    let numStudents = this.sortedReportItems.length;
    let numSubmitters = this.uniqueSubmitters.length;
    let numSubmissions = this.totalSubmissionsCount;

    let studentNoun = numStudents === 1 ? 'student' : 'students';
    let submissionNoun = numSubmissions === 1 ? 'submission' : 'submissions';

    return `${numSubmitters} out of ${numStudents} ${studentNoun} have submitted to this assignment, for a total of ${numSubmissions} ${submissionNoun}.`;
  }

  @action updateSortCriterion(criterion) {
    this.sortCriterion = criterion;
  }
}
