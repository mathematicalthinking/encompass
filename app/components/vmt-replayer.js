import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  getVmtHost() {
    let hostname = window.location.hostname;
    let vmtUrl;

    if (hostname === 'localhost') {
      vmtUrl = 'http://localhost:3001';
    } else if (hostname === 'enc-test.mathematicalthinking.org') {
      vmtUrl = 'https://vmt-test.mathematicalthinking.org';
    } else if (hostname === 'encompass.mathematicalthinking.org') {
      vmtUrl = 'https://vmt.mathematicalthinking.org';
    } else {
      return;
    }
    return vmtUrl;
  },
  didInsertElement() {
    this.fetchReplayer();
    this.fetchCss();
    this._super(...arguments);
  },

  willDestroyElement() {
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
    $('body').append(
      `<script id="vmt-enc-replayer" src=${replayerUrl}></script>`
    );
  },

  fetchCss() {
    let vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    let cssUrl = `${vmtUrl}/enc/replayer/css`;
    $('head').append(
      `<link id="vmt-enc-replayer-css" href=${cssUrl} rel="stylesheet">`
    );
  },
});
