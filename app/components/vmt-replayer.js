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
    $('body').append(`<script src=${replayerUrl}></script>`);


  },

  fetchCss() {
    let vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    let cssUrl = `${vmtUrl}/enc/replayer/css`;
    $('head').append(`<link href=${cssUrl} rel="stylesheet">`);
  }
});