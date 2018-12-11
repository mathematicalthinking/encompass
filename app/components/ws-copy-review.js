Encompass.WsCopyReviewComponent = Ember.Component.extend({
  elementId: 'ws-copy-review',
  createDate: Date.now(),

  init: function() {
    this._super(...arguments);
    let setting = this.get('config');
    console.log('config is', setting);
    let workspace = this.get('workspace');
    let submissionCount = workspace.get('submissionsLength');
    if (setting === "A" || setting === "B") {
      //if A they are just copying submissions or submissions and folders
      this.set('submissionCount', submissionCount);
      this.set('selectionsCount', 0);
      this.set('commentsCount', 0);
      this.set('responsesCount', 0);
      this.set('editorsCount', 0);
    } else if (setting === "C") {
    //if C they are copying everying
      this.set('submissionCount', submissionCount);
      this.set('selectionsCount', workspace.get('selectionsLength'));
      this.set('commentsCount', workspace.get('commentsLength'));
      this.set('responsesCount', workspace.get('responsesLength'));
      this.set('editorsCount', workspace.get('editorsLength'));

    } else {
    //if D they are custom
      console.log('selected custom');
      //need to get the values from custom config
    }
  },

  actions: {
    next() {
      this.get('onProceed')();
    },
    back() {
      this.get('onBack')(-1);
    }
  }

});