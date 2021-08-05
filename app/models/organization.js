import Model, { attr, hasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';

export default class OrganizationModel extends Model.extend(Auditable) {
  @alias('id') organizationId;
  @attr('string') name;
  @hasMany('problem', { async: true, inverse: null }) recommendedProblems;
}
