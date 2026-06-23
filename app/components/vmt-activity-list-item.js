import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class VmtActivityListItemComponent extends Component {
  @tracked isExpanded = false;
  @tracked areRoomsExpanded = false;

  get isSelected() {
    let ids = this.args.selectedActivityIds || [];
    return ids.includes(this.args.activity?._id);
  }

  get encodedImageUri() {
    if (!this.args.activity?.image) {
      return '';
    }
    return encodeURI(this.args.activity.image);
  }

  get expandHideRoomsIcon() {
    if (this.areRoomsExpanded) {
      return {
        className: 'far fa-minus-square',
        title: 'Hide rooms',
      };
    }
    return {
      className: 'far fa-plus-square',
      title: 'Show rooms',
    };
  }

  @action
  expandImage() {
    this.isExpanded = !this.isExpanded;
  }

  @action
  handleSelect() {
    if (typeof this.args.onSelect === 'function') {
      this.args.onSelect(this.args.activity);
    }
  }

  @action
  handleRoomSelect(room) {
    if (typeof this.args.onRoomSelect === 'function') {
      this.args.onRoomSelect(room);
    }
  }

  @action
  toggleRooms() {
    this.areRoomsExpanded = !this.areRoomsExpanded;
  }
}
