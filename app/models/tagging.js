import { belongsTo } from '@ember-data/model';

import AuditableModel from './auditable';

export default class TaggingModel extends AuditableModel {
  @belongsTo('workspace', { async: false }) workspace;
  @belongsTo('selection', { async: true }) selection;
  @belongsTo('folder', { async: true }) folder;
  @belongsTo('tagging', { inverse: null, async: true }) originalTagging;

  copy() {
    let clone = this.toJSON();
    delete clone.id;
    return this.store.createRecord('tagging', clone).save();
  }
}
