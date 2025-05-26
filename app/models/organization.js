import { attr, hasMany } from '@ember-data/model';
import Auditable from './auditable';
export default class OrganizationModel extends Auditable {
  @attr('string') name;
  @hasMany('problem', { async: true, inverse: null }) recommendedProblems;
}
