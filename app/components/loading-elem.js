Encompass.LoadingElemComponent = Ember.Component.extend({
  classNames: 'loading-elem',

  defaultMessage: 'Request in progress. Thank you for your patience!',

  loadingText: function() {
    return this.get('loadingMessage') || this.get('defaultMessage');
  }.property('loadingMessage', 'defaultMessage'),

});
