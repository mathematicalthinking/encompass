import Model, { attr } from '@ember-data/model';
import Auditable from './_auditable_mixin';

export default class FolderSet extends Model.extend(Auditable) {
  @attr('string') name;
  @attr('string') privacySetting;
  @attr folders;
}
