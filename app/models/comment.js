import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  label: attr('string'),
  text: attr('string'),
  useForResponse: attr('boolean', { defaultValue: false }),
  selection: belongsTo('selection'),
  //the ultimate origin of this comment
  origin: belongsTo('comment', { inverse: 'ancestors', async: true }),
  ancestors: hasMany('comment', { inverse: 'origin', async: true }),
  parent: belongsTo('comment', { inverse: 'children', async: true }),
  children: hasMany('comment', { inverse: 'parent', async: true }),
  submission: belongsTo('submission', { async: true }),
  workspace: belongsTo('workspace'),
  relevance: 0, // Used for sorting (gets set by controller)
  type: computed('selection', 'submission', 'workspace', function () {
    return 'selection';
  }),
  originalComment: belongsTo('comment', { inverse: null }),
});
