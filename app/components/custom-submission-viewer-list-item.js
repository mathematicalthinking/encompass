Encompass.CustomSubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['custom-submission-viewer-list-item'],

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
    }
  }

});