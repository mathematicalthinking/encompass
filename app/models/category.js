import { attr } from '@ember-data/model';
import Auditable from './auditable';

export default class CategoryModel extends Auditable {
  @attr('string') identifier;
  @attr('string') description;
  @attr('string') url;
}
