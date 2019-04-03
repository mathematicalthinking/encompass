Encompass.VmtImportStep2Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'vmt-import-step2',

  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  selectedRooms: null,
  searchResults: null,

  didReceiveAttrs() {
    if (this.get('existingSelectedRooms')) {
      this.set('selectedRooms', this.get('existingSelectedRooms'));
    } else if (this.get('selectedRooms') === null) {
      this.set('selectedRooms', []);
    }

    if (this.get('mostRecentSearchResults')) {
      this.set('searchResults', this.get('mostRecentSearchResults'));
    }

  },

  willDestroyComponent() {
    if (this.get('searchResults')) {
      this.get('setPreviousSearchResults')(this.get('searchResults'));
    }
  },

  selectedRoomIds: function() {
    let rooms = this.get('selectedRooms') || [];
    return rooms.mapBy('_id');
  }.property('selectedRooms.[]'),

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
      console.log('ors vis2', room);

      let isAlreadySelected = this.get('selectedRoomIds').includes(room._id);

      if (isAlreadySelected) {
        this.get('selectedRooms').removeObject(room);
        return;
      }
      this.get('selectedRooms').addObject(room);
    },
    next() {
      if (!this.get('selectedRooms.length') > 0 ) {
        return this.get('alert').showToast('error', 'Please select at least one room or activity to proceed', 'bottom-end', 3000, false, null);
      }
      this.get('onProceed')(this.get('selectedRooms'), this.get('searchResults'));
    }
  }

});