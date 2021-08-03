import Model, { belongsTo } from '@ember-data/model';
import Ember from 'ember';
import Auditable from '../models/_auditable_mixin';







export default Model.extend(Ember.Copyable, Auditable, {
  workspace: belongsTo('workspace', { async: false }),
  selection: belongsTo('selection'),
  folder: belongsTo('folder'),
  originalTagging: belongsTo('tagging', { inverse: null }),

  copy: function (deep) {
    var clone = this.toJSON();

    delete clone.id;
    return this.store.createRecord('tagging', clone).save();
  }
});
