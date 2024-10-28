import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, cancel } from '@ember/runloop';
import { htmlSafe } from '@ember/template';

/**
 * <WorkspaceListContainer
  @workspaces={{this.model.workspaces}}
  @organizations={{this.model.organizations}}
  @toCopyWorkspace={{this.toCopyWorkspace}}
/>
 */
export default class WorkspaceListContainerComponent extends Component {
  @service errorHandling;
  @service('utility-methods') utils;
  @service('sweet-alert') alert;
  @service currentUser;
  @service store;
  @service inputState;

  @tracked workspaces = this.args.workspaces || [];
  @tracked workspacesMetadata = this.args.workspaces?.meta || null;
  @tracked organizations = this.args.organizations || [];
  @tracked organizationsMetadata = this.args.organizations?.meta || null;

  @tracked showList = true;
  @tracked showGrid = false;
  @tracked toggleTrashed = false;
  @tracked toggleHidden = false;
  @tracked workspaceToDelete = null;
  @tracked primaryFilterValue = 'mine';
  @tracked primaryFilter = {};
  @tracked selectedMode = ['public', 'private', 'org'];
  @tracked listFilter = 'all';
  @tracked _isFetchingWorkspaces = false;
  @tracked showLoadingMessage = false;
  @tracked searchByRelevance = false;
  @tracked searchQuery = null;
  @tracked searchInputValue = null;
  @tracked isDisplayingSearchResults = false;
  @tracked isSearchingWorkspaces = false;
  @tracked isChangingPage = false;
  @tracked criteriaTooExclusive = null;
  @tracked filter = {};
  @tracked isFilterListCollapsed = false;

  @tracked searchCriterion = 'all';
  searchOptions = ['all', 'name', 'owner', 'collaborators'];

  @tracked sortCriterion = {
    name: 'Newest',
    sortParam: { lastModifiedDate: -1 },
    doCollate: true,
    type: 'lastModifiedDate',
  };
  sortOptions = {
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
        name: 'Z-A',
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
  };
  modeOptions = [
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
  ];

  moreMenuOptions = [
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
  ];

  constructor() {
    super(...arguments);
    this.initComponent();
    const userProperties = {
      inputId: 'all-user-filter',
      maxItems: 3,
      labelField: 'username',
      valueField: 'id',
      searchField: 'name',
      model: 'user',
      queryParamsKey: 'usernameSearch',
      isAsync: true,
      placeholder: 'Username...',
      type: 'list',
    };
    this.inputState.createStates('adminFilter', [
      {
        value: 'org',
        label: 'Organization',
        inputId: 'all-org-filter',
        options: this.orgOptions,
        maxItems: 3,
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        placeholder: 'Organization name...',
        propName: 'org',
        type: 'list',
      },
      {
        value: 'creator',
        label: 'Creator',
        propName: 'creator',
        ...userProperties,
      },
      { value: 'owner', label: 'Owner', propName: 'owner', ...userProperties },
    ]);
    this.inputState.createSubStates(
      'adminFilter',
      'org',
      [
        {
          label: `Created or Owned by Members`,
          value: 'fromOrg',
          icon: 'fas fa-users',
          default: true,
        },
        {
          label: `Visibile to Members`,
          value: 'orgWorkspaces',
          default: true,
          icon: 'fas fa-dot-circle',
        },
      ],
      { listBased: true, multiSelect: true }
    );
  }

  // Variable to hold the timer reference (handleLoadingMessages)
  loadingMessageTimer = null;

  get adminMainOptions() {
    return this.inputState.getOptions('adminFilter');
  }

  get adminMainSelection() {
    return this.inputState.getSelection('adminFilter');
  }

  @action
  handleUpdateMain(selection) {
    this.inputState.setSelection('adminFilter', selection);
  }

  get adminSubOptions() {
    return this.inputState.getSubOptions('adminFilter');
  }

  get adminSubSelections() {
    return this.inputState.getSubSelections('adminFilter');
  }

  @action
  handleUpdateSub(value, option) {
    if (Array.isArray(value)) {
      this.inputState.setListState('adminFilter', value);
    } else {
      this.inputState.setSubSelection('adminFilter', option, value);
    }
  }

  get user() {
    return this.currentUser.user;
  }

  get adminFilter() {
    return this.filter?.primaryFilters?.inputs?.all;
  }

  get primaryFilterValue() {
    return this.primaryFilter?.value;
  }

  get doUseSearchQuery() {
    return this.isSearchingWorkspaces || this.isDisplayingSearchResults;
  }

