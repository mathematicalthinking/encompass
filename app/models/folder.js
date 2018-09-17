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

  taggedSelections: function(){
    return this.get('taggings').map( function(tagging){
      return tagging.get('selection');
    });
  }.property('taggings.@each.isTrashed'),

  selections: function() {
    return this.get('taggings')
      .filterBy('isTrashed', false)
      .getEach('selection')
      .filterBy('isTrashed', false);
  }.property('taggings.@each.isTrashed','taggedSelections.@each.isTrashed'),

  childSelections: function(){
    var selections = this.get('selections').toArray();
    var children = this.get('children');

    if (!Ember.isEmpty(children)) {
      children
      .filterBy('isTrashed', false)
      .getEach('_selections')
      .forEach(function(childSelections) {
        selections.pushObjects(childSelections);
      });
    }
    return selections.uniqBy('id');
  }.property('children.@each._submissions', 'selections.@each.isTrashed'),

  _selections: function() {
    return this.get('childSelections');
    /*
    var selections = this.get('selections').toArray();
    this.get('children')
      .filterBy('isTrashed', false)
      .getEach('_selections')
      .forEach(function(childSelections) {
        selections.pushObjects(childSelections);
      });

    return selections.uniq();
    }.property('selections.[]', 'selections.@each.isTrashed', 'children.@each._selections.[]'),
    */
  }.property('childrenSelections.@each._selections', 'childSelections.@each.isTrashed'),

  submissions: function() {
    return this.get('selections')
      .filterBy('isTrashed', false)
      .getEach('submission')
      .uniq();
  }.property('selections.@each.isTrashed'),

  _submissions: function() {
    var submissions = this.get('submissions').toArray();

    this.get('children')
      .filterBy('isTrashed', false)
      .getEach('_submissions')
      .forEach(function(childSubmissions) {
        submissions.pushObjects(childSubmissions);
      });
    // seems like you cannot use.uniq on objects after using.toArray()
    return submissions.uniqBy('id');
  }.property('submissions.[]', 'children.@each._submissions', 'children.@each.isTrashed'),

  hasSelection: function(selectionId) {
    return this.get('taggings')
      .isAny('selection.id', selectionId);
  },

  filteredChildren: function() {
    return this.get('children')
      .filterBy('isTrashed', false)
      .sortBy('weight', 'name');
  }.property('children.[].isTrashed'),

  sortedChildren: Ember.computed.sort('filteredChildren', 'sortProperties'),
});
