import { attr } from '@ember-data/model';
import AuditableModel from './auditable';

export default class CategoryModel extends AuditableModel {
  @attr('string') identifier;
  @attr('string') description;
  @attr('string') url;
}
