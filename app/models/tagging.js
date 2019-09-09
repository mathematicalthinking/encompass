Encompass.Tagging = DS.Model.extend(Ember.Copyable, Encompass.Auditable, {
  workspace: DS.belongsTo('workspace', {async: false}),
  selection: DS.belongsTo('selection'),
  folder: DS.belongsTo('folder'),
  originalTagging: DS.belongsTo('tagging', {inverse: null}),

  copy: function(deep) {
    var clone = this.toJSON();

    delete clone.id;
    return this.store.createRecord('tagging', clone).save();
  }
});
