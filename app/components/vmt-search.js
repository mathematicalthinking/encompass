Encompass.VmtSearchComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.VmtHostMixin, Encompass.ErrorHandlingMixin, {
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
      let searchText = this.get('searchText');

      let trimmed = typeof searchText === 'string' ? searchText.trim() : '';

      if (trimmed.length === 0) {
        return;
      }
      let vmtHost = this.getVmtHost();

      let url = `${vmtHost}/enc/search?resourceName=${trimmed}`;

      Ember.$.get({
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
        if (this.get('handleSearchResults')) {
          this.get('handleSearchResults')(results);
        }
      })
      .catch((err) => {
        this.handleErrors(err, 'searchErrors');
      });
    }
  }

});