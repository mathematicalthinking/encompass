import { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from './auditable';
export default class SelectionModel extends Auditable {
  get selectionId() {
    return this.id;
  }
  @attr('string') text;
  @attr('string') coordinates;
  @hasMany('tagging', { async: true }) taggings;
  @hasMany('comment', { async: true }) comments;
  @belongsTo('submission', { async: true }) submission;
  @belongsTo('workspace', { async: false }) workspace;
  @attr relativeCoords;
  @attr relativeSize;
  //for table display in metrics.workspace
  get name() {
    return this.createdBy.get('username');
  }
  get folders() {
    return this.taggings
      .filterBy('isTrashed', false)
      .getEach('folder')
      .toArray();
  }
  get link() {
    return (
      'workspaces/' +
      this.workspace.id +
      '/submissions/' +
      this.submission.id +
      '/selections/' +
      this.id
    );
  }
  @attr('string') imageSrc;
  @attr('string') imageTagLink;
  @attr vmtInfo;
  @belongsTo('selection', { inverse: null }) originalSelection;
}
