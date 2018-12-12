Encompass.SubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['submission-viewer-list-item'],
  student: Ember.computed.alias('answer.student'),

  isChecked: function() {
   let id = this.get('answer.id');
   let prop = `selectedMap.${id}`;
   return this.get(prop);
  }.property('answer.id', 'selectedMap'),
  revisionCount: function() {
    let student = this.get('student');
    let threads = this.get('threads');
    console.log('rc student', student);
    console.log('rc', threads);
    if (threads) {
      let work = threads.get(student);
      console.log('work', work);
      console.log('wl', work.get('length'));
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