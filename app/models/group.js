import { attr, hasMany, belongsTo } from '@ember-data/model';
import AuditableModel from './auditable';

export default class GroupModel extends AuditableModel {
  @attr name;
  @belongsTo('section', { inverse: null, async: true }) section;
  @hasMany('user', { inverse: null, async: true }) students;
}
