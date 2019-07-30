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
      // let token = this.get('token');

      let url = `${vmtHost}/enc/search?resourceName=${trimmed}`;
      // let url = `${vmtHost}/api/searchPaginated/rooms?criteria=${trimmed}`;
      // let activitiesUrl = `${vmtHost}/api/searchPaginated/activities?criteria=${trimmed}`;

      // let headers = {
      //   "Authorization" : token
      // };
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
       console.log('rsults', results);
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