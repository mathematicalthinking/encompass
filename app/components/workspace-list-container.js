import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { alias, or } from '@ember/object/computed';
/*global _:false */
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import $ from 'jquery';
import moment from 'moment';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'workspace-list-container',
  showList: true,
  showGrid: false,
  toggleTrashed: false,
  toggleHidden: false,
  utils: service('utility-methods'),

  sortProperties: ['name'],
  workspaceToDelete: null,
  alert: service('sweet-alert'),

  searchOptions: ['all', 'name', 'owner', 'collaborators'],
  searchCriterion: 'all',
  sortCriterion: {
    name: 'Newest',
    sortParam: { lastModifiedDate: -1 },
    doCollate: true,
    type: 'lastModifiedDate',
  },
  sortOptions: {
    name: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { name: 1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'name',
      },
      {
        name: 'Z-A',
        sortParam: { name: -1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'name',
      },
    ],
    lastModifiedDate: [
      { sortParam: null, icon: '' },
      {
        id: 3,
        name: 'Newest',
        sortParam: { lastModifiedDate: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'lastModifiedDate',
      },
      {
        id: 4,
        name: 'Oldest',
        sortParam: { lastModifiedDate: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'lastModifiedDate',
      },
    ],
    submissions: [
      { sortParam: null, icon: '' },
      {
        name: 'Most',
        sortParam: { submissions: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'submissions',
      },
      {
        name: 'Fewest',
        sortParam: { submissions: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'submissions',
      },
    ],
    selections: [
      { sortParam: null, icon: '' },
      {
        name: 'Most',
        sortParam: { selections: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'selections',
      },
      {
        name: 'Fewest',
        sortParam: { selections: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'selections',
      },
    ],
    comments: [
      { sortParam: null, icon: '' },
      {
        name: 'Most',
        sortParam: { comments: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'comments',
      },
      {
        name: 'Fewest',
        sortParam: { comments: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'comments',
      },
    ],
    responses: [
      { sortParam: null, icon: '' },
      {
        name: 'Most',
        sortParam: { responses: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'responses',
      },
      {
        name: 'Fewest',
        sortParam: { responses: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'responses',
      },
    ],
    owner: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { owner: 1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'owner',
      },
      {
        owner: 'Z-A',
        sortParam: { owner: -1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'owner',
      },
    ],
    collabs: [
      { sortParam: null, icon: '' },
      {
        name: 'Most',
        sortParam: { permissions: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'collabs',
      },
      {
        name: 'Fewest',
        sortParam: { permissions: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'collabs',
      },
    ],
  },
  modeOptions: [
    {
      id: 1,
      label: 'All',
      value: ['public', 'private'],
      isChecked: true,
      icon: 'fas fa-list',
    },
    {
      id: 2,
      label: 'Public',
      value: ['public'],
      isChecked: false,
      icon: 'fas fa-globe-americas',
    },
    {
      id: 3,
      label: 'Private',
      value: ['private'],
      isChecked: false,
      icon: 'fas fa-unlock',
    },
  ],
  selectedMode: ['public', 'private', 'org'],

  moreMenuOptions: [
    {
      label: 'Copy',
      value: 'copy',
      action: 'copyWorkspace',
      icon: 'fas fa-copy',
    },
    {
      label: 'Assign',
      value: 'assign',
      action: 'assignWorkspace',
      icon: 'fas fa-list-ul',
    },
    {
      label: 'Hide',
      value: 'hide',
      action: 'hideWorkspace',
      icon: 'fas fa-archive',
    },
    {
      label: 'Delete',
      value: 'delete',
      action: 'deleteWorkspace',
      icon: 'fas fa-trash',
    },
  ],

  adminFilter: alias('filter.primaryFilters.inputs.all'),

  primaryFilterValue: alias('primaryFilter.value'),
  doUseSearchQuery: or('isSearchingWorkspaces', 'isDisplayingSearchResults'),

  listResultsMessage: computed(
    'criteriaTooExclusive',
    'isDisplayingSearchResults',
    'workspaces.@each.isTrashed',
    'isFetchingWorkspaces',
    'showLoadingMessage',
    function () {
      let msg;
      // let userOrgName = this.userOrgName;
      if (this.isFetchingWorkspaces) {
        if (this.showLoadingMessage) {
          msg = 'Loading results... Thank you for your patience.';
        } else {
          msg = '';
        }
        return msg;
      }
      if (this.criteriaTooExclusive) {
        msg = 'No results found. Please try expanding your filter criteria.';
        return msg;
      }

      if (this.isDisplayingSearchResults) {
        let countDescriptor = 'workspaces';
        let verb;
        let criterion = this.searchCriterion;
        if (criterion === 'all') {
          verb = 'contain';
        } else {
          verb = 'contains';
        }
        let total = this.workspacesMetadata.total;
        if (total === 1) {
          countDescriptor = 'workspace';
          if (criterion === 'all') {
            verb = 'contains';
          }
        }
        let typeDescription = `whose ${criterion} ${verb}`;
        if (this.searchCriterion === 'all') {
          typeDescription = `that ${verb}`;
        }
        msg = `Based off your filter criteria, we found ${this.get(
          'workspacesMetadata.total'
        )} ${countDescriptor} ${typeDescription} "${this.searchQuery}"`;
        return msg;
      }
      msg = `${this.workspacesMetadata.total} workspaces found`;

      if (this.toggleTrashed) {
        msg = `${msg} - <strong>Displaying Trashed Workspaces</strong>`;
      }

      return msg;
    }
  ),

  init: function () {
    this.getUserOrg().then((name) => {
      this.set('userOrgName', name);
      this.configureFilter();
      this.configurePrimaryFilter();
      this.getWorkspaces();
    });
    this._super(...arguments);
  },

  getUserOrg() {
    return this.model.currentUser.organization.then((org) => {
      if (org) {
        return org.get('name');
      } else {
        this.alert.showModal(
          'warning',
          'You currently do not belong to any organization',
          'Please add or request an organization in order to get the best user experience',
          'Ok'
        );
        return 'undefined';
      }
    });
  },

  didReceiveAttrs() {
    let attributes = ['workspaces', 'organizations'];
    for (let attr of attributes) {
      let prop = this.get(attr);
      let modelAttr = this.model[attr];
      if (!isEqual(prop, modelAttr)) {
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

    let doHideOutlet = this.doHideOutlet;
    if (_.isUndefined(doHideOutlet)) {
      this.set('doHideOutlet', this.model.hideOutlet);
    }
    if (this.doHideOutlet === false) {
      this.$('#outlet').removeClass('hidden');
    }
    this._super(...arguments);
  },

  configureFilter: function () {
    let currentUserOrgName = this.userOrgName;

    let filter = {
      primaryFilters: {
        selectedValue: 'mine',
        inputs: {
          mine: {
            label: 'Mine',
            value: 'mine',
            isChecked: true,
            icon: 'fas fa-user',
            order: 1,
            secondaryFilters: {
              selectedValues: ['createdBy', 'owner'],
              inputs: {
                createdBy: {
                  label: 'Created By Me',
                  value: 'createdBy',
                  isChecked: true,
                  isApplied: true,
                  icon: 'fas fa-wrench',
                },
                owner: {
                  label: 'Owner',
                  value: 'owner',
                  isChecked: true,
                  isApplied: true,
                  icon: 'fas fa-building',
                },
              },
            },
          },
          collab: {
            label: 'Collaborator',
            value: 'collab',
            isChecked: false,
            icon: 'fas fa-users',
            order: 2,
          },
          myOrg: {
            label: 'My Org',
            value: 'myOrg',
            isChecked: false,
            icon: 'fas fa-university',
            order: 3,
          },
          everyone: {
            label: 'Public',
            value: 'everyone',
            isChecked: false,
            icon: 'fas fa-globe-americas',
            order: 4,
          },
        },
      },
    };
    let isAdmin = this.model.currentUser.isAdmin;
    let isPdadmin = this.model.currentUser.accountType === 'P';
    if (isPdadmin) {
      filter.primaryFilters.inputs.myOrg.secondaryFilters = {
        selectedValues: ['orgProblems', 'fromOrg'],
        inputs: {
          orgProblems: {
            label: `Visbile to ${currentUserOrgName}`,
            value: 'orgProblems',
            isChecked: true,
            isApplied: true,
            icon: 'fas fa-dot-circle',
          },
          fromOrg: {
            label: `${currentUserOrgName} Workspaces`,
            value: 'fromOrg',
            isChecked: true,
            isApplied: true,
            icon: 'fas fa-users',
          },
        },
      };
    }

    if (isAdmin) {
      filter.primaryFilters.inputs.mine.isChecked = false;
      delete filter.primaryFilters.inputs.myOrg;
      filter.primaryFilters.inputs.all = {
        label: 'All',
        value: 'all',
        icon: 'fas fa-infinity',
        isChecked: true,
        order: 0,
        secondaryFilters: {
          selectedValue: 'org',
          initialItems: ['org'],
          inputs: {
            org: {
              label: 'Organization',
              value: 'org',
              selectedValues: [],
              subFilters: {
                selectedValues: ['fromOrg', 'orgWorkspaces'],
                inputs: {
                  fromOrg: {
                    label: `Created or Owned by Members`,
                    value: 'fromOrg',
                    isChecked: true,
                    isApplied: true,
                    icon: 'fas fa-users',
                  },
                  orgWorkspaces: {
                    label: `Visibile to Members`,
                    value: 'orgWorkspaces',
                    isChecked: true,
                    isApplied: true,
                    icon: 'fas fa-dot-circle',
                  },
                },
              },
            },
            creator: {
              label: 'Creator',
              value: 'creator',
              selectedValues: [],
            },
            owner: {
              label: 'Owner',
              value: 'owner',
              selectedValues: [],
            },
          },
        },
      };
    }
    this.set('filter', filter);
  },

  modeFilter: computed('selectedMode', function () {
    return {
      $in: this.selectedMode,
    };
  }),

  configurePrimaryFilter() {
    let primaryFilters = this.filter.primaryFilters;
    if (this.model.currentUser.isAdmin) {
      primaryFilters.selectedValue = 'all';
      this.set('primaryFilter', primaryFilters.inputs.all);
      return;
    }
    this.set('primaryFilter', primaryFilters.inputs.mine);
  },

  buildMineFilter() {
    let filter = {};
    let userId = this.model.currentUser.id;
    let secondaryValues = this.get(
      'primaryFilter.secondaryFilters.selectedValues'
    );

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
    let userOrgId = this.model.currentUser.get('organization.id');
    let secondaryValues = this.get(
      'primaryFilter.secondaryFilters.selectedValues'
    );
    filter.$or = [];

    if (secondaryValues) {
      let includeOrgWorkspaces =
        _.indexOf(secondaryValues, 'orgProblems') !== -1;
      let includeFromOrg = _.indexOf(secondaryValues, 'fromOrg') !== -1;

      if (!includeOrgWorkspaces && !includeFromOrg) {
        this.set('criteriaTooExclusive', true);
        return;
      }

      if (includeOrgWorkspaces) {
        this.set('selectedMode', ['org']);
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
    let adminFilter = this.adminFilter;
    let currentVal = adminFilter.secondaryFilters.selectedValue;
    let selectedValues =
      adminFilter.secondaryFilters.inputs[currentVal].selectedValues;

    let isEmpty = _.isEmpty(selectedValues);

    // if empty, do nothing - means include all orgs
    if (currentVal === 'org') {
      // no org selected yet, so no filter applied yet
      if (isEmpty) {
        return {};
      }
      // recommended, fromOrg
      let secondaryValues = this.get(
        'adminFilter.secondaryFilters.inputs.org.subFilters.selectedValues'
      );

      let includeFromOrg = _.indexOf(secondaryValues, 'fromOrg') !== -1;
      let includeOrgWorkspaces =
        _.indexOf(secondaryValues, 'orgWorkspaces') !== -1;

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
        this.set('selectedMode', ['org']);
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
        filter.owner = { $in: selectedValues };
      }
      return filter;
    }
    return filter;
  },

  buildCollabFilter() {
    const utils = this.utils;
    const collabWorkspaces = this.model.currentUser.collabWorkspaces;

    let ids;
    let filter = {};

    if (utils.isNonEmptyArray(collabWorkspaces)) {
      ids = collabWorkspaces;
    }
    // user is not a collaborator for any workspaces
    if (!this.utils.isNonEmptyArray(ids)) {
      this.set('criteriaTooExclusive', true);
      return filter;
    }
    filter._id = { $in: ids };

    return filter;
  },

  buildModeFilter: function () {
    //privacy setting determined from privacy drop down on main display
    let mode = this.modeFilter;
    return {
      $in: mode,
    };
  },

  buildSortBy: function () {
    if (this.searchByRelevance) {
      return {
        sortParam: {
          score: { $meta: 'textScore' },
        },
        doCollate: false,
        byRelevance: true,
      };
    }

    let criterion = this.sortCriterion;
    if (!criterion) {
      return { title: 1, doCollate: true };
    }
    let { sortParam, doCollate } = criterion;
    return {
      sortParam,
      doCollate,
    };
  },

  buildSearchBy: function () {
    let criterion = this.searchCriterion;
    let query = this.searchQuery;
    return {
      criterion,
      query,
    };
  },

  buildFilterBy: function () {
    let primaryFilterValue = this.primaryFilterValue;
    let isPdadmin = this.model.currentUser.accountType === 'P';
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
      filterBy.mode = { $in: ['public'] };
    } else if (primaryFilterValue === 'myOrg') {
      if (isPdadmin) {
        let mode = this.modeFilter;
        filterBy.mode = mode;
      } else {
        filterBy.mode = { $in: ['org'] };
      }
    } else {
      let mode = this.modeFilter;
      filterBy.mode = mode;
    }

    return filterBy;
  },

  displayWorkspaces: computed(
    'workspaces.@each.isTrashed',
    'toggleTrashed',
    'currentUser.hiddenWorkspaces',
    function () {
      let hiddenWorkspaces = this.model.currentUser.hiddenWorkspaces;
      let workspaces = this.workspaces;
      let visibileWorkspaces = workspaces.filter((workspace) => {
        if (!hiddenWorkspaces.includes(workspace.id)) {
          return workspace;
        }
      });

      if (visibileWorkspaces) {
        if (this.toggleTrashed) {
          return visibileWorkspaces;
        } else if (this.toggleHidden) {
          // this.store.findRecord('workspace', hiddenWorkspaces[0]).then((workspaces) => {
          //   console.log(workspaces.id);
          // });
        } else {
          return visibileWorkspaces.rejectBy('isTrashed');
        }
      }
    }
  ),

  buildQueryParams: function (page, isTrashedOnly) {
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

    if (this.criteriaTooExclusive) {
      // display message or just 0 results
      this.set('workspaces', []);
      this.set('workspacesMetadata', null);
      this.set('isFetchingWorkspaces', false);
      return;
    }
    params = {
      sortBy,
      filterBy,
    };

    if (page) {
      params.page = page;
    }

    if (this.doUseSearchQuery) {
      let searchBy = this.buildSearchBy();
      params.searchBy = searchBy;
    }
    return params;
  },

  handleLoadingMessage: observer('isFetchingWorkspaces', function () {
    const that = this;
    if (!this.isFetchingWorkspaces) {
      this.set('showLoadingMessage', false);
      return;
    }
    later(function () {
      if (
        that.isDestroyed ||
        that.isDestroying ||
        !that.get('isFetchingWorkspaces')
      ) {
        return;
      }
      that.set('showLoadingMessage', true);
    }, 300);
  }),

  getWorkspaces: function (page, isTrashedOnly = false, isHiddenOnly = false) {
    this.set('isFetchingWorkspaces', true);
    let queryParams = this.buildQueryParams(page, isTrashedOnly);

    if (this.criteriaTooExclusive) {
      if (this.isFetchingWorkspaces) {
        this.set('isFetchingWorkspaces', false);
      }
      return;
    }

    this.store
      .query('workspace', queryParams)
      .then((results) => {
        this.removeMessages('workspaceLoadErrors');
        this.set('workspaces', results);
        this.set('workspacesMetadata', results.get('meta'));
        this.set('isFetchingWorkspaces', false);

        let isSearching = this.isSearchingWorkspaces;

        if (isSearching) {
          this.set('isDisplayingSearchResults', true);
          this.set('isSearchingWorkspaces', false);
        }

        if (this.searchByRelevance) {
          this.set('searchByRelevance', false);
        }

        if (this.isChangingPage) {
          this.set('isChangingPage', false);
        }

        if (isHiddenOnly) {
          console.log('getWorkspaces and isHiddenOnly is', isHiddenOnly);
        }
      })
      .catch((err) => {
        if (!this.isDestroyed && !this.isDestroying) {
          this.handleErrors(err, 'workspaceLoadErrors');
          this.set('isFetchingWorkspaces', false);
        }
      });
  },

  currentAsOf: computed(function () {
    return moment(this.since).format('H:mm');
  }),

  listFilter: 'all',

  sortDisplayList: function (list) {
    if (!list) {
      return;
    }
    // TODO: robust sorting options

    // for now just show most recently created at top
    return list.sortBy('lastModifiedDate').reverse();
  },

  displayList: computed(
    'listFilter',
    'workspaces.@each.isTrashed',
    function () {
      const filterKey = {
        all: 'allWorkspaces',
        mine: 'ownWorkspaces',
        public: 'publicWorkspaces',
      };

      const filter = this.listFilter;

      if (_.isUndefined(filter) || _.isUndefined(filterKey[filter])) {
        return this.workspaces.rejectBy('isTrashed');
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
    }
  ),

  setOwnWorkspaces: observer('workspaces.@each.isTrashed', function () {
    const currentUser = this.model.currentUser;
    const workspaces = this.workspaces.rejectBy('isTrashed');

    this.set(
      'ownWorkspaces',
      workspaces.filterBy('owner.id', this.model.currentUser.id)
    );
  }),

  setAllWorkspaces: observer('workspaces.@each.isTrashed', function () {
    this.set('allWorkspaces', this.workspaces.rejectBy('isTrashed'));
  }),

  setPublicWorkspaces: observer('workspaces.@each.isTrashed', function () {
    const workspaces = this.workspaces.rejectBy('isTrashed');
    this.set('publicWorkspaces', workspaces.filterBy('mode', 'public'));
  }),

  actions: {
    showModal: function (ws) {
      this.set('workspaceToDelete', ws);
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this workspace?',
          null,
          'Yes, delete it'
        )
        .then((result) => {
          if (result.value) {
            this.send('trashWorkspace', ws);
          }
        });
    },
    refreshList() {
      let isTrashedOnly = this.toggleTrashed;
      let isHiddenOnly = this.toggleHidden;
      this.getWorkspaces(null, isTrashedOnly, isHiddenOnly);
    },
    toggleFilter: function (key) {
      if (key === this.listFilter) {
        return;
      }
      this.set('listFilter', key);
    },
    triggerShowTrashed() {
      this.send('triggerFetch', this.toggleTrashed);
    },
    triggerShowHidden() {
      this.send('triggerFetch', this.toggleHidden);
    },
    clearSearchResults: function () {
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
    initiatePageChange: function (page) {
      this.set('isChangingPage', true);
      let isTrashedOnly = this.toggleTrashed;
      let isHiddenOnly = this.toggleHidden;
      this.getWorkspaces(page, isTrashedOnly, isHiddenOnly);
    },

    updateFilter: function (id, checked) {
      let filter = this.filter;
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
    triggerFetch(isTrashedOnly = false, isHiddenOnly = false) {
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
    setList: function () {
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
    },
  },
});
