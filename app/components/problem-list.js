import { alias } from '@ember/object/computed';
import Component from '@ember/component';






export default Component.extend({
  elementId: 'problem-list',
  classNames: ['problem-list', 'left-list'],
  containerData: alias("parentView"),
  containerActions: alias("parentView.actions"),

  dataLoadErrors: [],


  didReceiveAttrs: function () {
    // ['problems', 'metadata', 'currentUser']
    // set initial results from route
  },

  init: function () {
    this._super(...arguments);
  },
  actions: {
    toProblemInfo(problem) {
      this.sendAction("toProblemInfo", problem);
    },
    refreshList() {
      this.refreshList();
    }
  }


});

