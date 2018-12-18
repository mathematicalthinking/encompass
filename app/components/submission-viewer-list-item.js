Encompass.SubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['submission-viewer-list-item'],
  student: Ember.computed.alias('answer.student'),

  didReceiveAttrs() {
    this._super(...arguments);
    console.log('moreMenuOptions', this.get('moreMenuOptions'));
  },

  ellipsisMenuOptions: function() {
    let moreMenuOptions = this.get('moreMenuOptions');
    console.log('ellipsis menu options are', moreMenuOptions);
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
    trashSubmission: function () {
      let submission = this.get('submission');
      //delete all revisions to?
      console.log('clicked trashSubmission and submission is', submission);
    },
    toggleShowMoreMenu() {
      console.log('clicked show more menu');
      let isShowing = this.get('showMoreMenu');
      this.set('showMoreMenu', !isShowing);
    },

  }

});