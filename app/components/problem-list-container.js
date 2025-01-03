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
  @tracked selectedStatusSetting = ['approved', 'pending', 'flagged'];
  @tracked showList = true;
  @tracked showGrid = false;
  @tracked isFilterListCollapsed = true;
  @tracked showOnlyTrashed = false;
  @tracked criteriaTooExclusive = false;
  @tracked areNoRecommendedProblems = false;
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
      this.configureCategoryFilter();
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

  get categoryFilterName() {
    return 'category-filter';
  }

  get user() {
    return this.currentUser.user;
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

    if (this.areNoRecommendedProblems) {
      return `There are currently no recommended problems for ${this.userOrgName}.`;
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
    return this.user.isTeacher
      ? this.statusOptions.filter((option) => !option.teacherHide)
      : this.statusOptions;
  }

  @action
  updateStatusFilter(status) {
    let allowedValues = this.statusOptionsList.map((option) => option.value);
    if (!allowedValues.includes(status)) {
      return;
    }

    this.selectedStatusSetting = this.selectedStatusSetting.includes(status)
      ? this.selectedStatusSetting.filter((item) => item !== status)
      : [...this.selectedStatusSetting, status];

    this.triggerFetch();
  }

  @action
  updatePrivacySetting(privacySetting) {
    this.selectedPrivacySetting = privacySetting;
    this.triggerFetch();
  }

  @action
  triggerFetch() {
    this.criteriaTooExclusive = false;
    this.areNoRecommendedProblems = false;
    this.getProblems();
  }

  @action
  refreshList() {
    this.getProblems();
  }

  @action
  triggerShowTrashed() {
    this.showOnlyTrashed = !this.showOnlyTrashed;
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
        buildFilter: () => {
          const id = this.user.id ?? null;
          return id ? { createdBy: id } : {};
        },
      },
      {
        value: 'myOrg',
        label: 'My Org',
        icon: 'fas fa-university',
        buildFilter: () => {
          const id = this.user.organization?.id ?? null;
          return id ? { organization: id } : {};
        },
      },
    ]);

    this.inputState.createSubStates(
      this.filterName,
      'myOrg',
      [
        {
          label: 'Recommended',
          value: 'recommended',
          icon: 'fas fa-star',
          default: true,
        },
        {
          label: `Created by ${this.userOrgName} Members`,
          value: 'fromOrg',
          icon: 'fas fa-users',
          default: true,
        },
      ],
      { multiSelect: true, persist: true },
      (selections = []) => {
        const includeRecommended = selections.includes('recommended');
        const includeFromOrg = selections.includes('fromOrg');

        if (!includeRecommended && !includeFromOrg) {
          this.criteriaTooExclusive = true;
          return {};
        }

        const recommendedProblems =
          this.user?.organization?.get('recommendedProblems') ?? [];
        const recommendedIds = recommendedProblems.map((p) => p.id);

        if (
          includeRecommended &&
          recommendedIds.length === 0 &&
          !includeFromOrg
        ) {
          this.areNoRecommendedProblems = true;
          return {};
        }

        const conditions = [];

        if (includeRecommended && recommendedIds.length > 0) {
          conditions.push({ id: { $in: recommendedIds } });
        }

        if (includeFromOrg && this.user?.organization?.id) {
          conditions.push({ organization: this.user.organization.id });
        }

        return conditions.length > 0 ? { $or: conditions } : {};
      }
    );
  }

  configureCategoryFilter() {
    this.inputState.createStates(this.categoryFilterName, [
      {
        value: 'categories',
        label: 'Categories',
        type: 'list',
      },
    ]);
    this.inputState.createSubStates(
      this.categoryFilterName,
      'categories',
      [
        {
          label: 'Include Subcategories',
          value: 'includeSubcats',
          default: false,
        },
      ],
      {},
      (selections = []) => {
        const selectedCategories =
          this.inputState.getListState(this.categoryFilterName) || [];
        if (selectedCategories.length === 0) {
          return {};
        }
        const ids = selectedCategories.map((cat) => cat.id);
        const includeSubCats = selections.includes('includeSubcats');
        return { categories: { ids, includeSubCats } };
      }
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
        buildFilter: () => {
          const selectedUsers =
            this.inputState.getListState(this.adminFilterName) || [];
          return { createdBy: { $in: selectedUsers } };
        },
      },
      {
        value: 'pows',
        label: 'PoWs',
        buildFilter: () => {
          return { pows: 'all' };
        },
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
      { listBased: true, multiSelect: true },
      (selections = []) => {
        const includeRecommended = selections.includes('recommended');
        const includeFromOrg = selections.includes('fromOrg');

        if (!includeRecommended && !includeFromOrg) {
          this.criteriaTooExclusive = true;
          return { all: {} };
        }

        const organizations =
          this.inputState.getListState(this.adminFilterName) || [];
        return {
          all: {
            org: {
              ...(includeRecommended && { recommended: organizations }),
              ...(includeFromOrg && { organizations }),
            },
          },
        };
      }
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
    const queryParams = {};
    if (!this.showOnlyTrashed) {
      queryParams.filterBy = this.buildFilterBy();
      queryParams.sortBy = this.buildSortBy();
    } else {
      queryParams.isTrashedOnly = true;
    }

    if (this.criteriaTooExclusive || this.areNoRecommendedProblems) {
      this.problems = [];
      this.isFetchingProblems = false;
      return;
    }

    console.log('queryParams', queryParams);

    this.store
      .query('problem', queryParams)
      .then((results) => {
        this.errorHandling.removeMessages('problemLoadErrors');
        this.problems = results || [];
        this.isFetchingProblems = false;
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'problemLoadErrors');
        this.isFetchingProblems = false;
      });
  }

  buildFilterBy() {
    if (this.selectedStatusSetting.length === 0) {
      this.criteriaTooExclusive = true;
    }
    const filter = {
      privacySetting: { $in: this.selectedPrivacySetting },
      status: { $in: this.selectedStatusSetting },
    };
    const mainFilter = this.inputState.getFilter(this.filterName); // includes admin filter
    const categoryFilter = this.inputState.getFilter(this.categoryFilterName);
    return { ...filter, ...mainFilter, ...categoryFilter };
  }

  buildSortBy() {
    return this.sortCriterion?.sortParam;
  }

  async getUserOrg() {
    const org = await this.user.organization;
    return org?.name || 'undefined';
  }
}
