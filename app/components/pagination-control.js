Encompass.PaginationControlComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  elementId: 'pagination-control',
  showPageNavigation: Ember.computed('details.pageCount', function() {
    let count = this.get('details.pageCount');
    return !!count && count > 1;
  }),

  init: function() {
    this._super(...arguments);
  },

  getResultsByPage: function(model, page, limit=null) {
    this.get('startPageChange')();
    let queryParams = {};

    let filterBy = this.get('filter');
    if (!Ember.isEmpty(filterBy)) {
      queryParams.filterBy = filterBy;
    }
    if (page) {
      queryParams.page = page;
    }

    this.store.query(model, queryParams).then((results) => {
      this.get('endPageChange')();
      this.set('queryResults', results);
      this.set('details', results.get('meta'));
      if (this.get('handleQueryResults')) {
        this.get('handleQueryResults')(results);
      }
    }).catch((err) => {
      this.handleErrors(err, 'dataLoadError');
    });
  },
  actions: {
    getPage: function(direction, gotoPage=null) {
      let model = this.get('model');
      let currentPage = this.get('details.currentPage');
      let maxPage = this.get('details.pageCount');
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