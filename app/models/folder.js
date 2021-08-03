import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  name: attr('string'),
  weight: attr('number'),
  taggings: hasMany('tagging', { async: true }),
  parent: belongsTo('folder', { inverse: 'children', async: true }),
  children: hasMany('folder', { inverse: 'parent', async: true }),
  workspace: belongsTo('workspace', { async: true }),
  isTopLevel: attr('boolean'),
  isExpanded: false,
  sortProperties: () => ['weight', 'name'],

  cleanTaggings: computed('taggings.content.@each.isTrashed', function () {
    return this.taggings.content.rejectBy('isTrashed');
  }),

  taggedSelections: computed('cleanTaggings.[]', function () {
    return this.cleanTaggings.mapBy('selection.content').compact();
  }),

  cleanSelections: computed('taggedSelections.@each.isTrashed', function () {
    return this.taggedSelections.rejectBy('isTrashed');
  }),

  cleanChildren: computed('children.content.@each.isTrashed', function () {
    return this.children.content.rejectBy('isTrashed');
  }),

  hasChildren: computed.gt('cleanChildren.length', 0),

  childSelections: computed(
    'children.@each._selections',
    'cleanChildren',
    'cleanSelections.[]',
    'hasChildren',
    function () {
      let selections = this.cleanSelections;

      let results = [];

      results.addObjects(selections);

      let children = this.cleanChildren;

      if (this.hasChildren) {
        children.getEach('_selections').forEach(function (childSelections) {
          results.pushObjects(childSelections);
        });
      }
      return results.uniqBy('id');
    }
  ),

  _selections: computed.reads('childSelections'),

  submissions: computed('cleanSelections.@each.submission', function () {
    let results = this.cleanSelections;
    let submissions = results.mapBy('submission.content');
    let clean = submissions.compact();
    return clean.uniqBy('id');
  }),

  _submissions: computed(
    'cleanChildren.[]',
    'submissions.[]',
    'children.@each._submissions',
    function () {
      let submissions = this.submissions;

      let results = [];
      results.addObjects(submissions);

      this.cleanChildren
        .getEach('_submissions')
        .forEach(function (childSubmissions) {
          results.pushObjects(childSubmissions);
        });

      return results.uniqBy('id');
    }
  ),

  hasSelection: function (selectionId) {
    return this.cleanSelections.find((sel) => {
      return sel.get('id') === selectionId;
    });
  },

  sortedChildren: sort('cleanChildren', 'sortProperties'),
  originalFolder: belongsTo('folder', { inverse: null }),
});
