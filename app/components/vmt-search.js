Encompass.VmtSearchComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.VmtHostMixin, {
  classNames: ['vmt-search'],

  submitSearch() {
    let searchText = this.get('searchText');

    let trimmed = typeof searchText === 'string' ? searchText.trim() : '';

    if (trimmed.length === 0) {
      return;
    }

    let vmtHost = this.getVmtHost();
    let username = this.get('username');
    let token = this.get('token');

    let url = `${vmtHost}/enc/search?username=${username}&resourceName=${trimmed}`;

    let headers = {
      "Authorization" : token
    };
    Ember.$.get({
      url,
      headers
    })
    .then((results) => {
      console.log('vmt search results', results);
    })
    .catch((err) => {
      console.log('vmt search error', err);
    });
  }
});