  get modeFilter() {
    return { $in: this.selectedMode };
  }
  get secondaryFilter() {
    return this.primaryFilter?.secondaryFilters ?? {};
  }
  get subFilterWhenSelections() {
    return { org: this.secondaryFilter.inputs.org.subFilters.inputs };
  }

  get secondaryFilterOptions() {
    return Object.values(this.secondaryFilter.inputs ?? {});
  }

  get primaryFilterInputs() {
    return this.filter?.primaryFilters?.inputs ?? {};
  }

  get orgOptions() {
    return (
      this.organizations?.map((org) => ({
        id: org.id,
        name: org.name,
      })) ?? []
    );
  }

  get listResultsMessage() {
    if (this.isFetchingWorkspaces) {
      return this.showLoadingMessage
        ? 'Loading results... Thank you for your patience.'
        : '';
    }

    if (this.criteriaTooExclusive) {
      return 'No results found. Please try expanding your filter criteria.';
    }

    if (this.isDisplayingSearchResults) {
      let countDescriptor = 'workspaces';
      let verb = this.searchCriterion === 'all' ? 'contain' : 'contains';
      let total = this.workspacesMetadata?.total || 0;

      if (total === 1) {
        countDescriptor = 'workspace';
        if (this.searchCriterion === 'all') {
          verb = 'contains';
        }
      }

      let typeDescription =
        this.searchCriterion === 'all'
          ? `that ${verb}`
          : `whose ${this.searchCriterion} ${verb}`;

      return `Based on your filter criteria, we found ${total} ${countDescriptor} ${typeDescription} "${this.searchQuery}"`;
    }

    let message = `${this.workspacesMetadata?.total || 0} workspaces found`;

    if (this.toggleTrashed) {
      message += ' - <strong>Displaying Trashed Workspaces</strong>';
      return htmlSafe(message);
    }

    return message;
  }

  get displayWorkspaces() {
    let hiddenWorkspaces = this.user?.hiddenWorkspaces || [];
    let visibleWorkspaces = this.workspaces.filter(
      (workspace) => !hiddenWorkspaces.includes(workspace.id)
    );

    if (this.toggleTrashed) {
      return visibleWorkspaces;
    }

    if (!this.toggleHidden) {
      return visibleWorkspaces.filter((workspace) => !workspace.isTrashed);
    }

    return [];
  }

  get currentAsOf() {
    const date = new Date(this.since);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  get ownWorkspaces() {
    const userId = this.user.id;
    return this.workspaces.filter(
      (workspace) => workspace.owner.id === userId && !workspace.isTrashed
    );
  }

  get allWorkspaces() {
    return this.workspaces.filter((workspace) => !workspace.isTrashed);
  }

  get publicWorkspaces() {
    return this.workspaces.filter(
      (workspace) => workspace.mode === 'public' && !workspace.isTrashed
    );
  }

  get isFetchingWorkspaces() {
    return this._isFetchingWorkspaces;
  }

  set isFetchingWorkspaces(value) {
    this._isFetchingWorkspaces = value;
    this.handleLoadingMessage();
  }

  @action
  initializeGrid(element) {
    const widthNum = parseInt(window.getComputedStyle(element).width, 10);
    if (widthNum <= 430) {
      this.setGrid();
    }
  }

  @action
  handleListViewClick() {
    this.isFilterListCollapsed = true;

    if (this.isFilterListCollapsed) {
      this.isArrowRotated = true;
    } else {
      this.isArrowRotated = false;
    }
  }

  @action
  handleLoadingMessage() {
    // Cancel any existing timer
    if (this.loadingMessageTimer) {
      cancel(this.loadingMessageTimer);
      this.loadingMessageTimer = null;
    }
    if (!this.isFetchingWorkspaces) {
      this.showLoadingMessage = false;
      return;
    }
    // Schedule the loading message to appear after 300ms
    this.loadingMessageTimer = later(
      this,
      () => {
        // Check if the component is still alive and fetching is still in progress
        if (
          this.isDestroyed ||
          this.isDestroying ||
          !this.isFetchingWorkspaces
        ) {
          return;
        }
        this.showLoadingMessage = true;
      },
      300
    );
  }

  @action
  showModal(ws) {
    this.workspaceToDelete = ws;
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to delete this workspace?',
        null,
        'Yes, delete it'
      )
      .then((result) => {
        if (result.value) {
          this.trashWorkspace(ws);
        }
      });
  }

