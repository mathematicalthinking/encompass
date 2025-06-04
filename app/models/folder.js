import { attr, belongsTo, hasMany } from '@ember-data/model';
import AuditableModel from './auditable';

export default class FolderModel extends AuditableModel {
  @attr('string') name;
  @attr('number') weight;
  @hasMany('tagging', { inverse: 'folder', async: true }) taggings;
  @belongsTo('folder', { inverse: 'children', async: true }) parent;
  @hasMany('folder', { inverse: 'parent', async: true }) children;
  @belongsTo('workspace', { async: true }) workspace;
  @attr('boolean') isTopLevel;
  @attr('boolean', { defaultValue: false }) isExpanded;
  sortProperties = ['weight', 'name'];

  get cleanTaggings() {
    return this.taggings.filter((tagging) => !tagging.get('isTrashed'));
  }

  get taggedSelections() {
    return this.cleanTaggings
      .map((tagging) => tagging.selection)
      .filter(Boolean);
  }

  get cleanSelections() {
    return this.taggedSelections.filter(
      (selection) => !selection.get('isTrashed')
    );
  }

  get cleanChildren() {
    return this.children.filter((child) => !child.get('isTrashed'));
  }

  get hasChildren() {
    return this.cleanChildren.length > 0;
  }

  get childSelections() {
    const allSelections = this.hasChildren
      ? this.cleanChildren.reduce(
          (acc, child) => acc.concat(child._selections),
          [...this.cleanSelections]
        )
      : [...this.cleanSelections];

    const seen = new Set();
    return allSelections.filter((sel) => {
      if (seen.has(sel.id)) return false;
      seen.add(sel.id);
      return true;
    });
  }

  get _selections() {
    return this.childSelections;
  }

  get submissions() {
    let submissions = this.cleanSelections
      .map((selection) => selection.get('submission'))
      .filter(Boolean);
    return Array.from(
      new Set(submissions.map((submission) => submission.id))
    ).map((id) => submissions.find((submission) => submission.id === id));
  }

  get _submissions() {
    const all = this.cleanChildren.reduce(
      (acc, child) => acc.concat(child._submissions),
      [...this.submissions]
    );

    const seen = new Set();
    return all.filter((sub) => {
      if (seen.has(sub.id)) return false;
      seen.add(sub.id);
      return true;
    });
  }

  hasSelection(selectionId) {
    return this.cleanSelections.some((sel) => sel.id === selectionId);
  }

  get sortedChildren() {
    return this.cleanChildren.sort((a, b) => {
      for (let prop of this.sortProperties) {
        if (a[prop] < b[prop]) return -1;
        if (a[prop] > b[prop]) return 1;
      }
      return 0;
    });
  }

  @belongsTo('folder', { inverse: null }) originalFolder;
}
