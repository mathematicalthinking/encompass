/*global _:false */
Encompass.AssignmentReportComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'assignment-report',

  sortCriterion: { name: 'A-Z', sortParam: { param: 'username', direction: 'asc' }, icon:"fas fa-sort-alpha-down sort-icon", type: 'username' },
  classNameBindings: ['hidden'],

  sortedReportItems: function() {
   let reportObj = this.get('reportWithUser');
   let items = [];
    _.each(reportObj, (info, username) => {
      // eslint-disable-next-line prefer-object-spread
      let obj = Object.assign({}, info);
      obj.username = username;
      items.push(obj);
    });
    let sortValue = this.get('sortCriterion.sortParam.param') || 'username';
    let sortDirection = this.get('sortCriterion.sortParam.direction') || 'asc';
    let sorted = items.sortBy(sortValue);

    if (sortDirection === 'desc') {
      return sorted.reverse();
    }
    return sorted;
  }.property('reportWithUser', 'sortCriterion'),

  reportWithUser: function() {
    let details = this.get('details');

    let results = {};

    _.each(details, (val, userId) => {
      let user = this.get('students').findBy('id', userId);
      if (user) {
        let username = user.get('username');
        if (username) {
          results[username] = val;
        }
      }
    });

    return results;

  }.property('students.[]', 'details', 'assignment'),

  sortOptions: {
    student: [
      {sortParam: null, icon: ''},
      { name: 'A-Z', sortParam: { param: 'username', direction: 'asc' }, icon:"fas fa-sort-alpha-down sort-icon", type: 'username' },
      { name: 'Z-A', sortParam: { param: 'username', direction: 'desc' }, icon:"fas fa-sort-alpha-up sort-icon", type: 'username' },
    ],
    revisionCount: [
      {sortParam: null, icon: ''},
      { name: '1-9', sortParam: { param: 'count', direction: 'asc' }, icon:"fas fa-sort-numeric-down sort-icon", type: 'count' },
      { name: '9-1', sortParam: { param: 'count', direction: 'desc' }, icon:"fas fa-sort-numeric-up sort-icon", type: 'count' },
    ],
    latestRevisionDate: [
      { sortParam: null, icon: ''},
      {id: 3, name: 'Newest', sortParam: { param: 'latestRevision', direction: 'asc'}, icon: "fas fa-arrow-down sort-icon", type: 'latestRevision' },
      {id: 4, name: 'Oldest', sortParam: { param: 'latestRevision', direction: 'desc'}, icon:"fas fa-arrow-up sort-icon", type: 'latestRevision'}
    ]
  },

  totalSubmissionsCount: function() {
    return this.get('sortedReportItems')
    .mapBy('count')
    .reduce((acc, val) => {
      return acc + val;
    }, 0);
  }.property('sortedReportItems.[]'),

  uniqueSubmitters: function() {
    return this.get('sortedReportItems').filter((item) => {
      return item.count > 0;
    });
  }.property('sortedReportItems.[]'),

  summaryMessage: function() {
    let numStudents = this.get('sortedReportItems.length');
    let numSubmitters = this.get('uniqueSubmitters.length');
    let numSubmissions = this.get('totalSubmissionsCount');

    let studentNoun = numStudents === 1 ? 'student' : 'students';
    let submissionNoun = numSubmissions === 1 ? 'submission' : 'submissions';

    return `${numSubmitters} out of ${numStudents} ${studentNoun} have submitted to this assignment, for a total of ${numSubmissions} ${submissionNoun}.`;
  }.property('uniqueSubmitters', 'totalSubmissionsCount'),

  actions: {
    updateSortCriterion(criterion) {
      this.set('sortCriterion', criterion);
    },
  }
});



