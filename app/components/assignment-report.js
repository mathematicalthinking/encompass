/*global _:false */
Encompass.AssignmentReportComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'assignment-report',

  sortedReportItems: function() {
   let reportObj = this.get('reportWithUser');
   let items = [];
    _.each(reportObj, (info, username) => {
      // eslint-disable-next-line prefer-object-spread
      let obj = Object.assign({}, info);
      obj.username = username;
      items.push(obj);
    });
    return items.sortBy('username');
  }.property('reportWithUser'),

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
});


