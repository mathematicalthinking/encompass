import { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from './auditable';
export default class SectionModel extends Auditable {
  get sectionId() {
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
