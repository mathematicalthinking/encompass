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

  @tracked showList = true;
  @tracked showGrid = false;
  @tracked toggleTrashed = false;
  @tracked toggleHidden = false;
  @tracked selectedMode = ['public', 'private', 'org'];
  @tracked _isFetchingWorkspaces = false;
  @tracked showLoadingMessage = false;
  @tracked searchByRelevance = false;
  @tracked searchQuery = null;
  @tracked searchInputValue = null;
  @tracked isDisplayingSearchResults = false;
  @tracked isSearchingWorkspaces = false;
  @tracked isChangingPage = false;
  @tracked criteriaTooExclusive = null;
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

  // Variable to hold the timer reference (handleLoadingMessages)
  loadingMessageTimer = null;

  constructor() {
    super(...arguments);
    this.getUserOrg().then((org) => {
      this.userOrgName = org;
      this.configureMainFilter();
      this.configureAdminFilter();
    });
  }

  get workspacesMetadata() {
    return this.workspaces?.meta || null;
  }

  get showAdminFilters() {
    return (
      this.user.isAdmin &&
      this.inputState.getSelectionValue(this.filterName) === 'all'
    );
  }

  get adminFilterName() {
    return 'workspace-admin-filter';
  }

  get filterName() {
    return 'workspace-filter';
  }

  get user() {
    return this.currentUser.user;
  }

  get doUseSearchQuery() {
    return this.isSearchingWorkspaces || this.isDisplayingSearchResults;
  }

  get modeFilter() {
    return { $in: this.selectedMode };
  }

  get orgOptions() {
    return (
      this.args.organizations?.map((org) => ({
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
    this.workspaces;
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

  get isFetchingWorkspaces() {
    return this._isFetchingWorkspaces;
  }

  set isFetchingWorkspaces(value) {
    this._isFetchingWorkspaces = value;
    this.handleLoadingMessage();
  }

  @action
  handleListViewClick() {
    this.isFilterListCollapsed = true;
  }

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
  refreshList() {
    let isTrashedOnly = this.toggleTrashed;
    let isHiddenOnly = this.toggleHidden;
    this.getWorkspaces(null, isTrashedOnly, isHiddenOnly);
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
  updateSortCriterion(criterion) {
    this.sortCriterion = criterion;
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
  }

  @action
  detectWidth(element) {
    if (element.offsetWidth <= 430) {
      this.setGrid();
    }
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

  configureMainFilter() {
    this.inputState.createStates(this.filterName, [
      ...(this.user.isAdmin
        ? [
            {
              value: 'all',
              label: 'All',
              icon: 'fas fa-infinity',
              buildFilter: () => {
                // Admin can see everything, no restrictions
                return this.inputState.getFilter(this.adminFilterName);
              },
            },
          ]
        : []),
      {
        value: 'mine',
        label: 'Mine',
        icon: 'fas fa-user',
      },
      {
        value: 'collab',
        label: 'Collaborator',
        icon: 'fas fa-users',
        buildFilter: () => {
          const collabWorkspaces = this.user.collabWorkspaces || [];
          if (!collabWorkspaces.length) {
            this.criteriaTooExclusive = true;
            return {}; // No collaborative workspaces found
          }
          return { _id: { $in: collabWorkspaces } };
        },
      },
      {
        value: 'myOrg',
        label: 'My Org',
        icon: 'fas fa-university',
        buildFilter: () => {
          const userOrgId = this.user.organization.id;
          return { organization: userOrgId };
        },
      },
    ]);

    // Substates for 'mine'
    this.inputState.createSubStates(
      this.filterName,
      'mine',
      [
        {
          label: 'Created By Me',
          value: 'createdBy',
          icon: 'fas fa-wrench',
          default: true,
        },
        {
          label: 'Owner',
          value: 'owner',
          icon: 'fas fa-building',
          default: true,
        },
      ],
      { listBased: false, multiSelect: true, persist: true },
      (selections = []) => {
        const userId = this.user.id;
        const filter = { $or: [] };
        const includeCreated = selections.includes('createdBy');
        const includeOwner = selections.includes('owner');
        if (!includeCreated && !includeOwner) {
          this.criteriaTooExclusive = true;
          return {};
        }
        if (includeCreated) {
          filter.$or.push({ createdBy: userId });
        }
        if (includeOwner) {
          filter.$or.push({ owner: userId });
        }
        return filter;
      }
    );

    // Substates for 'myOrg'
    if (this.user.accountType === 'P') {
      this.inputState.createSubStates(
        this.filterName,
        'myOrg',
        [
          {
            value: 'orgProblems',
            label: `Visible to ${this.user.organization.name}`,
            icon: 'fas fa-dot-circle',
            default: true,
          },
          {
            value: 'fromOrg',
            label: `${this.user.organization.name} Workspaces`,
            icon: 'fas fa-users',
            default: true,
          },
        ],
        { listBased: false, multiSelect: true, persist: true },
        // @TODO check this versus main selection buildFilter
        (selections = []) => {
          const userOrgId = this.user.organization.id;
          const filter = { $or: [] };
          if (selections && selections.length === 0) {
            filter.mode = 'org';
            filter.$or.push({ organization: userOrgId });
            return filter;
          }

          const includeOrgWorkspaces = selections.includes('orgProblems');
          const includeFromOrg = selections.includes('fromOrg');
          if (!includeOrgWorkspaces && !includeFromOrg) {
            this.criteriaTooExclusive = true;
            return {};
          }
          if (includeOrgWorkspaces) {
            this.selectedMode = ['org'];
            filter.$or.push({ organization: userOrgId });
          }
          if (includeFromOrg) {
            this.selectedMode = ['org', 'private', 'public']; //OK??
            filter.includeFromOrg = true;
          }
          return filter;
        }
      );
    }
  }

  configureAdminFilter() {
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

    this.inputState.createStates(this.adminFilterName, [
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
        buildFilter: () => {
          const selectedUsers =
            this.inputState.getListState(this.adminFilterName) || [];
          return { createdBy: { $in: selectedUsers } };
        },
      },
      {
        value: 'owner',
        label: 'Owner',
        propName: 'owner',
        ...userProperties,
        buildFilter: () => {
          const selectedUsers =
            this.inputState.getListState(this.adminFilterName) || [];
          return { owner: { $in: selectedUsers } };
        },
      },
    ]);

    // Substates for 'org'
    this.inputState.createSubStates(
      this.adminFilterName,
      'org',
      [
        {
          label: `Created or Owned by Members`,
          value: 'fromOrg',
          icon: 'fas fa-users',
          default: true,
        },
        {
          label: `Visible to Members`,
          value: 'orgWorkspaces',
          default: true,
          icon: 'fas fa-dot-circle',
        },
      ],
      { listBased: true, multiSelect: true },
      (selections = []) => {
        const includeFromOrg = selections.includes('fromOrg');
        const includeOrgWorkspaces = selections.includes('orgWorkspaces');

        if (!includeFromOrg && !includeOrgWorkspaces) {
          this.criteriaTooExclusive = true;
          return {};
        }

        const organizations =
          this.inputState.getListState(this.adminFilterName) || [];
        const filter = {
          all: { org: { organizations: { $in: organizations } } },
        };

        if (includeOrgWorkspaces) {
          this.selectedMode = ['org'];
        }

        if (includeFromOrg) {
          this.selectedMode = ['org', 'private', 'public'];
          filter.all.org.includeFromOrg = true;
        }
        return filter;
      }
    );
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
      this.workspaces = [];
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
    console.log('params are', params);
    return params;
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
    const filter = { mode: { $in: this.selectedMode } };
    const mainFilter = this.inputState.getFilter(this.filterName) ?? {};

    // Return the complete filter
    return { ...filter, ...mainFilter };
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
        this.errorHandling.removeMessages('workspaceLoadErrors');
        this.workspaces = results;
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
