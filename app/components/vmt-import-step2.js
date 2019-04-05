Encompass.VmtImportStep2Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'vmt-import-step2',

  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  selectedRooms: null,
  selectedActivities: null,
  searchResults: null,

  didReceiveAttrs() {
    if (this.get('existingSelectedRooms')) {
      this.set('selectedRooms', this.get('existingSelectedRooms'));
    } else if (this.get('selectedRooms') === null) {
      this.set('selectedRooms', []);
    }

    if (this.get('existingSelectedActivities')) {
      this.set('selectedActivities', this.get('existingSelectedActivities'));
    } else if (this.get('selectedActivities') === null) {
      this.set('selectedActivities', []);
    }

    if (this.get('mostRecentSearchResults')) {
      this.set('searchResults', this.get('mostRecentSearchResults'));
    }

  },

  willDestroyComponent() {
    // store previous results on import-vmt-container for when user hits back

    if (this.get('searchResults')) {
      this.get('setPreviousSearchResults')(this.get('searchResults'));
    }
  },

  selectedRoomIds: function() {
    let rooms = this.get('selectedRooms') || [];
    return rooms.mapBy('_id');
  }.property('selectedRooms.[]'),

  selectedActivityIds: function() {
    let activities = this.get('selectedActivities') || [];
    return activities.mapBy('_id');
  }.property('selectedActivities.[]'),

  showList: function() {
    return this.get('utils').isNonEmptyObject(this.get('displayResults'));
  }.property('displayResults'),

  displayResults: function() {
    return this.get('searchResults') || this.get('previousResults');
  }.property('searchResults', 'previousResults'),

  actions: {
    handleSearchResults(results) {
      let { isInvalidToken } = results;

      if (isInvalidToken) {
        this.get('handleInvalidToken')();
        return;
      }

      this.set('searchResults', results);

    },
    onRoomSelect(room) {
      let isAlreadySelected = this.get('selectedRoomIds').includes(room._id);

      if (isAlreadySelected) {
        this.get('selectedRooms').removeObject(room);
        return;
      }
      this.get('selectedRooms').addObject(room);
    },

    onActivitySelect(activity) {
      let rooms = activity.rooms;
      let areRooms = this.get('utils').isNonEmptyArray(rooms);

      let isAlreadySelected = this.get('selectedActivityIds').includes(activity._id);

      if (isAlreadySelected) {
        this.get('selectedActivities').removeObject(activity);
        if (areRooms) {
          this.get('selectedRooms').removeObjects(rooms);
        }
        return;
      }

      if (!areRooms) {
        return this.get('alert').showToast('error', 'This activity does not have any rooms', 'bottom-end', 3000, false, null);
      }
      this.get('selectedActivities').pushObject(activity);
      this.get('selectedRooms').addObjects(rooms);

    },

    next() {
      if (!this.get('selectedRooms.length') > 0 ) {
        return this.get('alert').showToast('error', 'Please select at least one room or activity to proceed', 'bottom-end', 3000, false, null);
      }
      this.get('onProceed')(this.get('selectedRooms'), this.get('searchResults'));
    }
  }

});