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
    let selections = [...this.cleanSelections];
    if (this.hasChildren) {
      this.cleanChildren.forEach((child) => {
        selections.push(...child._selections);
      });
    }
    return Array.from(new Set(selections.map((selection) => selection.id))).map(
      (id) => selections.find((selection) => selection.id === id)
    );
  }

  get _selections() {
    return this.childSelections;
  }

  get submissions() {
    let submissions = this.cleanSelections
      .map((selection) => selection.submission)
      .filter(Boolean);
    return Array.from(
      new Set(submissions.map((submission) => submission.id))
    ).map((id) => submissions.find((submission) => submission.id === id));
  }

  get _submissions() {
    let submissions = [...this.submissions];
    this.cleanChildren.forEach((child) => {
      submissions.push(...child._submissions);
    });
    return Array.from(
      new Set(submissions.map((submission) => submission.id))
    ).map((id) => submissions.find((submission) => submission.id === id));
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
