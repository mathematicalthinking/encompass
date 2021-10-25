import { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from './auditable';
export default class CommentModel extends Auditable {
  @attr('string') label;
  @attr('string') text;
  @attr('boolean', { defaultValue: false }) useForResponse;
  @belongsTo('selection') selection;
  //the ultimate origin of this comment
  @belongsTo('comment', { inverse: 'ancestors', async: true }) origin;
  @hasMany('comment', { inverse: 'origin', async: true }) ancestors;
  // @belongsTo('comment', { inverse: 'children', async: true }) parent;
  // @hasMany('comment', { inverse: 'parent', async: true }) children;
  @belongsTo('submission', { async: true }) submission;
  @belongsTo('workspace') workspace;
  relevance = 0; // Used for sorting (gets set by controller)
  get type() {
    return 'selection';
  }
  // type: computed('selection', 'submission', 'workspace', function () {
  //   return 'selection';
  // }),
  @belongsTo('comment', { inverse: null }) originalComment;
}
