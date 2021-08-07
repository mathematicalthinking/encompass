import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import Auditable from './_auditable_mixin';

export default class GroupModel extends Model.extend(Auditable) {
  @attr name;
  @belongsTo('section') section;
  @hasMany('user') students;
}
