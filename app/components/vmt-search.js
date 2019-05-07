Encompass.VmtSearchComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.VmtHostMixin, {
  classNames: ['vmt-search'],

  searchConstraints: {
    query: {
      length: {
        minimum: 0,
        maximum: 500
      }
    }
  },

  actions: {
    submitSearch() {
      let searchText = this.get('searchText');

      let trimmed = typeof searchText === 'string' ? searchText.trim() : '';

      if (trimmed.length === 0) {
        return;
      }
      let vmtHost = this.getVmtHost();
      let token = this.get('token');

      let url = `${vmtHost}/enc/search?resourceName=${trimmed}`;

      let headers = {
        "Authorization" : token
      };
      Ember.$.get({
        url,
        headers
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
        console.log('vmt search error', err);
      });
    }
  }

});