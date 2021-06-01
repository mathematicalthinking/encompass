Encompass.SocketLoaderComponent = Ember.Component.extend({
  tagName: '',
  socketIo: Ember.inject.service('socket-io'),
  didReceiveAttrs() {
    if (this.get('currentUser') && !this.get('currentUser.isGuest')) {
      this.get('socketIo').setupSocket(this.get('currentUser'));
    }
    this._super(...arguments);
  },

  checkUserSocketId: function() {
    let user = this.get('currentUser');
    if (!user) {
      return;
    }
    let socketId = this.get('socketId');

    if (socketId !== user.get('socketId')) {
      user.set('socketId', socketId);
      user.save();
    }

  }.observes('socketId', 'currentUser.socketId'),

  socketId: Ember.computed.alias('socketIo.socket.id'),
});