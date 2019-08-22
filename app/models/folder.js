Encompass.Folder = DS.Model.extend(Encompass.Auditable, {
  name: DS.attr('string'),
  weight: DS.attr('number'),
  taggings: DS.hasMany('tagging', {async: true}),
  parent: DS.belongsTo('folder', { inverse: 'children', async: true }),
  children: DS.hasMany('folder', { inverse: 'parent', async: true}),
  workspace: DS.belongsTo('workspace', {async: true}),
  isTopLevel: DS.attr('boolean'),
  isExpanded: false,
  sortProperties: ['weight', 'name'],

  cleanTaggings: function() {
    return this.get('taggings.content').rejectBy('isTrashed');
  }.property('taggings.content.@each.isTrashed'),

  taggedSelections: function(){
    return this.get('cleanTaggings').mapBy('selection.content')
    .compact();
  }.property('cleanTaggings.[]'),

  cleanSelections: function() {
    return this.get('taggedSelections').rejectBy('isTrashed');
  }.property('taggedSelections.@each.isTrashed'),

  cleanChildren: function() {
    return this.get('children.content').rejectBy('isTrashed');
  }.property('children.content.@each.isTrashed'),

  hasChildren: function() {
    return this.get('cleanChildren.length') > 0;
  }.property('cleanChildren.[]'),

  childSelections: function(){
    let selections = this.get('cleanSelections');

    let results = [];

    results.addObjects(selections);

    let children = this.get('cleanChildren');

    if (this.get('hasChildren')) {
      children
      .getEach('_selections')
      .forEach(function(childSelections) {
        results.pushObjects(childSelections);
      });
    }
    return results.uniqBy('id');
  }.property('children.@each._selections', 'cleanSelections.[]'),

  _selections: function() {
    return this.get('childSelections');
  }.property('childSelections.@each.isTrashed'),

  submissions: function() {
    return this.get('cleanSelections')
      .mapBy('submission.content')
      .uniqBy('id');
  }.property('cleanSelections.@each.submission'),

  _submissions: function() {
    let submissions = this.get('submissions');

    let results = [];
    results.addObjects(submissions);

    this.get('cleanChildren')
      .getEach('_submissions')
      .forEach(function(childSubmissions) {
        results.pushObjects(childSubmissions);
      });

    return results.uniqBy('id');
  }.property('cleanChildren.[]', 'submissions.[]','children.@each._submissions' ),

  hasSelection: function(selectionId) {
    return this.get('cleanSelections').find((sel) => {
      return sel.get('id') === selectionId;
    });
  },

  sortedChildren: Ember.computed.sort('cleanChildren', 'sortProperties'),
  originalFolder: DS.belongsTo('folder', {inverse: null}),
});
