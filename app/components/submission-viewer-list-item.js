import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

/**
 * SubmissionViewerListItem Component
 *
 * Displays a single submission/answer item in the submission viewer list.
 * Handles selection state, revision count display, and delete/restore actions.
 *
 * @argument {Object} answer - The answer/submission model to display
 * @argument {Object} selectedMap - Hash mapping answer IDs to selection state
 * @argument {Object} threads - Hash mapping students to their submission threads
 * @argument {Function} onSelect - Callback when selection changes (answer, wasChecked)
 */
export default class SubmissionViewerListItemComponent extends Component {
  @service('sweet-alert') alert;

  @tracked showMoreMenu = false;

  /**
   * Student name from the answer
   */
  get student() {
    return this.args.answer?.student;
  }

  /**
   * Whether this is a VMT (Virtual Math Teams) answer
   */
  get isVmt() {
    return this.args.answer?.isVmt;
  }

  /**
   * Menu options for the ellipsis dropdown
   * Shows Delete for active answers, Restore for trashed
   */
  get ellipsisMenuOptions() {
    const options = [];

    if (!this.args.answer?.isTrashed) {
      options.push({
        label: 'Delete',
        value: 'delete',
        action: 'deleteAnswer',
        icon: 'fas fa-trash',
      });
    } else {
      options.push({
        label: 'Restore',
        value: 'restore',
        action: 'restoreAnswer',
        icon: 'fas fa-undo',
      });
    }

    return options;
  }

  /**
   * Whether this answer is currently selected
   */
  get isChecked() {
    const id = this.args.answer?.id;
    return this.args.selectedMap?.[id] ?? false;
  }

  /**
   * Number of revisions for this student's work
   */
  get revisionCount() {
    const student = this.student;
    const threads = this.args.threads;

    if (threads && student) {
      const work = threads[student];
      if (work) {
        return work.length;
      }
    }

    return 0;
  }

  /**
   * Handle document click to close menu when clicking outside
   */
  @action
  setupClickOutsideHandler(element) {
    this._containerElement = element;
    this._clickOutsideHandler = (event) => {
      // Close menu if click is outside the more menu area
      if (this.showMoreMenu && !event.target.closest('.item-section.more')) {
        this.showMoreMenu = false;
      }
    };
    document.addEventListener('click', this._clickOutsideHandler);
  }

  @action
  teardownClickOutsideHandler() {
    if (this._clickOutsideHandler) {
      document.removeEventListener('click', this._clickOutsideHandler);
      this._clickOutsideHandler = null;
    }
  }

  @action
  onSelect() {
    this.args.onSelect?.(this.args.answer, this.isChecked);
  }

  @action
  toggleShowMoreMenu(event) {
    event.stopPropagation();
    this.showMoreMenu = !this.showMoreMenu;
  }

  @action
  handleMenuOption(optionAction, event) {
    event.stopPropagation();
    this.showMoreMenu = false;

    if (optionAction === 'deleteAnswer') {
      this.deleteAnswer();
    } else if (optionAction === 'restoreAnswer') {
      this.restoreAnswer();
    }
  }

  @action
  async deleteAnswer() {
    const answer = this.args.answer;

    const result = await this.alert.showModal(
      'warning',
      'Are you sure you want to delete this submission',
      'This submission will no longer be accessible to all users',
      'Yes'
    );

    if (result.value) {
      answer.isTrashed = true;
      await answer.save();

      const toastResult = await this.alert.showToast(
        'success',
        'Submission Deleted',
        'bottom-end',
        4000,
        true,
        'Undo'
      );

      if (toastResult.value) {
        answer.isTrashed = false;
        await answer.save();

        this.alert.showToast(
          'success',
          'Submission Restored',
          'bottom-end',
          3000,
          false,
          null
        );
      }
    }
  }

  @action
  async restoreAnswer() {
    const answer = this.args.answer;

    const result = await this.alert.showModal(
      'warning',
      'Are you sure you want to restore this submission',
      'This submission will be searchable by other users',
      'Yes'
    );

    if (result.value) {
      answer.isTrashed = false;
      await answer.save();

      const toastResult = await this.alert.showToast(
        'success',
        'Submission Restored',
        'bottom-end',
        4000,
        true,
        'Undo'
      );

      if (toastResult.value) {
        answer.isTrashed = true;
        await answer.save();

        this.alert.showToast(
          'success',
          'Submission Deleted',
          'bottom-end',
          3000,
          false,
          null
        );
      }
    }
  }
}
