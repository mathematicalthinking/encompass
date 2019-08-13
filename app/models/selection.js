Encompass.Selection = DS.Model.extend(Encompass.Auditable, {
  selectionId: Ember.computed.alias('id'),
  text: DS.attr('string'),
  coordinates: DS.attr('string'),
  taggings: DS.hasMany('tagging', {async: true}),
  comments: DS.hasMany('comment', {async: true}),
  submission: DS.belongsTo('submission', {async: true}),
  workspace: DS.belongsTo('workspace', {async: false}),
  relativeCoords: DS.attr(),
  relativeSize: DS.attr(),
  folders: function() {
    return this.get('taggings').filterBy('isTrashed', false).getEach('folder').toArray();
  }.property('taggings.@each.isTrashed', 'taggings.[]'),
  link: function() {
    return '#/workspaces/' + this.get('workspace.id') +
      '/submissions/' + this.get('submission.id') +
      '/selections/' + this.get('id');
    //https://github.com/emberjs/ember.js/pull/4718
    //ENC-526
  }.property('workspace', 'submission', 'id'),
  imageSrc: DS.attr('string'),
  imageTagLink: DS.attr('string'),
  vmtInfo: DS.attr(''),
});
