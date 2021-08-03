import Model, { attr, hasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';







export default Model.extend(Auditable, {
  organizationId: alias('id'),
  name: attr('string'),
  recommendedProblems: hasMany('problem', { async: true, inverse: null })
});