import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'vmt-import-step2',

  alert: service('sweet-alert'),
  utils: service('utility-methods'),

  selectedRooms: null,
  selectedActivities: null,
  searchResults: null,

  didReceiveAttrs() {
    if (this.existingSelectedRooms) {
      this.set('selectedRooms', this.existingSelectedRooms);
    } else if (this.selectedRooms === null) {
      this.set('selectedRooms', []);
    }

    if (this.existingSelectedActivities) {
      this.set('selectedActivities', this.existingSelectedActivities);
    } else if (this.selectedActivities === null) {
      this.set('selectedActivities', []);
    }

    if (this.mostRecentSearchResults) {
      this.set('searchResults', this.mostRecentSearchResults);
    }
  },

  willDestroyComponent() {
    // store previous results on import-vmt-container for when user hits back
    if (this.searchResults) {
      this.setPreviousSearchResults(this.searchResults);
    }
  },

  selectedRoomIds: computed('selectedRooms.[]', function () {
    let rooms = this.selectedRooms || [];
    return rooms.mapBy('_id');
  }),

  selectedActivityIds: computed('selectedActivities.[]', function () {
    let activities = this.selectedActivities || [];
    return activities.mapBy('_id');
  }),

  showList: computed('displayResults', function () {
    return this.utils.isNonEmptyObject(this.displayResults);
  }),

  displayResults: computed('searchResults', 'previousResults', function () {
    return this.searchResults || this.previousResults;
  }),

  actions: {
    handleSearchResults(results) {
      this.set('searchResults', results);
    },
    onRoomSelect(room) {
      let isAlreadySelected = this.selectedRoomIds.includes(room._id);

      if (isAlreadySelected) {
        this.selectedRooms.removeObject(room);
        return;
      }
      this.selectedRooms.addObject(room);
    },

    onActivitySelect(activity) {
      let rooms = activity.rooms;
      let areRooms = this.utils.isNonEmptyArray(rooms);

      let isAlreadySelected = this.selectedActivityIds.includes(activity._id);

      if (isAlreadySelected) {
        this.selectedActivities.removeObject(activity);
        if (areRooms) {
          this.selectedRooms.removeObjects(rooms);
        }
        return;
      }

      if (!areRooms && !isAlreadySelected) {
        return this.alert.showToast(
          'error',
          'This activity does not have any rooms',
          'bottom-end',
          3000,
          false,
          null
        );
      }
      this.selectedActivities.pushObject(activity);
      this.selectedRooms.addObjects(rooms);
    },

    next() {
      if (!this.get('selectedRooms.length') > 0) {
        return this.alert.showToast(
          'error',
          'Please select at least one room or activity to proceed',
          'bottom-end',
          3000,
          false,
          null
        );
      }
      this.onProceed(this.selectedRooms, this.searchResults);
    },
  },
});
