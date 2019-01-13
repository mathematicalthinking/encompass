Encompass.ResponseMentorReplyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-mentor-reply',

  didReceiveAttrs() {
    this._super(...arguments);
  },

  newReplyStatus: function() {
    if (this.get('canDirectSend')) {
      return 'approved';
    }
    return 'pendingApproval';
  }.property('canDirectSend'),

  actions: {
    onSaveSuccess(response) {
      this.get('onSaveSuccess')(response);
    }
  }
});