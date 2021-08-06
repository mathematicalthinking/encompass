import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class SectionModel extends Model.extend(Auditable) {
  get ssectionId() {
    return this.id;
  }
  @attr('string') name;
  @belongsTo('organization', { inverse: null }) organization;
  @hasMany('user', { inverse: null }) teachers;
  @attr('string') sectionPassword;
  @hasMany('user', { inverse: null }) students;
  @hasMany('problem') problems;
  @hasMany('assignment') assignments;
}
