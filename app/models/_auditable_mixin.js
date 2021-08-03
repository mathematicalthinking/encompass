import { belongsTo, attr } from '@ember-data/model';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  createdBy: belongsTo('user', { inverse: null }),
  createDate: attr('date'),
  isTrashed: attr('boolean', { defaultValue: false }), //apparently emberdata uses the isDeleted flag
  lastModifiedBy: belongsTo('user', { inverse: null }),
  lastModifiedDate: attr('date'),
});
