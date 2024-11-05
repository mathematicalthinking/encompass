import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

export default class ErrorBoxComponent extends Component {
  @tracked isFadingOut = false;
  element = null; // Reference to the DOM element

  // Compute the class names dynamically based on `isFadingOut`
  get classNames() {
    return [
      'error-box',
      'required',
      'animated',
      this.isFadingOut ? 'fadeOut' : 'fadeIn',
    ].join(' ');
  }

  @action
  registerElement(element) {
    this.element = element;
  }

  @action
  closeError() {
    // Trigger the fade-out animation
    this.isFadingOut = true;

    // Call the resetError function if provided
    if (this.args.resetError) {
      this.args.resetError();
    }

    // Remove the element from the DOM after the animation duration (500ms)
    later(() => {
      if (this.element) {
        this.element.remove();
      }
    }, 500);
  }
}
