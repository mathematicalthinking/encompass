import { later } from '@ember/runloop';
import Component from '@ember/component';
import $ from 'jquery';






export default Component.extend({
  classNames: ['error-box', 'required', 'animated', 'fadeIn'],

  actions: {
    closeError: function () {
      let id = this.elementId;
      $(`#${id}`).removeClass('fadeIn');
      $(`#${id}`).addClass('fadeOut');

      if (this.resetError) {
        this.resetError();
      }

      later(() => {
        $(`#${id}`).remove();
      }, 500);
    }
  },

});