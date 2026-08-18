import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class DetailsListItemComponent extends Component {
  get doShowRemoveIcon() {
    if (this.args.cannotBeRemoved) {
      return false;
    }

    const hasValue =
      this.args.displayValue !== null && this.args.displayValue !== undefined;
    const children = Array.isArray(this.args.children)
      ? this.args.children
      : [];
    const hasValidChild = children.some((child) => {
      const childValue = child?.displayValue;
      return childValue !== null && childValue !== undefined;
    });

    return hasValue || hasValidChild;
  }

  @action
  editValue() {
    if (typeof this.args.editValue === 'function') {
      this.args.editValue(this.args.associatedStep);
    }
  }
}
