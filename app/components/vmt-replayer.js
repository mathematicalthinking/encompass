Encompass.VmtReplayerComponent = Ember.Component.extend(Encompass.VmtHostMixin,{
  didInsertElement() {
    this.fetchReplayer();
    this.fetchCss();
    this._super(...arguments);
  },

  willDestroyElement() {
    console.log('destroying vmt replayer!');
    $('#vmt-enc-replayer').remove();
    $('#vmt-enc-replayer-css').remove();
    this._super(...arguments);
  },

  fetchReplayer() {
    let vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    let replayerUrl = `${vmtUrl}/enc/replayer/js`;
    $('body').append(`<script id="vmt-enc-replayer" src=${replayerUrl}></script>`);


  },

  fetchCss() {
    let vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    let cssUrl = `${vmtUrl}/enc/replayer/css`;
    $('head').append(`<link id="vmt-enc-replayer-css" href=${cssUrl} rel="stylesheet">`);
  }
});