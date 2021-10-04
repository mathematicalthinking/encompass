/*global _:false */
import Component from '@ember/component';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  elementId: 'submission-viewer-list',
  scrollBottom: true,

  didReceiveAttrs() {
    this._super(...arguments);
  },

  answersSelectedHash: computed(
    'answers.[]',
    'selectedAnswers.[]',
    function () {
      let hash = {};

      this.answers.forEach((answer) => {
        let isSelected = this.selectedAnswers.includes(answer);
        hash[answer.get('id')] = isSelected;
      });
      return hash;
    }
  ),

  actions: {
    onSelect: function (answer, isChecked) {
      this.onSelect(answer, isChecked);
    },
    superScroll: function () {
      //should only show scroll option after the user scrolls a little
      if (!this.scrollBottom) {
        $('html, body').animate({
          scrollTop: 0,
        });
      } else {
        $('html, body').animate({
          scrollTop: $(document).height() - $(window).height(),
        });
      }
      this.set('scrollBottom', !this.scrollBottom);
    },
  },
});
