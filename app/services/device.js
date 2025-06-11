// services/device.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DeviceService extends Service {
  @tracked isTouchScreen = false;

  constructor() {
    super(...arguments);
    window.addEventListener('touchstart', this.handleFirstTouch, {
      once: true,
      passive: true,
    });
  }

  handleFirstTouch = () => {
    this.isTouchScreen = true;
  };
}
