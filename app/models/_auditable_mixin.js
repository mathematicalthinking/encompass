Encompass.Auditable = Ember.Mixin.create({
  createdBy: DS.belongsTo('user', { inverse: null }),
  createDate: DS.attr('date'),
  isTrashed: DS.attr('boolean', { defaultValue: false }), //apparently emberdata uses the isDeleted flag
  lastModifiedBy: DS.belongsTo('user', { inverse: null }),
  lastModifiedDate: DS.attr('date'),
});