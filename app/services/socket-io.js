/*global io:false */
/*global _:false */
Encompass.SocketIoService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  store: Ember.inject.service(),
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  init() {
    this._super(...arguments);
  },

  setupListeners() {
    const socket = this.get('socket');
    if (!socket) {
      return;
    }

    socket.on('NEW_NOTIFICATION', (data) => {
      console.log('emitting ntf', data);
     _.each(data, (val, key) => {
      if (val) {
        this.get('store').pushPayload(
          {
            [key]: val
          }
        );
      }
     });
     let ntf = data.notifications[0];

     // check if we need to clear any now outdated notifications
     if (ntf) {
      this.triggerToast(data.notifications[0]);
     }
    });

    socket.on('CLEAR_NOTIFICATION', (data) => {
      /*
      data {
        notificationId,
        doTrash,
        doSetAsSeen
      }
      */
      if (this.get('utils').isValidMongoId(data.notificationId)) {
        let peeked = this.get('store').peekRecord('notification', data.notificationId);
        console.log('clearing ntf', peeked);
        if (!peeked) {
          return;
        }

        let doSave = data.doTrash || data.doSetAsSeen;

        if (!doSave) {
          this.get('store').unloadRecord(peeked);
          return;
        }
        if (data.doTrash) {
          peeked.set('isTrashed', true);
        }
        if (data.doSetAsSeen) {
          peeked.set('wasSeen', true);
        }
        peeked.save();
      }
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
