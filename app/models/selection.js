import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class SelectionModel extends Model.extend(Auditable) {
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
