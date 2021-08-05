import Model, { attr, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class OrganizationModel extends Model.extend(Auditable) {
  get organizationId() {
    return this.id;
  }
  @attr('string') name;
  @hasMany('problem', { async: true, inverse: null }) recommendedProblems;
}
