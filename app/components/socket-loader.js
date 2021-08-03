import Component from '@ember/component';
import { observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  socketIo: service('socket-io'),
  didReceiveAttrs() {
    if (this.currentUser && !this.currentUser.isGuest) {
      this.socketIo.setupSocket(this.currentUser);
    }
    this._super(...arguments);
  },

  checkUserSocketId: observer('socketId', 'currentUser.socketId', function () {
    let user = this.currentUser;
    if (!user) {
      return;
    }
    let socketId = this.socketId;

    if (socketId !== user.get('socketId')) {
      user.set('socketId', socketId);
      user.save();
    }
  }),

  socketId: alias('socketIo.socket.id'),
});
