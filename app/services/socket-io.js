/*global io:false */
/*global _:false */
Encompass.SocketIoService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
  },

  setupListeners() {
    const socket = this.get('socket');
    if (!socket) {
      return;
    }
    socket.on('NEW_NOTIFICATION', (data) => {
     _.each(data, (val, key) => {
      if (val) {
        this.get('store').pushPayload(
          {
            [key]: val
          }
        );
      }
     });
    });
  },

  setupSocket: function (user) {
    //TODO: dynamic url
    let url = 'http://localhost:8080/';
    const socket = io.connect(url);
    this.set('socket', socket);

    user.set('socketId', socket.id);
    user.save()
    .then(() => {
      this.setupListeners();
    });
  },
});