/*global io:false */
/*global _:false */
Encompass.SocketIoService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  store: Ember.inject.service(),
  alert: Ember.inject.service('sweet-alert'),

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
     this.triggerToast(data.notifications[0]);
    });
  },

  setupSocket: function (user) {
    //TODO: dynamic url
    let windowHref = window.location.href;
    let hashIndex = windowHref.indexOf('#');
    let url = windowHref.slice(0, hashIndex);

    const socket = io.connect(url);
    this.set('socket', socket);

    user.set('socketId', socket.id);
    user.save()
    .then(() => {
      this.setupListeners();
    });
  },

  triggerToast(ntf) {
    if (!ntf) {
      return;
    }
    let ntfText = ntf.text;
    let toastText;
    if (ntfText) {
      toastText = ntfText;
    } else {
      let notificationType = ntf.notificationType;
      toastText = `You have received a ${notificationType} notification.`;
    }
    this.get('alert').showToast('info', toastText, 'top-end', 3000, false, null);
    return;
  }
});
