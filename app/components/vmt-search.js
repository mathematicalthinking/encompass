import $ from 'jquery';
import Component from '@ember/component';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';
import VmtHostMixin from '../mixins/vmt-host';






export default Component.extend(CurrentUserMixin, VmtHostMixin, ErrorHandlingMixin, {
  classNames: ['vmt-search'],

  searchConstraints: {
    query: {
      length: {
        minimum: 0,
        maximum: 500
      }
    }
  },
  searchErrors: [],

  actions: {
    submitSearch() {
      let searchText = this.searchText;

      let trimmed = typeof searchText === 'string' ? searchText.trim() : '';

      if (trimmed.length === 0) {
        return;
      }
      let vmtHost = this.getVmtHost();

      let url = `${vmtHost}/enc/search?resourceName=${trimmed}`;

      $.get({
        url,
        xhrFields: {
          withCredentials: true
        }
        // headers
      })
        .then((results) => {
          /*
          {
            activities: [],
            rooms: [],
          }
          */
          if (this.handleSearchResults) {
            this.handleSearchResults(results);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'searchErrors');
        });
    }
  }

});