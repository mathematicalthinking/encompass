Encompass.CustomSubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['custom-submission-viewer-list-item'],

  isChecked: function() {
    const ids = this.get('selectedAnswerIds');
    if (ids) {
      return ids.includes(this.get('answer.id'));
    }
    return false;
  }.property('selectedAnswerIds.[]'),
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
      this.get('onSelect')(this.get('answer.id'));
    }
  }

});