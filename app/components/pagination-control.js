import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class PaginationControlComponent extends Component {
  @tracked goToPage = null;

  get showPageNavigation() {
    const count = this.args.details?.pageCount ?? 0;
    return count && count > 1;
  }

  @action
  updateGoToPage(event) {
    this.goToPage = parseInt(event.target.value, 10);
  }

  @action
  handleGoToPage() {
    this.getPage(null, this.goToPage);
  }

  @action
  handleForward() {
    this.getPage(1);
  }

  @action
  handleBackward() {
    this.getPage(-1);
  }

  getPage(direction, gotoPage = null) {
    let currentPage = this.args.details.currentPage;
    let maxPage = this.args.details.pageCount;
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

      if (this.args.initiatePageChange) {
        this.args.initiatePageChange(gotoPage);
      }
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
    if (this.args.initiatePageChange) {
      this.args.initiatePageChange(pageToLoad);
    }
    return;
  }
}
