import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  selectionId: alias('id'),
  text: attr('string'),
  coordinates: attr('string'),
  taggings: hasMany('tagging', { async: true }),
  comments: hasMany('comment', { async: true }),
  submission: belongsTo('submission', { async: true }),
  workspace: belongsTo('workspace', { async: false }),
  relativeCoords: attr(),
  relativeSize: attr(),
  folders: computed('taggings.@each.isTrashed', 'taggings.[]', function () {
    return this.taggings
      .filterBy('isTrashed', false)
      .getEach('folder')
      .toArray();
  }),
  link: computed('workspace', 'submission', 'id', function () {
    return (
      '#/workspaces/' +
      this.workspace.id +
      '/submissions/' +
      this.submission.id +
      '/selections/' +
      this.id
    );
    //https://github.com/emberjs/ember.js/pull/4718
    //ENC-526
  }),
  imageSrc: attr('string'),
  imageTagLink: attr('string'),
  vmtInfo: attr(''),
  originalSelection: belongsTo('selection', { inverse: null }),
});
