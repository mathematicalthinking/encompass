import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';







export default Model.extend(Auditable, {
  problemId: alias('id'),
  title: attr('string'),
  puzzleId: attr('number'),
  text: attr('string'),
  imageUrl: attr('string'),
  sourceUrl: attr('string'),
  image: belongsTo('image', { inverse: null }),
  origin: belongsTo('problem', { inverse: null }),
  modifiedBy: belongsTo('user', { inverse: null }),
  organization: belongsTo('organization', { inverse: null }),
  additionalInfo: attr('string'),
  privacySetting: attr('string'),
  categories: hasMany('category', { inverse: null }),
  keywords: attr(),
  copyrightNotice: attr('string'),
  sharingAuth: attr('string'),
  author: attr('string'),
  error: attr('string'),
  isUsed: attr('boolean'),
  status: attr('string'),
  flagReason: attr(),
  isForEdit: attr('boolean', { defaultValue: false }),
  isForAssignment: attr('boolean', { defaultValue: false }),
  contexts: attr(),
});
