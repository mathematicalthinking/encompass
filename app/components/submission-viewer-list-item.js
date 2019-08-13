Encompass.SubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['submission-viewer-list-item'],
  alert: Ember.inject.service('sweet-alert'),
  student: Ember.computed.alias('answer.student'),
  isVmt: Ember.computed.alias('answer.isVmt'),

  didReceiveAttrs() {
    this._super(...arguments);
  },

  ellipsisMenuOptions: function() {
    let moreMenuOptions = this.get('moreMenuOptions');
    return moreMenuOptions;
  }.property('answer.id', 'answer.isTrashed'),

  isChecked: function() {
   let id = this.get('answer.id');
   let prop = `selectedMap.${id}`;
   return this.get(prop);
  }.property('answer.id', 'selectedMap'),

  revisionCount: function() {
    let student = this.get('student');
    let threads = this.get('threads');
    if (threads) {
      let work = threads.get(student);
      if (work) {
        return work.length;
      }
    }
    return  0;
  }.property('threads', 'student'),

  actions: {
    onSelect: function() {
      this.get('onSelect')(this.get('answer'), this.get('isChecked'));
    },
    deleteAnswer: function () {
      let answer = this.get('answer');
      //need to check if the answer has a thread, if it does, ask if they want to delete all reivisions as well

      this.get('alert').showModal('warning', 'Are you sure you want to delete this submission', 'This submission will no longer be accesible to all users', 'Yes').then((result) => {
        if (result.value) {
          answer.set('isTrashed', true);
          answer.save().then((answer) => {
            this.get('alert').showToast('success', 'Submission Deleted', 'bottom-end', 4000, true, 'Undo')
            .then((results) => {
              if (results.value) {
                answer.set('isTrashed', false);
                answer.save().then(() => {
                  this.get('alert').showToast('success', 'Submission Restored', 'bottom-end', 3000, false, null);
                });
              }
            });
          });
        }
      });
    },

    toggleShowMoreMenu() {
      let isShowing = this.get('showMoreMenu');
      this.set('showMoreMenu', !isShowing);
    },

  }

});