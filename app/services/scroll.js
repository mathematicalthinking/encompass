// services/scroll.js
import Service from '@ember/service';
import { next } from '@ember/runloop';

export default class ScrollService extends Service {
  toBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  toBottomAfterRender() {
    next(() => {
      this.toBottom();
    });
  }
}
