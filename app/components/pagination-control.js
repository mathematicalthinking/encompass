Encompass.PaginationControlComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  elementId: 'pagination-control',
  showPageNavigation: Ember.computed('details.pageCount', function() {
    let count = this.get('details.pageCount');
    return !!count && count > 1;
  }),

  init: function() {
    this._super(...arguments);
  },
  actions: {
    getPage: function(direction, gotoPage=null) {
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

      this.get('initiatePageChange')(gotoPage);
       return;
     }
     // otherwise user clicked left (-1) or right arrow (1)
     if (direction === undefined || direction === null) {
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
      this.get('initiatePageChange')(pageToLoad);
      return;

    },
  }

});