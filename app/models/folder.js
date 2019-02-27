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

  cleanChildren: function() {
    return this.get('children.content').rejectBy('isTrashed');
  }.property('children.content.@each.isTrashed'),

  hasChildren: function() {
    return this.get('cleanChildren.length') > 0;
  }.property('cleanChildren.[]'),

  childSelections: function(){
    let selections = this.get('taggedSelections');
    let children = this.get('cleanChildren');

    if (this.get('hasChildren')) {
      children
      .getEach('_selections')
      .forEach(function(childSelections) {
        selections.pushObjects(childSelections);
      });
    }
    return selections.uniqBy('id');
  }.property('cleanChildren.[]', 'taggedSelections.[]'),

  _selections: function() {
    return this.get('childSelections');
  }.property('childrenSelections.@each._selections', 'childSelections.@each.isTrashed'),

  submissions: function() {
    return this.get('taggedSelections')
      .getEach('submission.content')
      .uniqBy('id');
  }.property('taggedSelections.[]'),

  _submissions: function() {
    let submissions = this.get('submissions');

    this.get('cleanChildren')
      .getEach('_submissions')
      .forEach(function(childSubmissions) {
        submissions.pushObjects(childSubmissions);
      });
    // seems like you cannot use.uniq on objects after using.toArray()
    return submissions.uniqBy('id');
  }.property('submissions.[]','cleanChildren.[]'),

  hasSelection: function(selectionId) {
    return this.get('taggedSelections').find((sel) => {
      return sel.get('id') === selectionId;
    });
  },

  sortedChildren: Ember.computed.sort('cleanChildren', 'sortProperties'),
});