  @action
  refreshList() {
    let isTrashedOnly = this.toggleTrashed;
    let isHiddenOnly = this.toggleHidden;
    this.getWorkspaces(null, isTrashedOnly, isHiddenOnly);
  }

  @action
  toggleFilter(key) {
    if (key === this.listFilter) {
      return;
    }
    this.listFilter = key;
  }

  @action
  setGrid() {
    this.showGrid = true;
    this.showList = false;
  }

  @action
  setList() {
    this.showList = true;
    this.showGrid = false;
  }

  @action
  triggerShowTrashed() {
    this.triggerFetch(this.toggleTrashed);
  }

  @action
  triggerShowHidden() {
    this.triggerFetch(this.toggleHidden);
  }

  @action
  clearSearchResults() {
    this.searchQuery = null;
    this.searchInputValue = null;
    this.isDisplayingSearchResults = false;
    this.triggerFetch();
  }

  @action
  updatePageResults(results) {
    this.workspaces = results;
  }

  @action
  searchWorkspaces(val, criterion) {
    if (criterion === 'all') {
      this.searchByRelevance = true;
    }
    this.searchQuery = val;
    this.searchCriterion = criterion;
    this.isSearchingWorkspaces = true;
    this.triggerFetch();
  }

  @action
  initiatePageChange(page) {
    this.isChangingPage = true;
    let isTrashedOnly = this.toggleTrashed;
    let isHiddenOnly = this.toggleHidden;
    this.getWorkspaces(page, isTrashedOnly, isHiddenOnly);
  }

  @action
  updateFilter(id, checked) {
    let filter = this.filter;
    let keys = Object.keys(filter);
    if (!keys.includes(id)) {
      return;
    }
    filter[id] = checked;
    this.triggerFetch();
  }

  @action
  updateSortCriterion(criterion) {
    this.sortCriterion = criterion;
    this.triggerFetch();
  }

  @action
  onUpdate(newPrimaryFilter) {
    this.primaryFilter = newPrimaryFilter;
    this.triggerFetch();
  }

  @action
  onUpdateSecondary(newSecondaryFilter) {
    this.primaryFilter.secondaryFilters.selectedValues = newSecondaryFilter;
    this.triggerFetch();
  }

  @action
  triggerFetch(isTrashedOnly = false, isHiddenOnly = false) {
    if (this.criteriaTooExclusive) {
      this.criteriaTooExclusive = null;
    }
    this.getWorkspaces(null, isTrashedOnly, isHiddenOnly);
  }

  @action
  updateMode(val) {
    if (!val) {
      return;
    }
    this.selectedMode = val;
    this.triggerFetch();
  }

  @action
  toggleMenu() {
    this.isFilterListCollapsed = !this.isFilterListCollapsed;
    // filterListSide.classList.add('animated', 'slideInLeft');
  }

  async initComponent() {
    this.userOrgName = await this.getUserOrg();
    this.configureFilter();
    this.configurePrimaryFilter();
  }

  getUserOrg() {
    return this.user.organization.then((org) => {
      if (org) {
        return org.name;
      } else {
        this.alert.showModal(
          'warning',
          'You currently do not belong to any organization',
          'Please add or request an organization in order to get the best user experience',
          'Ok',
          null
        );
        return 'undefined';
      }
    });
  }

