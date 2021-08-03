import Component from '@ember/component';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend({
  elementId: 'problem-home',
  classNames: ['home-view'],
  showCategories: false,

  publicProblems: computed(
    'problems.@each.isTrashed',
    'currentUser.isStudent',
    function () {
      var problems = this.problems.filterBy('isTrashed', false);
      var publicProblems = problems.filterBy('privacySetting', 'E');
      var sorted = publicProblems.sortBy('createDate').reverse();
      return sorted.slice(0, 10);
    }
  ),

  actions: {
    showCategories: function () {
      this.store.query('category', {}).then((queryCats) => {
        let categories = queryCats.get('meta');
        this.set('categoryTree', categories.categories);
      });
      this.set('showCategories', !this.showCategories);
      later(() => {
        $('html, body').animate({ scrollTop: $(document).height() });
      }, 5);
    },
  },
});
