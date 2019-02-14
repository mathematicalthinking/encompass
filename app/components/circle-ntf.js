Encompass.CircleNtfComponent = Ember.Component.extend({
  classNames: ['circle-ntf'],

  count: function() {
    let count = this.get('displayCount');

    if (typeof count !== 'number') {
      return 0;
    }
    if (count > 99) {
      return '99+';
    }
    return count;
  }.property('displayCount'),

  areNoNtfs: Ember.computed.equal('count', 0),
});