  configureFilter() {
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

    if (this.user.accountType === 'P') {
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

    if (this.user.isAdmin) {
      filter.primaryFilters.inputs.mine.isChecked = false;
      delete filter.primaryFilters.inputs.myOrg; // OK???
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
    this.filter = filter; // OK??
  }

  configurePrimaryFilter() {
    const primaryFilters = this.filter.primaryFilters;
    if (this.user.isAdmin) {
      primaryFilters.selectedValue = 'all';
      this.primaryFilter = primaryFilters.inputs.all; // ok??
    } else {
      this.primaryFilter = primaryFilters.inputs.mine; // ok??
    }
  }

  buildQueryParams(page, isTrashedOnly) {
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
      // OK???
      this.workspaces = [];
      this.workspacesMetadata = null;
      this.isFetchingWorkspaces = false;
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
  }

  buildMineFilter() {
    let filter = {};
    let userId = this.user.id;
    let secondaryValues =
      this.primaryFilter?.secondaryFilters?.selectedValues ?? [];

    let includeCreated = secondaryValues.includes('createdBy');
    let includeOwner = secondaryValues.includes('owner');

    if (!includeCreated && !includeOwner) {
      this.criteriaTooExclusive = true;
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
  }

  buildPublicFilter() {
    return { mode: 'public' };
  }

  buildMyOrgFilter() {
    let filter = {};
    let userOrgId = this.user.organization.id;
    let secondaryValues = this.primaryFilter.secondaryFilters.selectedValues;
    filter.$or = [];

    if (secondaryValues) {
      let includeOrgWorkspaces = secondaryValues.includes('orgProblems');
      let includeFromOrg = secondaryValues.includes('fromOrg');

      if (!includeOrgWorkspaces && !includeFromOrg) {
        this.criteriaTooExclusive = true;
        return;
      }

      if (includeOrgWorkspaces) {
        this.selectedMode = ['org'];
        filter.$or.push({ organization: userOrgId });
      }

      if (includeFromOrg) {
        this.selectedMode = ['org', 'private', 'public']; //OK??
        //find all workspaces who's owner's org is same as yours
        filter.includeFromOrg = true;
      }
    } else {
      filter.mode = 'org';
      filter.$or.push({ organization: userOrgId });
    }
    return filter;
  }

  buildAllFilter() {
    let filter = {};
    let adminFilter = this.adminFilter;
    let currentVal = adminFilter.secondaryFilters.selectedValue;
    let selectedValues =
      adminFilter.secondaryFilters.inputs[currentVal].selectedValues;

    let isEmpty = selectedValues.length === 0;

    if (currentVal === 'org') {
      if (isEmpty) {
        return {};
      }

      let secondaryValues =
        adminFilter.secondaryFilters.inputs.org.subFilters.selectedValues;
      let includeFromOrg = secondaryValues.includes('fromOrg');
      let includeOrgWorkspaces = secondaryValues.includes('orgWorkspaces');

      if (!includeFromOrg && !includeOrgWorkspaces) {
        this.criteriaTooExclusive = true;
        return;
      }

      filter.all = {};
      filter.all.org = {};

      filter.all.org.organizations = selectedValues;

      // mode "org" and organization prop
      if (includeOrgWorkspaces) {
        this.selectedMode = ['org']; //ok??
      }

      if (includeFromOrg) {
        //find all workspaces who's owner's org is same as yours
        this.selectedMode = ['org', 'private', 'public']; // ok??
        filter.all.org.includeFromOrg = true;
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
  }

  buildCollabFilter() {
    const collabWorkspaces = this.user.collabWorkspaces;

    let ids;
    let filter = {};

    if (this.utils.isNonEmptyArray(collabWorkspaces)) {
      ids = collabWorkspaces;
    }

    // user is not a collaborator for any workspaces
    if (!this.utils.isNonEmptyArray(ids)) {
      this.criteriaTooExclusive = true;
      return filter;
    }
    filter._id = { $in: ids };

    return filter;
  }

  //privacy setting determined from privacy drop down on main display
  buildModeFilter() {
    return { $in: this.modeFilter };
  }

  buildSortBy() {
    if (this.searchByRelevance) {
      return {
        sortParam: {},
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
  }

  buildSearchBy() {
    let criterion = this.searchCriterion;
    let query = this.searchQuery;
    return {
      criterion,
      query,
    };
  }

  buildFilterBy() {
    let primaryFilterValue = this.primaryFilterValue;
    let isPdadmin = this.user.accountType === 'P';
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
    if (!filterBy) {
      filterBy = {};
    }

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
  }

  getWorkspaces(page, isTrashedOnly = false, isHiddenOnly = false) {
    this.isFetchingWorkspaces = true;
    let queryParams = this.buildQueryParams(page, isTrashedOnly);

    if (this.criteriaTooExclusive) {
      if (this.isFetchingWorkspaces) {
        this.isFetchingWorkspaces = false;
      }
      return;
    }

    this.store
      .query('workspace', queryParams)
      .then((results) => {
        this.removeMessages('workspaceLoadErrors');
        this.workspaces = results;
        this.workspacesMetadata = results.meta;
        this.isFetchingWorkspaces = false;

        if (this.isSearchingWorkspaces) {
          this.isDisplayingSearchResults = true;
          this.isSearchingWorkspaces = false;
        }

        if (this.searchByRelevance) {
          this.searchByRelevance = false;
        }

        if (this.isChangingPage) {
          this.isChangingPage = false;
        }

        if (isHiddenOnly) {
          console.log('getWorkspaces and isHiddenOnly is', isHiddenOnly);
        }
      })
      .catch((err) => {
        if (!this.isDestroyed && !this.isDestroying) {
          this.errorHandling.handleErrors(err, 'workspaceLoadErrors');
          this.isFetchingWorkspaces = false;
        }
      });
  }
}
