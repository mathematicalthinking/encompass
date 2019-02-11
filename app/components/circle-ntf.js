Encompass.CircleNtfComponent = Ember.Component.extend({
  classNames: ['circle-ntf'],

  count: function() {
    let count = this.get('displayCount');

    if (typeof count !== 'number') {
      return 0;
    }
    return count;
  }.property('displayCount'),

  areNoNtfs: Ember.computed.equal('count', 0),
});