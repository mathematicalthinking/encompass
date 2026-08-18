import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

// Image submissions embed the upload as an <img> inside the explanation HTML.
// Keep the explanation as-is, but let a click on one of those images open a
// full-screen lightbox.
export default class AnswerInfoComponent extends Component {
  @tracked enlargedSrc = null;

  @action
  enlarge(event) {
    const img = event.target.closest('img');
    if (img) {
      this.enlargedSrc = img.getAttribute('src');
    }
  }

  @action
  closeEnlarge() {
    this.enlargedSrc = null;
  }
}
