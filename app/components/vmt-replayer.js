Encompass.VmtReplayerComponent = Ember.Component.extend(Encompass.VmtHostMixin,{
  didInsertElement() {
    this.fetchReplayer();
    this.fetchCss();
    this._super(...arguments);
  },

  fetchReplayer() {
    let vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    let replayerUrl = `${vmtUrl}/enc/replayer/js`;

    Ember.$.get({
      url: replayerUrl
    })
    .then((results) => {
      console.log('replayer results', results);
    })
    .catch((err) => {
      console.log('error fetching replayer', err);
    });

  },

  fetchCss() {
    let vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    let cssUrl = `${vmtUrl}/enc/replayer/css`;

    Ember.$.get({
      url: cssUrl
    })
    .then((results) => {
      console.log('css results', results);
    })
    .catch((err) => {
      console.log('error fetching css', err);
    });
  }
});