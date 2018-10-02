Encompass.PaginationControlComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  elementId: 'pagination-control',
  showPageNavigation: Ember.computed('details.pageCount', function() {
    let count = this.get('details.pageCount');
    return !!count && count > 1;
  }),

  init: function() {
    this._super(...arguments);
  },

  getResultsByPage: function(model, page, limit=50) {
    let filterBy = this.get('filter');

    let queryParams = {
      page,
      limit,
      filterBy
    };

    this.store.query(model, queryParams).then((results) => {
      this.set('queryResults', results);
      this.set('details', results.get('meta'));
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