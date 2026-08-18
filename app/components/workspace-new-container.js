import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { all } from 'rsvp';
import isArray from 'lodash-es/isArray';
import keys from 'lodash-es/keys';
import sortBy from 'lodash-es/sortBy';

/**
 * WorkspaceNewContainer Component
 *
 * Manages the creation of new workspaces through filtering and selecting submissions.
 * Users can filter submissions by various criteria, select answers, and configure workspace settings.
 *
 * @component
 * @example
 *<WorkspaceNewContainer 
    @folderSets={{@model.folderSets}} 
    @sections={{@model.sections}}
    @assignments={{@model.assignments}}
    @users={{@model.users}}
    @problems={{@model.problems}}
/>

 */
export default class WorkspaceNewContainerComponent extends Component {
  @service('sweet-alert') alert;
  @service errorHandling;
  @service currentUser;
  @service('utility-methods') utils;
  @service store;
  @service navigation;

  // UI state
  @tracked showList = true;
  @tracked showGrid = false;
  @tracked currentStep = 1; // 1 = submission viewer, 2 = workspace settings
  @tracked toggleTrashed = false;
  @tracked toggleHidden = false;

  // Filter/search state
  @tracked filterCriteria = {};
  @tracked searchQuery = null;
  @tracked searchInputValue = null;
  @tracked searchCriterion = 'all';
  @tracked isSearchingAnswers = false;
  @tracked isDisplayingSearchResults = false;
  @tracked searchByRelevance = false;

  // Answers/submission state
  @tracked answers = [];
  @tracked answersMetadata = null;
  @tracked selectedAnswers = [];
  @tracked isFetchingAnswers = false;
  @tracked isRequestTooLarge = false;
  @tracked isChangingPage = false;
  @tracked criteriaTooExclusive = false;
  @tracked isEmptyAnswerSet = false;
  @tracked showLoadingMessage = true;
  @tracked isRequestInProgress = false;
  @tracked createWorkspaceError = null;
  @tracked userOrgName = null;
  @tracked doHideOutlet = null;

  // Sort/revision options
  @tracked selectedRevisionOption = 'Newest Only';
  @tracked sortCriterion = {
    name: 'A-Z',
    sortParam: { student: 1 },
    doCollate: true,
    type: 'student',
  };

  // Selection filters
  @tracked selectedFolderSet = null;
  @tracked selectedAssignment = null;
  @tracked selectedSection = null;
  @tracked selectedProblem = null;
  @tracked selectedTeacher = null;
  @tracked selectedStudents = [];
  @tracked startDate = null;
  @tracked endDate = null;

