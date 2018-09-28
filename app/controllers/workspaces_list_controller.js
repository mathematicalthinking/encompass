/**
  * # Wokspace List Controller
  * @description The controller for listing workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
*/
Encompass.WorkspacesListController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  sortProperties: ['name'],
  workspaceToDelete: null,
  alert: Ember.inject.service('sweet-alert'),

  currentAsOf: function() {
    return moment(this.get('since')).format('H:mm');
  }.property(),

  listFilter: 'all',

  sortDisplayList: function(list) {
    if (!list) {
      return;
    }
    // TODO: robust sorting options

    // for now just show most recently created at top
    return list.sortBy('lastViewed').reverse();

  },

  setDisplayList: function() {
    const filterKey = {
      all: 'allWorkspaces',
      mine: 'ownWorkspaces',
      public: 'publicWorkspaces'
    };

    const filter = this.get('listFilter');

    if (Ember.isEmpty(filter) || Ember.isEmpty(filterKey[filter])) {
      return this.get('model').rejectBy('isTrashed');
    }

    const listName = filterKey[filter];
    let displayList = this.get(listName);
    let sorted = this.sortDisplayList(displayList);

    if (sorted) {
      this.set('displayList', sorted);
    } else {
      this.set('displayList', this.get(listName));
    }

  }.observes('listFilter', 'model.@each.isTrashed'),

  setOwnWorkspaces: function() {
    const currentUser = this.get('currentUser');
    const workspaces = this.get('model').rejectBy('isTrashed');

    this.set('ownWorkspaces', workspaces.filterBy('owner.id', currentUser.id));
  }.observes('model.@each.isTrashed'),

  setAllWorkspaces: function() {
    this.set('allWorkspaces', this.get('model').rejectBy('isTrashed'));
  }.observes('model.@each.isTrashed'),

  setPublicWorkspaces: function() {
    console.log('public');
    const workspaces = this.get('model').rejectBy('isTrashed');
    this.set('publicWorkspaces', workspaces.filterBy('mode', 'public'));
  }.observes('model.@each.isTrashed'),

  actions: {
    showModal: function(ws) {
      this.set('workspaceToDelete', ws);
      window.swal({
        title: 'Are you sure you want to delete this workspace?',
        type: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.send('trashWorkspace', ws);
        }
      });
    },

    trashWorkspace: function(ws) {
      const id = ws.id;
      const workspaces = this.get('model');
      const filtered = workspaces.filterBy('id', id);
      if (!Ember.isEmpty(filtered)) {
        const ws = filtered.objectAt(0);
        ws.set('isTrashed', true);
        ws.save().then(() => {
          this.set('workspaceToDelete', null);
          this.get('alert').showToast('success', 'Workspace Deleted', 'bottom-end', 5000, true, 'Undo').then((result) => {
            if (result.value) {
              ws.set('isTrashed', false);
              ws.save().then(() => {
                this.get('alert').showToast('success', 'Workspace Restored', 'bottom-end', 3000, null);
              });
            }
          });
        })
        .catch((err) => {
          this.set('workspaceToDelete', null);
          this.set('workspaceDeleteError', err);
        });
      }
    },

    toggleFilter: function(key) {
      if (key === this.get('listFilter')) {
        return;
      }
      this.set('listFilter', key);
    }
  }
});


