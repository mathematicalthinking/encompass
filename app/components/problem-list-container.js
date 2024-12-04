import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProblemListContainerComponent extends Component {
  @service store;
  @service('sweet-alert') alert;
  @service currentUser;
  @service errorHandling;
  @service inputState;

  @tracked problems = this.args.problems || [];
  @tracked selectedPrivacySetting = ['M', 'O', 'E'];
  @tracked showList = true;
  @tracked showGrid = false;
  @tracked isFilterListCollapsed = true;
  @tracked toggleTrashed = false;
  @tracked isFetchingProblems = false;
  @tracked isDisplayingSearchResults = false;
  @tracked searchCriterion = 'general';
  @tracked searchQuery = null;
  @tracked searchOptions = ['general', 'title'];
  @tracked sortCriterion = {
    name: 'A-Z',
    sortParam: { title: 1 },
    doCollate: true,
    type: 'title',
  };

  sortOptions = {
    title: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { title: 1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'title',
      },
      {
        name: 'Z-A',
        sortParam: { title: -1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'title',
      },
    ],
    createDate: [
      { sortParam: null, icon: '' },
      {
        id: 3,
        name: 'Newest',
        sortParam: { createDate: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'date',
      },
      {
        id: 4,
        name: 'Oldest',
        sortParam: { createDate: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'date',
      },
    ],
  };

  privacySettingOptions = [
    {
      id: 1,
      label: 'All',
      value: ['M', 'O', 'E'],
      isChecked: true,
      icon: 'fas fa-list',
    },
    {
      id: 2,
      label: 'Public',
      value: ['O', 'E'],
      isChecked: false,
      icon: 'fas fa-globe-americas',
    },
    {
      id: 3,
      label: 'Private',
      value: ['M'],
      isChecked: false,
      icon: 'fas fa-unlock',
    },
  ];

  statusOptions = [
    {
      name: 'status',
      value: 'approved',
      fill: '#35A853',
      text: 'Approved',
      isChecked: true,
    },
    {
      name: 'status',
      value: 'pending',
      fill: '#FFD204',
      text: 'Pending',
      isChecked: true,
    },
    {
      name: 'status',
      value: 'flagged',
      fill: '#EB5757',
      text: 'Flagged',
      isChecked: true,
      teacherHide: true,
    },
  ];

  constructor() {
    super(...arguments);
    this.getUserOrg().then((name) => {
      this.userOrgName = name;
      this.configureFilters();
      this.configureAdminFilter();
      // this.setCategoriesFilter(this.selectedCategories);
    });
  }

  get problemLoadErrors() {
    return this.errorHandling.getErrors('problemLoadErrors') || [];
  }

  get problemsMetadata() {
    return this.problems?.meta || {};
  }

  get showAdminFilters() {
    return (
      this.user.isAdmin &&
      this.inputState.getSelectionValue(this.filterName) === 'all'
    );
  }

  get adminFilterName() {
    return 'problem-admin-filter';
  }

  get filterName() {
    return 'problem-filter';
  }

  get user() {
    return this.currentUser.user;
  }

  get displayProblems() {
    if (!this.problems) {
      return [];
    }
    return this.toggleTrashed
      ? this.problems
      : this.problems.filter((p) => !p.isTrashed);
  }

  get listResultsMessage() {
    if (this.isFetchingProblems) {
      return this.showLoadingMessage
        ? 'Loading results... Thank you for your patience.'
        : '';
    }

    if (this.criteriaTooExclusive) {
      return 'No results found. Please try expanding your filter criteria.';
    }

    if (this.isDisplayingSearchResults) {
      let total = this.problemsMetadata?.total || 0;
      let countDescriptor = total === 1 ? 'problem' : 'problems';
      let verb = this.searchCriterion === 'general' ? 'contain' : 'contains';
      return `Based on your filter criteria, we found ${total} ${countDescriptor} whose ${this.searchCriterion} ${verb} "${this.searchQuery}"`;
    }

    return `${this.problemsMetadata?.total || 0} problems found`;
  }

  get statusOptionsList() {
    return this.currentUser.isTeacher
      ? this.statusOptions.filter((option) => !option.teacherHide)
      : this.statusOptions;
  }

  @action
  updateStatusFilter(status) {
    let allowedValues = ['approved', 'pending', 'flagged'];
    if (!allowedValues.includes(status)) {
      return;
    }
    let statusFilter = this.statusFilter;

    if (statusFilter.includes(status)) {
      statusFilter.removeObject(status);
    } else {
      statusFilter.addObject(status);
    }
    this.triggerFetch();
  }

  @action
  updatePrivacySetting(privacySetting) {
    this.selectedPrivacySetting = privacySetting;
    this.triggerFetch();
  }

  @action
  triggerFetch() {
    if (this.criteriaTooExclusive) {
      this.criteriaTooExclusive = null;
    }
    this.getProblems();
  }

  @action
  refreshList() {
    this.getProblems();
  }

  @action
  triggerShowTrashed() {
    this.getProblems();
  }

  @action
  handleListViewClick() {
    this.isFilterListCollapsed = true;
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
  searchProblems(val, criterion) {
    this.searchQuery = val;
    this.searchCriterion = criterion;
    this.isDisplayingSearchResults = true;
    this.getProblems();
  }

  configureFilters() {
    this.inputState.createStates(this.filterName, [
      ...(this.currentUser.user.isAdmin
        ? [
            {
              value: 'all',
              label: 'All',
              icon: 'fas fa-infinity',
              buildFilter: () => ({}),
            },
          ]
        : []),
      {
        value: 'mine',
        label: 'Mine',
        icon: 'fas fa-user',
        buildFilter: () => {
          const id = this.currentUser.user?.id ?? null;
          return id ? { createdBy: id } : {};
        },
      },
      {
        value: 'myOrg',
        label: 'My Org',
        icon: 'fas fa-university',
        buildFilter: () => {
          const id = this.currentUser.user?.organization?.id ?? null;
          return id ? { organization: id } : {};
        },
      },
    ]);

    this.inputState.createSubStates(
      this.filterName,
      'myOrg',
      [
        {
          label: `Created by ${this.userOrgName} Members`,
          value: 'fromOrg',
          icon: 'fas fa-users',
          default: true,
        },
        {
          label: 'Recommended',
          value: 'recommended',
          icon: 'fas fa-star',
          default: true,
        },
        { label: 'Owner', value: 'owner', default: true },
      ],
      { multiSelect: true, persist: true }
    );
  }

  configureAdminFilter() {
    this.inputState.createStates(this.adminFilterName, [
      {
        value: 'org',
        label: 'Organization',
        inputId: 'all-org-filter',
        options: this.getOrgOptions(),
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
        inputId: 'creator-filter',
        maxItems: 3,
        labelField: 'username',
        valueField: 'id',
        searchField: 'name',
        placeholder: 'Username...',
        propName: 'creator',
        model: 'user',
        queryParamsKey: 'usernameSearch',
        isAsync: true,
        type: 'list',
      },
      {
        value: 'pows',
        label: 'PoWs',
      },
    ]);

    this.inputState.createSubStates(
      this.adminFilterName,
      'org',
      [
        {
          label: 'Recommended',
          value: 'recommended',
          icon: 'fas fa-star',
          default: true,
        },
        {
          label: `Created by Members`,
          value: 'fromOrg',
          icon: 'fas fa-users',
          default: true,
        },
      ],
      { listBased: true, multiSelect: true }
    );
  }

  getOrgOptions() {
    return (
      this.args.organizations?.map((org) => ({
        id: org.id,
        name: org.name,
      })) ?? []
    );
  }

  getProblems() {
    this.isFetchingProblems = true;
    let filterBy = this.buildFilterBy();
    let sortBy = this.buildSortBy();
    let queryParams = { filterBy, sortBy };

    this.store
      .query('problem', queryParams)
      .then((results) => {
        this.errorHandling.removeMessages('problemLoadErrors');
        this.problems = results;
        this.isFetchingProblems = false;
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'problemLoadErrors');
        this.isFetchingProblems = false;
      });
  }

  buildFilterBy() {
    const filter = { privacySetting: { $in: this.selectedPrivacySetting } };
    const mainFilter = this.inputState.getFilter(this.filterName);
    return { ...filter, ...mainFilter };
  }

  buildSortBy() {
    return this.sortCriterion?.sortParam;
  }

  async getUserOrg() {
    const org = await this.currentUser.user?.organization;
    return org?.name || 'undefined';
  }
}
