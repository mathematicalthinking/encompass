import Route from '@ember/routing/route';
import $ from 'jquery';

export default Route.extend({
  beforeModel: function () {
    return $.get('/auth/logout').then(() => {
      window.location.href = '/';
    });
  },
});
