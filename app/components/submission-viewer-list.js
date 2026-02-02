import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * SubmissionViewerList Component
 *
 * Displays a list of submission answers with selection capability and scroll navigation.
 *
 * @component
 * @example
 * <SubmissionViewerList
 *   @answers={{this.sortedAnswers}}
 *   @metadata={{this.answersMetadata}}
 *   @isList={{true}}
 *   @isGrid={{false}}
 *   @moreMenuOptions={{this.moreMenuOptions}}
 *   @onSelect={{this.updateSelectedAnswers}}
 *   @selectedAnswers={{this.selectedAnswers}}
 *   @threads={{this.submissionThreads}}
 * />
 */
export default class SubmissionViewerListComponent extends Component {
  @tracked scrollBottom = true;
  @tracked showScrollIcon = false;

  // Scroll threshold in pixels before showing scroll icon
  SCROLL_THRESHOLD = 800;

  // Bound scroll handler reference for cleanup
  _scrollHandler = null;

  get answersSelectedHash() {
    let hash = {};
    const answers = this.args.answers ?? [];
    const selectedAnswers = this.args.selectedAnswers ?? [];

    answers.forEach((answer) => {
      let isSelected = selectedAnswers.includes(answer);
      hash[answer.get('id')] = isSelected;
    });
    return hash;
  }

  @action
  onSelect(answer, isChecked) {
    this.args.onSelect?.(answer, isChecked);
  }

  @action
  superScroll() {
    if (!this.scrollBottom) {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      // Scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight - window.innerHeight,
        behavior: 'smooth',
      });
    }
    this.scrollBottom = !this.scrollBottom;
  }

  @action
  setupScrollListener(element) {
    this._scrollIconElement = element;

    this._scrollHandler = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      this.showScrollIcon = scrollY > this.SCROLL_THRESHOLD;
    };

    window.addEventListener('scroll', this._scrollHandler, { passive: true });

    // Initial check
    this._scrollHandler();
  }

  @action
  teardownScrollListener() {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = null;
    }
  }
}
