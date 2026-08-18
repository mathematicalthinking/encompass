import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class VmtReplayerComponent extends Component {
  getVmtHost() {
    const hostname = window.location.hostname;

    if (hostname === 'localhost') {
      return 'http://localhost:3001';
    } else if (hostname === 'enc-test.mathematicalthinking.org') {
      return 'https://vmt-test.mathematicalthinking.org';
    } else if (hostname === 'encompass.mathematicalthinking.org') {
      return 'https://vmt.mathematicalthinking.org';
    }
    return undefined;
  }

  @action
  setupReplayer() {
    this.fetchReplayer();
    this.fetchCss();
  }

  @action
  teardownReplayer() {
    document.getElementById('vmt-enc-replayer')?.remove();
    document.getElementById('vmt-enc-replayer-css')?.remove();
  }

  fetchReplayer() {
    const vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'vmt-enc-replayer';
    script.src = `${vmtUrl}/enc/replayer/js`;
    document.body.appendChild(script);
  }

  fetchCss() {
    const vmtUrl = this.getVmtHost();

    if (!vmtUrl) {
      return;
    }

    const link = document.createElement('link');
    link.id = 'vmt-enc-replayer-css';
    link.href = `${vmtUrl}/enc/replayer/css`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}
