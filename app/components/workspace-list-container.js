Encompass.WorkspaceListContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'workspace-list-container',
  showList: true,
  showGrid: false,

  sortProperties: ['name'],
  workspaceToDelete: null,
  alert: Ember.inject.service('sweet-alert'),

  searchOptions: ['all'],
  searchCriterion: 'all',
  sortCriterion: { name: 'A-Z', sortParam: { name: 1 }, doCollate: true, type: 'name' },
  sortOptions: {
    name: [
      {sortParam: null, icon: 'fas fa-minus'},
      { name: 'A-Z', sortParam: { name: 1 }, doCollate: true, icon:"fas fa-sort-alpha-down sort-icon", type: 'name' },
      { name: 'Z-A', sortParam: { name: -1 }, doCollate: true, icon:"fas fa-sort-alpha-up sort-icon", type: 'name' },
    ],
    lastViewed: [
      { sortParam: null, icon: 'fas fa-minus'},
      {id: 3, name: 'Newest', sortParam: { lastViewed: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'lastViewed' },
      {id: 4, name: 'Oldest', sortParam: { lastViewed: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'lastViewed'}
    ],
    submissions: [
      { sortParam: null, icon: 'fas fa-minus'},
      { name: 'Most', sortParam: { submissions: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'submissions' },
      { name: 'Fewest', sortParam: { submissions: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'submissions'}
    ],
    owner: [
      {sortParam: null, icon: 'fas fa-minus'},
      { name: 'A-Z', sortParam: { owner: 1 }, doCollate: true, icon:"fas fa-sort-alpha-down sort-icon", type: 'owner' },
      { owner: 'Z-A', sortParam: { owner: -1 }, doCollate: true, icon:"fas fa-sort-alpha-up sort-icon", type: 'owner' },
    ],
    editors: [
      { sortParam: null, icon: 'fas fa-minus'},
      { name: 'Most', sortParam: { editors: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'editors' },
      { name: 'Fewest', sortParam: { editors: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'editors'}
    ]
  },
  privacySettingOptions: [
    {id: 1, label: 'All', value: ['public', 'private'], isChecked: true, icon: 'fas fa-list'},
    {id: 2, label: 'Public', value: ['public'], isChecked: false, icon: 'fas fa-globe-americas'},
    {id: 3, label: 'Private', value: ['private'], isChecked: false, icon: 'fas fa-lock'},
  ],
  selectedModeSetting: ['public', 'private'],

  moreMenuOptions: [
    {label: 'Edit', value:'edit', action: 'editProblem', icon: 'far fa-edit'},
    {label: 'Delete', value: 'delete', action: 'deleteProblem', icon: 'fas fa-trash'},
  ],

  didReceiveAttrs() {
    let model = this.get('model');
    let workspaces = this.get('workspaces');

    if (!Ember.isEqual(workspaces, model)) {
      this.set('workspaces', model);
      let metaPropName = `${workspaces}Metadata`;
      let meta = model.get('meta');
      if (meta) {
        this.set(metaPropName, meta);
      }
    }
    this._super(...arguments);
  },

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

  displayList: function() {
    const filterKey = {
      all: 'allWorkspaces',
      mine: 'ownWorkspaces',
      public: 'publicWorkspaces'
    };

    const filter = this.get('listFilter');

    if (_.isUndefined(filter) || _.isUndefined(filterKey[filter])) {
      return this.get('workspaces').rejectBy('isTrashed');
    }

    const listName = filterKey[filter];
    let displayList = this.get(listName);
    let sorted = this.sortDisplayList(displayList);

    // if (sorted) {
    //   this.set('displayList', sorted);
    //   return sorted;
    // } else {
    //   this.set('displayList', this.get(listName));
    // }
    return sorted;

  }.property('listFilter', 'workspaces.@each.isTrashed'),

  setOwnWorkspaces: function() {
    const currentUser = this.get('currentUser');
    const workspaces = this.get('workspaces').rejectBy('isTrashed');

    this.set('ownWorkspaces', workspaces.filterBy('owner.id', currentUser.id));
  }.observes('workspaces.@each.isTrashed'),

  setAllWorkspaces: function() {
    this.set('allWorkspaces', this.get('workspaces').rejectBy('isTrashed'));
  }.observes('workspaces.@each.isTrashed'),

  setPublicWorkspaces: function() {
    const workspaces = this.get('workspaces').rejectBy('isTrashed');
    this.set('publicWorkspaces', workspaces.filterBy('mode', 'public'));
  }.observes('workspaces.@each.isTrashed'),

  actions: {
    showModal: function(ws) {
      this.set('workspaceToDelete', ws);
      this.get('alert').showModal('warning', 'Are you sure you want to delete this workspace?', null, 'Yes, delete it')
      .then((result) => {
        if (result.value) {
          this.send('trashWorkspace', ws);
        }
      });
    },

    trashWorkspace: function(ws) {
      const id = ws.id;
      const workspaces = this.get('workspaces');
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