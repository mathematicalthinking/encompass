import Model, { attr, belongsTo } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class extends Model.extend(Auditable) {
  @attr('string') pdSetName;
  @attr('string') folderSetName;
  @belongsTo('workspace') result;
}
