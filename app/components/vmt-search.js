import $ from 'jquery';
import Component from '@ember/component';
import getVmtHost from '../utils/get-vmt-host';
import {inject as service} from '@ember/service';

export default Component.extend(
  {
    errorHandling: service('error-handling'),
    classNames: ['vmt-search'],

    searchConstraints: {
      query: {
        length: {
          minimum: 0,
          maximum: 500,
        },
      },
    },
    searchErrors: function () {
      return this.errorHandling.getErrors('searchErrors')
    },

    actions: {
      submitSearch() {
        let searchText = this.searchText;

        let trimmed = typeof searchText === 'string' ? searchText.trim() : '';

        if (trimmed.length === 0) {
          return;
        }
        let vmtHost = getVmtHost();

        let url = `${vmtHost}/enc/search?resourceName=${trimmed}`;

        $.get({
          url,
          xhrFields: {
            withCredentials: true,
          },
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
            this.errorHandling.handleErrors(err, 'searchErrors');
          });
      },
      clearSearchResults() {
        return;
      },
      resetSearchErrors() {
        this.errorHandling.removeMessages('searchErrors')
      }
    },
  }
);
