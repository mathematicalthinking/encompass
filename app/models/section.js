import { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from './auditable';
export default class SectionModel extends Auditable {
  get sectionId() {
    return this.id;
  }
  @attr('string') name;
  @belongsTo('organization', { inverse: null, async: true }) organization;
  @hasMany('user', { inverse: null, async: true }) teachers;
  @attr('string') sectionPassword;
  @hasMany('user', { inverse: null, async: true }) students;
  @hasMany('problem', { inverse: null, async: true }) problems;
  @hasMany('assignment', { inverse: 'section', async: true }) assignments;
}
