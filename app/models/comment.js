Encompass.Comment = DS.Model.extend(Encompass.Auditable, {
  label: DS.attr('string'),
  text: DS.attr('string'),
  useForResponse: DS.attr('boolean', {defaultValue: false}),
  selection: DS.belongsTo('selection'),
  //the ultimate origin of this comment
  origin: DS.belongsTo('comment', {inverse: 'ancestors', async: true}),
  ancestors: DS.hasMany('comment', {inverse: 'origin', async: true}),
  parent: DS.belongsTo('comment', {inverse: 'children', async: true}),
  children: DS.hasMany('comment', {inverse: 'parent', async: true}),
  submission: DS.belongsTo('submission', {async: true}),
  workspace: DS.belongsTo('workspace'),
  relevance: 0, // Used for sorting (gets set by controller)
  type: function() {
    return 'selection';
  }.property('selection', 'submission', 'workspace'),
  originalComment: DS.belongsTo('comment', {inverse: null})
});
