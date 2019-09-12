/*global _:false */
Encompass.WorkspaceListContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'workspace-list-container',
  showList: true,
  showGrid: false,
  toggleTrashed: false,
  toggleHidden: false,
  utils: Ember.inject.service('utility-methods'),

  sortProperties: ['name'],
  workspaceToDelete: null,
  alert: Ember.inject.service('sweet-alert'),

  searchOptions: ['all', 'name', 'owner', 'collaborators'],
  searchCriterion: 'all',
  sortCriterion: { name: 'Newest', sortParam: { lastModifiedDate: -1 }, doCollate: true, type: 'lastModifiedDate' },
  sortOptions: {
    name: [
      {sortParam: null, icon: ''},
      { name: 'A-Z', sortParam: { name: 1 }, doCollate: true, icon:"fas fa-sort-alpha-down sort-icon", type: 'name' },
      { name: 'Z-A', sortParam: { name: -1 }, doCollate: true, icon:"fas fa-sort-alpha-up sort-icon", type: 'name' },
    ],
    lastModifiedDate: [
      { sortParam: null, icon: ''},
      {id: 3, name: 'Newest', sortParam: { lastModifiedDate: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'lastModifiedDate' },
      {id: 4, name: 'Oldest', sortParam: { lastModifiedDate: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'lastModifiedDate'}
    ],
    submissions: [
      { sortParam: null, icon: ''},
      { name: 'Most', sortParam: { submissions: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'submissions' },
      { name: 'Fewest', sortParam: { submissions: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'submissions'}
    ],
    selections: [
      { sortParam: null, icon: ''},
      { name: 'Most', sortParam: { selections: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'selections' },
      { name: 'Fewest', sortParam: { selections: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'selections'}
    ],
    comments: [
      { sortParam: null, icon: ''},
      { name: 'Most', sortParam: { comments: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'comments' },
      { name: 'Fewest', sortParam: { comments: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'comments'}
    ],
    responses: [
      { sortParam: null, icon: ''},
      { name: 'Most', sortParam: { responses: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'responses' },
      { name: 'Fewest', sortParam: { responses: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'responses'}
    ],
    owner: [
      {sortParam: null, icon: ''},
      { name: 'A-Z', sortParam: { owner: 1 }, doCollate: true, icon:"fas fa-sort-alpha-down sort-icon", type: 'owner' },
      { owner: 'Z-A', sortParam: { owner: -1 }, doCollate: true, icon:"fas fa-sort-alpha-up sort-icon", type: 'owner' },
    ],
    collabs: [
      { sortParam: null, icon: ''},
      { name: 'Most', sortParam: { permissions: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'collabs' },
      { name: 'Fewest', sortParam: { permissions: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'collabs'}
    ]
  },
  modeOptions: [
    {id: 1, label: 'All', value: ['public', 'private'], isChecked: true, icon: 'fas fa-list'},
    {id: 2, label: 'Public', value: ['public'], isChecked: false, icon: 'fas fa-globe-americas'},
    {id: 3, label: 'Private', value: ['private'], isChecked: false, icon: 'fas fa-unlock'},
  ],
  selectedMode: ['public', 'private', 'org'],

  moreMenuOptions: [
    {label: 'Copy', value: 'copy', action: 'copyWorkspace', icon: 'fas fa-copy'},
    {label: 'Assign', value: 'assign', action: 'assignWorkspace', icon: 'fas fa-list-ul'},
    {label: 'Hide', value: 'hide', action: 'hideWorkspace', icon: 'fas fa-archive'},
    {label: 'Delete', value: 'delete', action: 'deleteWorkspace', icon: 'fas fa-trash'},
  ],

  adminFilter: Ember.computed.alias('filter.primaryFilters.inputs.all'),


  primaryFilterValue: Ember.computed.alias('primaryFilter.value'),
  doUseSearchQuery: Ember.computed.or('isSearchingWorkspaces', 'isDisplayingSearchResults'),

  listResultsMessage: function() {
    let msg;
    // let userOrgName = this.get('userOrgName');
    if (this.get('isFetchingWorkspaces')) {
      if (this.get('showLoadingMessage')) {
        msg = 'Loading results... Thank you for your patience.';

      } else {
        msg = '';
      }
      return msg;
    }
    if (this.get('criteriaTooExclusive')) {
      msg = 'No results found. Please try expanding your filter criteria.';
      return msg;
    }

    if (this.get('isDisplayingSearchResults')) {
      let countDescriptor = 'workspaces';
      let verb;
      let criterion = this.get('searchCriterion');
      if (criterion === 'all') {
        verb = 'contain';
      } else {
        verb = 'contains';
      }
      let total = this.get('workspacesMetadata.total');
      if (total === 1) {
        countDescriptor = 'workspace';
        if (criterion === 'all') {
          verb = 'contains';
        }

      }
      let typeDescription = `whose ${criterion} ${verb}`;
      if (this.get('searchCriterion') === 'all') {
        typeDescription = `that ${verb}`;
      }
      msg = `Based off your filter criteria, we found ${this.get('workspacesMetadata.total')} ${countDescriptor} ${typeDescription} "${this.get('searchQuery')}"`;
      return msg;
    }
    msg = `${this.get('workspacesMetadata.total')} workspaces found`;

    let toggleTrashed = this.get('toggleTrashed');

    if (toggleTrashed) {
      msg = `${msg} - <strong>Displaying Trashed Workspaces</strong>`;
    }

    return msg;

  }.property('criteriaTooExclusive', 'isDisplayingSearchResults', 'workspaces.@each.isTrashed', 'isFetchingWorkspaces', 'showLoadingMessage'),


  init: function() {
    this.getUserOrg()
    .then((name) => {
      this.set('userOrgName', name);
      this.configureFilter();
      this.configurePrimaryFilter();
      this.getWorkspaces();
    });
    this._super(...arguments);
  },

  getUserOrg () {
   return this.get('currentUser.organization').then((org) => {
     if (org) {
       return org.get('name');
     } else {
       this.get('alert').showModal('warning', 'You currently do not belong to any organization', 'Please add or request an organization in order to get the best user experience', 'Ok');
       return 'undefined';
     }
   });
  },

  didReceiveAttrs() {
    let attributes = ['workspaces', 'organizations'];
    for (let attr of attributes) {
      let prop = this.get(attr);
      let modelAttr = this.model[attr];
      if (!Ember.isEqual(prop, modelAttr)) {
        this.set(attr, modelAttr);
        let metaPropName = `${attr}Metadata`;
        let meta = modelAttr.get('meta');
        if (meta) {
          this.set(metaPropName, meta);
        }
      }
    }
    this._super(...arguments);
  },

  didInsertElement() {
    let width = this.$().css('width');
    let widthNum = parseInt(width, 10);
    if (widthNum <= 430) {
      this.send('setGrid');
    }

    let doHideOutlet = this.get('doHideOutlet');
    if (_.isUndefined(doHideOutlet)) {
      this.set('doHideOutlet', this.get('model.hideOutlet') );

    }
    if (this.get('doHideOutlet') === false) {
      this.$('#outlet').removeClass('hidden');
    }
    this._super(...arguments);
  },

  configureFilter: function() {
    let currentUserOrgName = this.get('userOrgName');

    let filter = {
      primaryFilters:
        {
          selectedValue: "mine",
          inputs: {
            mine: {
              label: "Mine",
              value: "mine",
              isChecked: true,
              icon: "fas fa-user",
              order: 1,
              secondaryFilters: {
                selectedValues: ["createdBy", "owner"],
                inputs: {
                  createdBy: {
                    label: "Created By Me",
                    value: "createdBy",
                    isChecked: true,
                    isApplied: true,
                    icon: "fas fa-wrench"
                  },
                  owner: {
                    label: 'Owner',
                    value: "owner",
                    isChecked: true,
                    isApplied: true,
                    icon: "fas fa-building"
                  }
                }
              }
            },
            collab: {
              label: "Collaborator",
              value: "collab",
              isChecked: false,
              icon: "fas fa-users",
              order: 2,
            },
            myOrg: {
              label: "My Org",
              value: "myOrg",
              isChecked: false,
              icon: "fas fa-university",
              order: 3,
            },
            everyone: {
              label: "Public",
              value: "everyone",
              isChecked: false,
              icon: "fas fa-globe-americas",
              order: 4,
          }
        }
      }
    };
    let isAdmin = this.get('currentUser.isAdmin');
    let isPdadmin = this.get('currentUser.accountType') === "P";
    if (isPdadmin) {
      filter.primaryFilters.inputs.myOrg.secondaryFilters = {
        selectedValues: ["orgProblems", "fromOrg"],
        inputs: {
          orgProblems: {
            label: `Visbile to ${currentUserOrgName}`,
            value: "orgProblems",
            isChecked: true,
            isApplied: true,
            icon: "fas fa-dot-circle"
          },
          fromOrg: {
            label: `${currentUserOrgName} Workspaces`,
            value: "fromOrg",
            isChecked: true,
            isApplied: true,
            icon: "fas fa-users"
          }
        }
      };
    }

    if (isAdmin) {
      filter.primaryFilters.inputs.mine.isChecked = false;
      delete filter.primaryFilters.inputs.myOrg;
      filter.primaryFilters.inputs.all = {
        label: 'All',
        value:'all',
        icon: "fas fa-infinity",
        isChecked: true,
        order: 0,
        secondaryFilters: {
          selectedValue: 'org',
          initialItems: ['org'],
          inputs: {
            org: {
              label: "Organization",
              value: "org",
              selectedValues: [],
              subFilters: {
                selectedValues: ["fromOrg", "orgWorkspaces"],
                inputs: {
                    fromOrg: {
                      label: `Created or Owned by Members`,
                      value: "fromOrg",
                      isChecked: true,
                      isApplied: true,
                      icon: "fas fa-users"
                    },
                    orgWorkspaces: {
                      label: `Visibile to Members`,
                      value: "orgWorkspaces",
                      isChecked: true,
                      isApplied: true,
                      icon: "fas fa-dot-circle"
                    },
                  }
                }
            },
            creator: {
              label: "Creator",
              value: "creator",
              selectedValues: []
            },
            owner: {
              label: "Owner",
              value: "owner",
              selectedValues: []
            },
          }
        }
      };
    }
    this.set('filter', filter);
  },

  modeFilter: function () {
    return {
      $in: this.get('selectedMode')
    };
  }.property('selectedMode'),

  configurePrimaryFilter() {
    let primaryFilters = this.get('filter.primaryFilters');
    if (this.get('currentUser.isAdmin')) {
      primaryFilters.selectedValue = 'all';
      this.set('primaryFilter', primaryFilters.inputs.all);
      return;
    }
    this.set('primaryFilter', primaryFilters.inputs.mine);
  },

  buildMineFilter() {
    let filter = {};
    let userId = this.get('currentUser.id');
    let secondaryValues = this.get('primaryFilter.secondaryFilters.selectedValues');

    let includeCreated = _.indexOf(secondaryValues, 'createdBy') !== -1;
    let includeOwner = _.indexOf(secondaryValues, 'owner') !== -1;

    if (!includeCreated && !includeOwner) {
      this.set('criteriaTooExclusive', true);
      return;
    }

    filter.$or = [];

    if (includeCreated) {
      filter.$or.push({ createdBy: userId });
    }

    if (includeOwner) {
      filter.$or.push({ owner: userId });
    }

    return filter;
  },


  buildPublicFilter() {
    let filter = {};

    filter.mode = 'public';

    return filter;
  },

  buildMyOrgFilter() {
    let filter = {};
    let userOrgId = this.get('currentUser').get('organization.id');
    let secondaryValues = this.get('primaryFilter.secondaryFilters.selectedValues');
    filter.$or = [];

    if (secondaryValues) {
      let includeOrgWorkspaces = _.indexOf(secondaryValues, 'orgProblems') !== -1;
      let includeFromOrg = _.indexOf(secondaryValues, 'fromOrg') !== -1;

      if (!includeOrgWorkspaces && !includeFromOrg) {
        this.set("criteriaTooExclusive", true);
        return;
      }

      if (includeOrgWorkspaces) {
        this.set("selectedMode", ["org"]);
        filter.$or.push({ organization: userOrgId });
      }

      if (includeFromOrg) {
        this.set('selectedMode', ['org', 'private', 'public']);
        filter.includeFromOrg = true;
        //find all workspaces who's owner's org is same as yours
      }

    } else {
      filter.mode = 'org';
      filter.$or.push({ organization: userOrgId });
    }
    return filter;
  },

  buildAllFilter() {
    let filter = {};
    let adminFilter = this.get('adminFilter');
    let currentVal = adminFilter.secondaryFilters.selectedValue;
    let selectedValues = adminFilter.secondaryFilters.inputs[currentVal].selectedValues;

    let isEmpty = _.isEmpty(selectedValues);

    // if empty, do nothing - means include all orgs
    if (currentVal === 'org') {
      // no org selected yet, so no filter applied yet
      if (isEmpty) {
        return {};
      }
      // recommended, fromOrg
      let secondaryValues = this.get('adminFilter.secondaryFilters.inputs.org.subFilters.selectedValues');

      let includeFromOrg = _.indexOf(secondaryValues, 'fromOrg') !== -1;
      let includeOrgWorkspaces = _.indexOf(secondaryValues, 'orgWorkspaces') !== -1;

      // immediately return 0 results
      if (!includeFromOrg && !includeOrgWorkspaces) {
        this.set('criteriaTooExclusive', true);
        return;
      }
      filter.all = {};
      filter.all.org = {};

      filter.all.org.organizations = selectedValues;
      // mode "org" and organization prop
      if (includeOrgWorkspaces) {
        this.set("selectedMode", ["org"]);
      }
      //
      if (includeFromOrg) {
        this.set('selectedMode', ['org', 'private', 'public']);
        filter.all.org.includeFromOrg = true;
        //find all workspaces who's owner's org is same as yours
      }
      return filter;
    }

    if (currentVal === 'creator') {
      if (!isEmpty) {
        filter.createdBy = { $in: selectedValues };
      }
      return filter;
    }

    if (currentVal === 'owner') {
      if (!isEmpty) {
        filter.owner = { $in: selectedValues};
      }
      return filter;
    }
    return filter;
},

buildCollabFilter() {
  const utils = this.get('utils');
  const collabWorkspaces = this.get('currentUser.collabWorkspaces');

  let ids;
  let filter = {};

  if (utils.isNonEmptyArray(collabWorkspaces)) {
    ids = collabWorkspaces;
  }
  // user is not a collaborator for any workspaces
  if (!this.get('utils').isNonEmptyArray(ids)) {
    this.set('criteriaTooExclusive', true);
    return filter;
  }
  filter._id = { $in: ids };

  return filter;
},

  buildModeFilter: function() {
    //privacy setting determined from privacy drop down on main display
    let mode = this.get('modeFilter');
    return {
       $in: mode
    };
  },

  buildSortBy: function() {
    if (this.get('searchByRelevance')) {
      return {
        sortParam: {
          score: { $meta: "textScore" }
        },
        doCollate: false,
        byRelevance: true
      };
    }

    let criterion = this.get('sortCriterion');
    if (!criterion) {
      return { title: 1, doCollate: true };
    }
    let { sortParam, doCollate } = criterion;
    return {
      sortParam,
      doCollate
    };
  },

  buildSearchBy: function() {
    let criterion = this.get('searchCriterion');
    let query = this.get('searchQuery');
    return {
      criterion,
      query
    };
  },

  buildFilterBy: function() {
    let primaryFilterValue = this.get('primaryFilterValue');
    let isPdadmin = this.get('currentUser.accountType') === "P";
    let filterBy;

    if (primaryFilterValue === 'mine') {
      filterBy = this.buildMineFilter();
    }

    if (primaryFilterValue === 'collab') {
      filterBy = this.buildCollabFilter();
    }

    if (primaryFilterValue === 'everyone') {
      filterBy = this.buildPublicFilter();
    }

    if (primaryFilterValue === 'myOrg') {
      filterBy = this.buildMyOrgFilter();
    }

    if (primaryFilterValue === 'all') {
      filterBy = this.buildAllFilter();
    }
    if (_.isUndefined(filterBy) || _.isNull(filterBy)) {
      filterBy = {};
    }
    // primary public filter should disable privacy setting dropdown?
    if (primaryFilterValue === 'everyone') {
      filterBy.mode = {$in: ['public']};
    } else if (primaryFilterValue === 'myOrg') {
      if (isPdadmin) {
        let mode = this.get('modeFilter');
        filterBy.mode = mode;
      } else {
        filterBy.mode = { $in: ['org'] };
      }
    } else {
      let mode = this.get('modeFilter');
      filterBy.mode = mode;
    }

    return filterBy;
  },

  displayWorkspaces: function () {
    let hiddenWorkspaces = this.get('currentUser.hiddenWorkspaces');
    let workspaces = this.get('workspaces');
    let visibileWorkspaces = workspaces.filter((workspace) => {
      if (!hiddenWorkspaces.includes(workspace.id)) {
        return workspace;
      }
    });

    if (visibileWorkspaces) {
      if (this.get("toggleTrashed")) {
        return visibileWorkspaces;
      } else if (this.get('toggleHidden')) {
        // this.get('store').findRecord('workspace', hiddenWorkspaces[0]).then((workspaces) => {
        //   console.log(workspaces.id);
        // });
      } else {
        return visibileWorkspaces.rejectBy("isTrashed");
      }
    }
  }.property('workspaces.@each.isTrashed', 'toggleTrashed', 'currentUser.hiddenWorkspaces'),

  buildQueryParams: function(page, isTrashedOnly) {
    let params = {};
    if (page) {
      params.page = page;
    }

    if (isTrashedOnly) {
      params.isTrashedOnly = true;
      return params;
    }

    let sortBy = this.buildSortBy();
    let filterBy = this.buildFilterBy();

    if (this.get('criteriaTooExclusive') ) {
      // display message or just 0 results
      this.set('workspaces', []);
      this.set('workspacesMetadata', null);
      this.set('isFetchingWorkspaces', false);
      return;
    }
    params = {
      sortBy,
      filterBy
    };

    if (page) {
      params.page = page;
    }

    if (this.get('doUseSearchQuery')) {
      let searchBy = this.buildSearchBy();
      params.searchBy = searchBy;
    }
    return params;
  },

  handleLoadingMessage: function() {
    const that = this;
    if (!this.get('isFetchingWorkspaces')) {
      this.set('showLoadingMessage', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying || !that.get('isFetchingWorkspaces')) {
        return;
      }
      that.set('showLoadingMessage', true);
    }, 300);
  }.observes('isFetchingWorkspaces'),

  getWorkspaces: function(page, isTrashedOnly=false, isHiddenOnly=false) {
    this.set('isFetchingWorkspaces', true);
    let queryParams = this.buildQueryParams(page, isTrashedOnly);

    if (this.get('criteriaTooExclusive')) {
      if (this.get('isFetchingWorkspaces')) {
        this.set('isFetchingWorkspaces', false);
      }
      return;
    }

    this.store.query('workspace',
      queryParams
    ).then((results) => {
      this.removeMessages('workspaceLoadErrors');
      this.set('workspaces', results);
      this.set('workspacesMetadata', results.get('meta'));
      this.set('isFetchingWorkspaces', false);


      let isSearching = this.get('isSearchingWorkspaces');

      if (isSearching) {
        this.set('isDisplayingSearchResults', true);
        this.set('isSearchingWorkspaces', false);
      }

      if (this.get('searchByRelevance')) {
        this.set('searchByRelevance', false);
      }

      if (this.get('isChangingPage')) {
        this.set('isChangingPage', false);
      }

      if (isHiddenOnly) {
        console.log('getWorkspaces and isHiddenOnly is', isHiddenOnly);
      }
    }).catch((err) => {
      if (!this.get('isDestroyed') && !this.get('isDestroying')) {
        this.handleErrors(err, 'workspaceLoadErrors');
        this.set('isFetchingWorkspaces', false);
      }
    });
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
    return list.sortBy('lastModifiedDate').reverse();

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
    refreshList() {
      let isTrashedOnly = this.get('toggleTrashed');
      let isHiddenOnly = this.get('toggleHidden');
      this.getWorkspaces(null, isTrashedOnly, isHiddenOnly);
    },
    toggleFilter: function(key) {
      if (key === this.get('listFilter')) {
        return;
      }
      this.set('listFilter', key);
    },
    triggerShowTrashed() {
      this.send('triggerFetch', this.get('toggleTrashed'));
    },
    triggerShowHidden() {
      this.send('triggerFetch', this.get('toggleHidden'));
    },
    clearSearchResults: function() {
      this.set('searchQuery', null);
      this.set('searchInputValue', null);
      this.set('isDisplayingSearchResults', false);
      this.send('triggerFetch');
    },
    updatePageResults(results) {
      this.set('workspaces', results);
    },

    searchWorkspaces(val, criterion) {
      if (criterion === 'all') {
        this.set('searchByRelevance', true);
      }
      this.set('searchQuery', val);
      this.set('searchCriterion', criterion);
      this.set('isSearchingWorkspaces', true);
      this.send('triggerFetch');
    },
    initiatePageChange: function(page) {
      this.set('isChangingPage', true);
      let isTrashedOnly = this.get('toggleTrashed');
      let isHiddenOnly = this.get('toggleHidden');
      this.getWorkspaces(page, isTrashedOnly, isHiddenOnly);
    },

    updateFilter: function(id, checked) {
      let filter = this.get('filter');
      let keys = Object.keys(filter);
      if (!keys.includes(id)) {
        return;
      }
      filter[id] = checked;
      this.send('triggerFetch');
    },
    updateSortCriterion(criterion) {
      this.set('sortCriterion', criterion);
      this.send('triggerFetch');
    },
    triggerFetch(isTrashedOnly=false, isHiddenOnly=false) {
      for (let prop of ['criteriaTooExclusive']) {
        if (this.get(prop)) {
          this.set(prop, null);
        }
      }
      this.getWorkspaces(null, isTrashedOnly, isHiddenOnly);
    },
    setGrid: function () {
      $('#layout-view').addClass('grid-view');
      this.set('showGrid', true);
      this.set('showList', false);
    },
    setList: function() {
      $('#layout-view').removeClass('grid-view');
      this.set('showList', true);
      this.set('showGrid', false);
    },
    updateMode(val) {
      if (!val) {
        return;
      }
      this.set('selectedMode', val);
      this.send('triggerFetch');
    },
    toggleMenu: function () {
      $('#filter-list-side').toggleClass('collapse');
      $('#arrow-icon').toggleClass('fa-rotate-180');
      $('#filter-list-side').addClass('animated slideInLeft');
    },
    toCopyWorkspace(workspace) {
      this.sendAction('toCopyWorkspace', workspace);
    }
  }
});