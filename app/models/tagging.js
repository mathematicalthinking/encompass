import { belongsTo } from '@ember-data/model';

import AuditableModel from './auditable';

export default class TaggingModel extends AuditableModel {
  @belongsTo('workspace', { inverse: 'taggings', async: false }) workspace;
  @belongsTo('selection', { inverse: 'taggings', async: true }) selection;
  @belongsTo('folder', { inverse: 'taggings', async: true }) folder;
  @belongsTo('tagging', { inverse: null, async: true }) originalTagging;

  copy() {
    let clone = this.toJSON();
    delete clone.id;
    return this.store.createRecord('tagging', clone).save();
  }
}
