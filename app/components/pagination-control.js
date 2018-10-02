// attrs passed in by parent
// property/list of items that this component is paging through


Encompass.PaginationControlComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  elementId: 'pagination-control',
  showPageNavigation: Ember.computed('maxPage', function() {
    let count = this.get('maxPage');
    return !!count && count > 1;
  }),
  displaySearchResults: false,

  init: function() {
    this._super(...arguments);
  },

  didReceiveAttrs: function() {
    let maxPage = this.get('maxPage');
    let queryPageCount = this.get('queryPageCount');
    let searchPageCount = this.get('searchPageCount');
    let currentPage = this.get('currentPage');
    let isDisplaying = this.get('displaySearchResults');

    // user just clicked search and results are now displayed
    if (this.get('searchResults') && !this.get('displaySearchResults')) {
      this.set('displaySearchResults', true);
      if (currentPage) {
        this.set('queryPage', currentPage);
      }
      this.set('currentPage', 1);
      this.set('maxPage', this.get('searchPageCount'));
      this.set('total', this.get('searchTotal'));
      return;
    }

    // user just clicked clear search results
    if (!this.get('searchResults') && this.get('displaySearchResults')) {
      this.set('displaySearchResults', false);
      this.set('maxPage', queryPageCount);
      let queryPage = this.get('queryPage');
      if (queryPage) {
        this.set('currentPage', queryPage);
      } else {
        this.set('currentPage', 1);
      }
      return;
    }
    // paginating through search results
    if (isDisplaying) {
      if(!maxPage || maxPage !== searchPageCount) {
        this.set('maxPage', searchPageCount);
      }
    } else { // paginating through query results
      if (!maxPage || maxPage !== queryPageCount) {
        this.set('maxPage', queryPageCount);
      }
    }

    if (!currentPage) {
      this.set('currentPage', 1);
    }
  },

  getResultsByPage: function(model, page, limit=50) {
    let filterBy = this.get('filter');

    let queryParams = {
      page,
      limit,
      filterBy
    };

    this.store.query(model, queryParams).then((results) => {
      if (this.get('searchResults')) {
        this.set('searchResults', results);
      } else {
        this.set('queryResults', results);
      }
      let { total, currentPage, pageCount } = results.get('meta');

      this.set('currentPage', currentPage);

      if (total !== this.get('total')) {
        this.set('total', total);
      }
      if (pageCount !== this.get('maxPage')) {
        this.set('maxPage', pageCount);
      }
    }).catch((err) => {
      this.handleErrors(err, 'dataLoadError');
    });
  },
  actions: {
    getPage: function(direction, gotoPage=null) {
      let model = this.get('model');
      let currentPage = this.get('currentPage');
      let maxPage = this.get('maxPage');
      // if user directly inputs a number in go to page input and clicks go
      if (gotoPage) {
        if (gotoPage === currentPage) {
          return;
        }
      if (gotoPage > maxPage) {
        gotoPage = maxPage;
      } else if (gotoPage <= 0) {
        gotoPage = 1;
      }

      this.getResultsByPage(model, gotoPage);
       return;
     }
     // otherwise user clicked left (-1) or right arrow (1)
     if (!direction) {
       return;
     }

      if (!currentPage) {
        currentPage = 1;
      }
      let pageToLoad;

      if (direction === -1) {
        if (currentPage === 1) {
          pageToLoad = maxPage;
        } else {
          pageToLoad = currentPage - 1;
        }
      } else if (direction === 1) {
        if (currentPage >= maxPage) {
          pageToLoad = 1;
        } else {
          pageToLoad = currentPage + 1;
        }
      }
      this.getResultsByPage(model, pageToLoad);

    },
  }

});