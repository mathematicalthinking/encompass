import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';






export default Model.extend(Auditable, {
  sectionId: alias('id'),
  name: attr('string'),
  organization: belongsTo('organization', { inverse: null }),
  teachers: hasMany('user', { inverse: null }),
  sectionPassword: attr('string'),
  students: hasMany('user', { inverse: null }),
  problems: hasMany('problem'),
  assignments: hasMany('assignment')
});