  // Configuration constants
  sortOptions = {
    student: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { student: 1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'student',
      },
      {
        name: 'Z-A',
        sortParam: { student: -1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'student',
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
        type: 'createDate',
      },
      {
        id: 4,
        name: 'Oldest',
        sortParam: { createDate: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'createDate',
      },
    ],
    revisions: [
      { sortParam: null, icon: '' },
      {
        name: 'Most',
        sortParam: { revisions: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'revisions',
      },
      {
        name: 'Fewest',
        sortParam: { revisions: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'revisions',
      },
    ],
    explanation: [
      { sortParam: null, icon: '' },
      {
        name: 'Longest',
        sortParam: { explanation: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'explanation',
      },
      {
        name: 'Shortest',
        sortParam: { explanation: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'explanation',
      },
    ],
    section: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { section: 1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'section',
      },
      {
        name: 'Z-A',
        sortParam: { section: -1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'section',
      },
    ],
  };

  revisionsSelectOptions = ['All Revisions', 'Newest Only'];

  moreMenuOptions = [
    {
      label: 'Public',
      value: 'assign',
      action: 'addAnswer',
      icon: 'fas fa-list-ul',
    },
    {
      label: 'Delete',
      value: 'delete',
      action: 'deleteAnswer',
      icon: 'fas fa-trash',
    },
  ];

  maximumAnswers = 1000;

  constructor() {
    super(...arguments);
    this.initializeComponent();
  }

  /**
   * Initialize component state on creation
   */
  @action
  initializeComponent() {
    this.getUserOrg().then((name) => {
      this.userOrgName = name;
    });

    if (this.currentUser.isTeacher) {
      this.selectedTeacher = this.currentUser.user;
    }

    if (this.args.doHideOutlet === undefined) {
      this.doHideOutlet = this.args.model?.hideOutlet ?? false;
    } else {
      this.doHideOutlet = this.args.doHideOutlet;
    }
  }

  /**
   * Get user's organization name
   */
  async getUserOrg() {
    try {
      const org = await this.currentUser.user.organization;
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
    } catch (error) {
      console.error('Error getting user organization:', error);
      return 'undefined';
    }
  }

  // ========== COMPUTED GETTERS ==========

  get showSubmissionViewer() {
    return this.currentStep === 1;
  }

  get showWorkspaceSettingsMenu() {
    return this.currentStep === 2;
  }

  get doIncludeRevisions() {
    return this.selectedRevisionOption === 'All Revisions';
  }

  get doUseSearchQuery() {
    return this.isSearchingAnswers || this.isDisplayingSearchResults;
  }

  get tooLargeRequestErrorMessage() {
    if (!this.isRequestTooLarge) {
      return null;
    }
    const requestedCount = this.answersMetadata?.total ?? 0;
    return `Your filter criteria matches ${requestedCount} submissions. At this time we do not support new workspaces with greater than ${this.maximumAnswers} submissions. Please try modifying your criteria.`;
  }

  get confirmLargeRequestMessage() {
    const requestedCount = this.answersMetadata?.total ?? 0;
    return `Your filter criteria matches ${requestedCount} submissions. Are you sure you want to proceed with viewing the submissions?`;
  }

  get listResultsMessage() {
    if (this.isFetchingAnswers) {
      return this.showLoadingMessage
        ? 'Loading results... Thank you for your patience.'
        : '';
    }

    if (this.criteriaTooExclusive) {
      return 'No results found. Please try expanding your filter criteria.';
    }

    if (this.isDisplayingSearchResults) {
      const total = this.answersMetadata?.total ?? 0;
      const countDescriptor = total === 1 ? 'submission' : 'submissions';
      const criterion = this.searchCriterion;
      const verb =
        criterion === 'all'
          ? total === 1
            ? 'contains'
            : 'contain'
          : 'contains';
      const typeDescription =
        criterion === 'all' ? `that ${verb}` : `whose ${criterion} ${verb}`;

      return `Based off your filter criteria, we found ${total} ${countDescriptor} ${typeDescription} "${this.searchQuery}"`;
    }

    let msg = `${this.answersMetadata?.total ?? 0} submissions found`;
    if (this.toggleTrashed) {
      msg = `${msg} - <strong>Displaying Trashed Submissions</strong>`;
    }

    return msg;
  }

  get filteredAnswers() {
    if (!this.answers) {
      return [];
    }
    return this.answers.filterBy('isTrashed', this.toggleTrashed);
  }

  get displayAnswers() {
    const answers = this.filteredAnswers;
    if (!answers) {
      return [];
    }

    if (this.doIncludeRevisions) {
      return answers;
    }

    // Show only most recent revisions
    const threads = this.submissionThreads;
    if (threads) {
      const results = [];
      Object.keys(threads).forEach((thread) => {
        const threadAnswers = threads[thread];
        if (threadAnswers && threadAnswers.length > 0) {
          results.push(threadAnswers[threadAnswers.length - 1]);
        }
      });
      return results;
    }

    return [];
  }

  get submissionThreads() {
    if (!this.filteredAnswers) {
      return {};
    }

    const threads = {};
    const students = [...new Set(this.filteredAnswers.mapBy('student'))].sort();

    students.forEach((student) => {
      if (!threads[student]) {
        threads[student] = this.studentWork(student);
      }
    });

    return threads;
  }

  get sortedAnswers() {
    const sortParam = this.sortCriterion?.sortParam;
    const defaultSorted = this.displayAnswers;

    if (!sortParam) {
      return defaultSorted;
    }

    const field = keys(sortParam)[0];
    const direction = sortParam[field];

    if (field === 'explanation') {
      const ascending = defaultSorted.sort((a, b) => {
        const lenA = (a.explanation || '').length;
        const lenB = (b.explanation || '').length;
        return lenA - lenB;
      });
      return direction === 1 ? ascending : ascending.reverse();
    }

    if (field === 'createDate') {
      const ascending = defaultSorted.sort(
        (a, b) => new Date(a.createDate) - new Date(b.createDate)
      );
      return direction === 1 ? ascending : ascending.reverse();
    }

    if (field === 'revisions') {
      const ascending = sortBy(defaultSorted, (answer) => {
        const student = answer.student;
        const threadAnswers = this.submissionThreads[student];
        return threadAnswers ? threadAnswers.length : 0;
      });
      return direction === 1 ? ascending : ascending.reverse();
    }

    if (field === 'student') {
      const ascending = defaultSorted.sort((a, b) =>
        (a.student || '').localeCompare(b.student || '')
      );
      return direction === 1 ? ascending : ascending.reverse();
    }

    return defaultSorted;
  }

  // ========== HELPER METHODS ==========

  /**
   * Get all submissions from a specific student
   */
  studentWork(student) {
    if (!this.answers) {
      return [];
    }
    return this.answers.filterBy('student', student).sortBy('createDate');
  }

  /**
   * Get most recent submission from each student
   */
  getMostRecentAnswers(answers) {
    if (!isArray(answers) || answers.length === 0) {
      return [];
    }

    const threads = {};
    const students = [...new Set(answers.mapBy('student'))];

    students.forEach((student) => {
      const studentAnswers = answers
        .filterBy('student', student)
        .sortBy('createDate');
      if (studentAnswers.length > 0) {
        threads[student] = studentAnswers[studentAnswers.length - 1];
      }
    });

    return Object.values(threads);
  }

  /**
   * Build search parameters from current search state
   */
  buildSearchBy() {
    return {
      criterion: this.searchCriterion,
      query: this.searchQuery,
    };
  }

  /**
   * Build query params for fetching answers
   */
  buildQueryParams(page, isTrashedOnly, didConfirmLargeRequest) {
    const params = {};

    if (isTrashedOnly) {
      params.isTrashedOnly = true;
      return params;
    }

    if (this.criteriaTooExclusive) {
      this.answers = [];
      this.answersMetadata = null;
      this.isFetchingAnswers = false;
      return params;
    }

    const filterBy = this.filterCriteria;
    params.filterBy = filterBy;
    params.didConfirmLargeRequest = didConfirmLargeRequest;

    if (page) {
      params.page = page;
    }

    if (this.doUseSearchQuery) {
      params.searchBy = this.buildSearchBy();
    }

    return params;
  }

  /**
   * Fetch answers from store based on current filters
   */
  @action
  async getAnswers(
    page = null,
    isTrashedOnly = false,
    isHiddenOnly = false,
    didConfirmLargeRequest = false
  ) {
    this.isFetchingAnswers = true;
    this.selectedAnswers = [];

    try {
      if (this.criteriaTooExclusive) {
        this.isFetchingAnswers = false;
        return;
      }

      const queryParams = this.buildQueryParams(
        page,
        isTrashedOnly,
        didConfirmLargeRequest
      );
      const results = await this.store.query('answer', queryParams);

      this.errorHandling.removeMessages('answerLoadErrors');
      this.answers = results;
      this.answersMetadata = results.meta;

      if (this.isSearchingAnswers) {
        this.isDisplayingSearchResults = true;
        this.isSearchingAnswers = false;
      }

      if (this.searchByRelevance) {
        this.searchByRelevance = false;
      }

      if (this.isChangingPage) {
        this.isChangingPage = false;
      }

      // Check for too many answers
      if (results.meta?.areTooManyAnswers) {
        this.isRequestTooLarge = true;
        this.isFetchingAnswers = false;
        return;
      }

      // Check if need to confirm large request
      if (results.meta?.doConfirmCriteria) {
        this.isFetchingAnswers = false;
        const result = await this.alert.showModal(
          'warning',
          this.confirmLargeRequestMessage,
          '',
          'Proceed'
        );
        if (result.value) {
          this.getAnswers(null, isTrashedOnly, isHiddenOnly, true);
        }
        return;
      }

      this.isFetchingAnswers = false;
    } catch (err) {
      this.isFetchingAnswers = false;
      this.errorHandling.handleErrors(err, 'answerLoadErrors');
    }
  }

  // ========== ACTIONS ==========

  @action
  setFilterCriteria(criteria) {
    if (this.utils.isNonEmptyObject(criteria)) {
      this.filterCriteria = criteria;
      this.triggerFetch();
    }
  }

  @action
  triggerFetch(
    isTrashedOnly = false,
    isHiddenOnly = false,
    didConfirmLargeRequest = false
  ) {
    if (this.criteriaTooExclusive) {
      this.criteriaTooExclusive = null;
    }

    this.getAnswers(null, isTrashedOnly, isHiddenOnly, didConfirmLargeRequest);
  }

  @action
  refreshList() {
    const isTrashedOnly = this.toggleTrashed;
    const isHiddenOnly = this.toggleHidden;
    this.getAnswers(null, isTrashedOnly, isHiddenOnly);
  }

  @action
  triggerShowTrashed() {
    this.triggerFetch(this.toggleTrashed);
  }

  @action
  triggerShowHidden() {
    this.triggerFetch(this.toggleTrashed, this.toggleHidden);
  }

  @action
  clearSearchResults() {
    this.searchQuery = null;
    this.searchInputValue = null;
    this.isDisplayingSearchResults = false;
    this.triggerFetch();
  }

  @action
  searchAnswers(val, criterion) {
    if (criterion === 'all') {
      this.searchByRelevance = true;
    }
    this.searchQuery = val;
    this.searchCriterion = criterion;
    this.isSearchingAnswers = true;
    this.triggerFetch();
  }

  @action
  initiatePageChange(page) {
    this.isChangingPage = true;
    const isTrashedOnly = this.toggleTrashed;
    const isHiddenOnly = this.toggleHidden;
    this.getAnswers(page, isTrashedOnly, isHiddenOnly);
  }

  @action
  updateSortCriterion(criterion) {
    this.sortCriterion = criterion;
  }

  @action
  updateSelectedAnswers(answer, isChecked) {
    if (!answer) {
      return;
    }

    const isShowingRevisions = this.doIncludeRevisions;

    if (isChecked === true) {
      if (isShowingRevisions) {
        this.selectedAnswers = this.selectedAnswers.filter((a) => a !== answer);
        return;
      }

      const student = answer.student;
      const revisions = this.submissionThreads[student];
      this.selectedAnswers = this.selectedAnswers.filter(
        (a) => !revisions.includes(a)
      );
    }

    if (isChecked === false) {
      if (isShowingRevisions) {
        this.selectedAnswers = [...this.selectedAnswers, answer];
        return;
      }

      const student = answer.student;
      const revisions = this.submissionThreads[student];
      this.selectedAnswers = [...this.selectedAnswers, ...revisions];
    }
  }

  @action
  toggleCheckAllAnswers(e) {
    const isChecked = e.target.checked;
    const answers = this.filteredAnswers;

    if (!this.utils.isNonEmptyArray(answers)) {
      return;
    }

    if (isChecked === false) {
      this.selectedAnswers = [];
    } else if (isChecked === true) {
      this.selectedAnswers = [...answers];
    }
  }

  @action
  toSettingsConfig() {
    const answers = this.selectedAnswers;
    if (!this.utils.isNonEmptyArray(answers)) {
      return;
    }
    this.currentStep = 2;
  }

  @action
  toSearchFilter() {
    if (this.createWorkspaceError) {
      this.createWorkspaceError = null;
    }
    this.currentStep = 1;
  }

  @action
  async createWorkspace(settings) {
    if (this.createWorkspaceError) {
      this.createWorkspaceError = null;
    }

    const answers = this.selectedAnswers;

    if (
      !this.utils.isNonEmptyObject(settings) ||
      !this.utils.isNonEmptyArray(answers)
    ) {
      return;
    }

    const {
      requestedName,
      owner,
      mode,
      folderSet,
      permissionObjects,
      submissionSettings,
    } = settings;

    // Process permission objects
    if (this.utils.isNonEmptyArray(permissionObjects)) {
      permissionObjects.forEach((obj) => {
        if (obj.user && typeof obj.user.id === 'string') {
          obj.user = obj.user.id;
        }
      });
    }

    // Get most recent answers if needed
    let finalAnswers = answers;
    if (submissionSettings === 'mostRecent') {
      finalAnswers = this.getMostRecentAnswers(answers);
    }

    const criteria = {
      answers: finalAnswers,
      requestedName,
      owner,
      mode,
      folderSet,
      permissionObjects,
      createdBy: this.currentUser.user,
    };

    const encWorkspaceRequest = this.store.createRecord(
      'encWorkspaceRequest',
      criteria
    );
    this.isRequestInProgress = true;

    try {
      const res = await encWorkspaceRequest.save();

      this.isRequestInProgress = false;

      if (res.isEmptyAnswerSet) {
        this.isEmptyAnswerSet = true;
        return;
      }

      if (res.createWorkspaceError) {
        this.createWorkspaceError = res.createWorkspaceError;
        return;
      }

      this.alert.showToast(
        'success',
        'Workspace Created',
        'bottom-end',
        3000,
        false,
        null
      );

      const workspaceId = res.createdWorkspace?.id;
      this.navigation.toWorkspaces(workspaceId);
    } catch (err) {
      this.isRequestInProgress = false;
      this.errorHandling.handleErrors(
        err,
        'wsRequestErrors',
        encWorkspaceRequest
      );
    }
  }

  @action
  async restoreAllSelected() {
    const selectedAnswers = this.selectedAnswers;
    if (!Array.isArray(selectedAnswers) || selectedAnswers.length === 0) {
      return;
    }

    const count = selectedAnswers.length;
    const noun = count === 1 ? 'submission' : 'submissions';
    const modifier = count === 1 ? 'This' : 'These';

    const result = await this.alert.showModal(
      'warning',
      `Are you sure you want to restore ${count} ${noun}?`,
      `${modifier} ${noun} will be searchable by other users`,
      'Yes'
    );

    if (!result.value) {
      return;
    }

    try {
      await all(
        selectedAnswers.map((answer) => {
          answer.isTrashed = false;
          return answer.save();
        })
      );

      this.alert.showToast(
        'success',
        `${count} ${noun} Restored`,
        'bottom-end',
        3000,
        false,
        null
      );

      this.selectedAnswers = [];
    } catch {
      this.alert.showToast(
        'error',
        'Sorry, an error occurred',
        'bottom-end',
        3000,
        false,
        null
      );
    }
  }

  @action
  showModal(answer) {
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to delete this submission?',
        null,
        'Yes, delete it'
      )
      .then((result) => {
        if (result.value) {
          this.trashAnswer(answer);
        }
      });
  }

  @action
  trashAnswer(answer) {
    if (!answer) {
      return;
    }
    answer.isTrashed = true;
    answer.save().catch((err) => {
      this.errorHandling.handleErrors(err, 'answerDeleteErrors');
    });
  }

  @action
  toggleIncludeRevisions() {
    this.selectedRevisionOption =
      this.selectedRevisionOption === 'All Revisions'
        ? 'Newest Only'
        : 'All Revisions';
  }

  @action
  updateRevisionOption(value) {
    this.selectedRevisionOption = value;
  }

  @action
  toggleMenu() {
    const filterListElement = document.getElementById('filter-list-side');
    const arrowElement = document.getElementById('arrow-icon');

    if (filterListElement && arrowElement) {
      filterListElement.classList.toggle('collapse');
      arrowElement.classList.toggle('fa-rotate-180');
      filterListElement.classList.add('animated', 'slideInLeft');
    }
  }
}
