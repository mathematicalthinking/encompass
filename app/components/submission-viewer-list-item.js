import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  alert: service('sweet-alert'),
  student: alias('answer.student'),
  isVmt: alias('answer.isVmt'),

  didReceiveAttrs() {
    this._super(...arguments);
  },

  ellipsisMenuOptions: computed('answer.id', 'answer.isTrashed', function () {
    let moreMenuOptions = [];

    if (!this.answer.isTrashed) {
      moreMenuOptions.push({
        label: 'Delete',
        value: 'delete',
        action: 'deleteAnswer',
        icon: 'fas fa-trash',
      });
    } else {
      moreMenuOptions.push({
        label: 'Restore',
        value: 'restore',
        action: 'restoreAnswer',
        icon: 'fas fa-undo',
      });
    }
    return moreMenuOptions;
  }),

  isChecked: computed('answer.id', 'selectedMap', function () {
    let id = this.answer.id;
    let prop = `selectedMap.${id}`;
    return this.get(prop);
  }),

  revisionCount: computed('threads', 'student', function () {
    let student = this.student;
    let threads = this.threads;
    if (threads) {
      let work = threads[student];
      if (work) {
        return work.length;
      }
    }
    return 0;
  }),

  actions: {
    onSelect: function () {
      this.onSelect(this.answer, this.isChecked);
    },
    deleteAnswer: function () {
      let answer = this.answer;
      //need to check if the answer has a thread, if it does, ask if they want to delete all reivisions as well

      this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this submission',
          'This submission will no longer be accesible to all users',
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            answer.set('isTrashed', true);
            answer.save().then((answer) => {
              this.alert
                .showToast(
                  'success',
                  'Submission Deleted',
                  'bottom-end',
                  4000,
                  true,
                  'Undo'
                )
                .then((results) => {
                  if (results.value) {
                    answer.set('isTrashed', false);
                    answer.save().then(() => {
                      this.alert.showToast(
                        'success',
                        'Submission Restored',
                        'bottom-end',
                        3000,
                        false,
                        null
                      );
                    });
                  }
                });
            });
          }
        });
    },
    restoreAnswer: function () {
      let answer = this.answer;
      //need to check if the answer has a thread, if it does, ask if they want to delete all reivisions as well

      this.alert
        .showModal(
          'warning',
          'Are you sure you want to restore this submission',
          'This submission will be searchable by other users',
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            answer.set('isTrashed', false);
            answer.save().then((answer) => {
              this.alert
                .showToast(
                  'success',
                  'Submission Restored',
                  'bottom-end',
                  4000,
                  true,
                  'Undo'
                )
                .then((results) => {
                  if (results.value) {
                    answer.set('isTrashed', true);
                    answer.save().then(() => {
                      this.alert.showToast(
                        'success',
                        'Submission Deleted',
                        'bottom-end',
                        3000,
                        false,
                        null
                      );
                    });
                  }
                });
            });
          }
        });
    },

    toggleShowMoreMenu() {
      let isShowing = this.showMoreMenu;
      this.set('showMoreMenu', !isShowing);
    },
  },
});
