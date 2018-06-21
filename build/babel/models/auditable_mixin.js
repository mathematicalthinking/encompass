'use strict';

Encompass.Auditable = Ember.Mixin.create({
  createdBy: DS.belongsTo('user', { inverse: null }),
  createDate: DS.attr('date'),
  isTrashed: DS.attr('boolean', { defaultValue: false }) //apparently emberdata uses the isDeleted flag
});
//# sourceMappingURL=auditable_mixin.js.map
