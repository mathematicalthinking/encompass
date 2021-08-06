import Model, { attr } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class CategoryModel extends Model.extend(Auditable) {
  @attr('string') identifier;
  @attr('string') description;
  @attr('string') url;
}
