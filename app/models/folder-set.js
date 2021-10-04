import { attr } from '@ember-data/model';
import Auditable from './auditable';

export default class FolderSet extends Auditable {
  @attr('string') name;
  @attr('string') privacySetting;
  @attr folders;
}
