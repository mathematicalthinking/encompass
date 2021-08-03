import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { alias, or } from '@ember/object/computed';
/*global _:false */
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import $ from 'jquery';
import _ from 'underscore';
// import CategoriesListMixin from '../mixins/categories_list_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(
  // CategoriesListMixin,
  ErrorHandlingMixin,
  {
    tagName: 'div',
    selectedCategories: alias('application.selectedCategories'),
    elementId: 'problem-list-container',
    showList: true,
    menuClosed: true,
    toggleTrashed: false,
    searchOptions: () => ['general', 'title'],
    searchCriterion: 'general',
    sortCriterion: () => ({
      name: 'A-Z',
      sortParam: { title: 1 },
      doCollate: true,
      type: 'title',
    }),
    sortOptions: () => ({
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
    }),
    privacySettingOptions: () => [
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
    ],
    adminFilterSelect: () => ({
      defaultValue: ['organization'],
      options: [
        { label: 'organization' },
        { label: 'creator' },
        // { label: 'author'}
      ],
    }),
    statusOptions: () => [
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
    ],
    moreMenuOptions: () => [
      {
        label: 'Edit',
        value: 'edit',
        action: 'editProblem',
        icon: 'far fa-edit',
      },
      {
        label: 'Assign',
        value: 'assign',
        action: 'assignProblem',
        icon: 'fas fa-list-ul',
      },
      // {label: 'Recommend', value: 'recommend', action: 'recommendedProblem', icon: 'fas fa-star'},
      {
        label: 'Pending',
        value: 'pending',
        action: 'makePending',
        icon: 'far fa-clock',
        adminOnly: true,
      },
      {
        label: 'Report',
        value: 'flag',
        action: 'reportProblem',
        icon: 'fas fa-exclamation-circle',
      },
      {
        label: 'Delete',
        value: 'delete',
        action: 'deleteProblem',
        icon: 'fas fa-trash',
      },
    ],
    statusFilter: () => ['approved', 'pending', 'flagged'],
    showCategoryList: false,
    primaryFilterValue: alias('primaryFilter.value'),
    doUseSearchQuery: or('isSearchingProblems', 'isDisplayingSearchResults'),
    selectedPrivacySetting: () => ['M', 'O', 'E'],
    doIncludeSubCategories: true,
    adminFilter: alias('filter.primaryFilters.inputs.all'),
    alert: service('sweet-alert'),

    listResultsMessage: computed(
      'areNoRecommendedProblems',
      'criteriaTooExclusive',
      'isDisplayingSearchResults',
      'isFetchingProblems',
      'problems.@each.isTrashed',
      'problemsMetadata.total',
      'searchCriterion',
      'searchQuery',
      'showLoadingMessage',
      'toggleTrashed',
      'userOrgName',
      function () {
        let msg;
        let userOrgName = this.userOrgName;
        if (this.isFetchingProblems) {
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
        if (this.areNoRecommendedProblems) {
          msg = `There are currently no recommended problems for ${userOrgName}.`;
          return msg;
        }
        if (this.isDisplayingSearchResults) {
          let countDescriptor = 'problems';
          let verb;
          let criterion = this.searchCriterion;
          if (criterion === 'general') {
            verb = 'contain';
          } else {
            verb = 'contains';
          }
          let total = this.problemsMetadata.total;
          if (total === 1) {
            countDescriptor = 'problem';
            if (criterion === 'general') {
              verb = 'contains';
            }
          }
          let typeDescription = `whose ${criterion} ${verb}`;
          if (this.searchCriterion === 'general') {
            typeDescription = `that ${verb}`;
          }
          msg = `Based off your filter criteria, we found ${this.problemsMetadata.total} ${countDescriptor} ${typeDescription} "${this.searchQuery}"`;
          return msg;
        }

        msg = `${this.problemsMetadata.total} problems found`;

        let toggleTrashed = this.toggleTrashed;

        if (this.toggleTrashed) {
          msg = `${msg} - <strong>Displaying Trashed Problems</strong>`;
        }
        return msg;
      }
    ),

    privacySettingFilter: computed('selectedPrivacySetting', function () {
      return {
        $in: this.selectedPrivacySetting,
      };
    }),

    observeCategoryFilter: observer('categoriesFilter.[]', function () {
      this.set('categoriesFilter', this.selectedCategories);
      this.send('triggerFetch');
    }),

    init: function () {
      this.getUserOrg().then((name) => {
        this.set('userOrgName', name);
        this.configureFilter();
        this.configurePrimaryFilter();
        this.set('categoriesFilter', this.selectedCategories);
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

    statusOptionsList: computed(
      'model.currentUser.isTeacher',
      'problem.status',
      'statusOptions',
      function () {
        let statusOptions = this.statusOptions;
        let isTeacher = this.model.currentUser.isTeacher;

        if (isTeacher) {
          statusOptions = _.filter(statusOptions, (option) => {
            return !option.teacherHide;
          });
        }

        return statusOptions;
      }
    ),

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

    didReceiveAttrs: function () {
      this._super();
      let attributes = ['problems', 'sections', 'organizations'];

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
            },
            myOrg: {
              label: 'My Org',
              value: 'myOrg',
              isChecked: false,
              icon: 'fas fa-university',
              secondaryFilters: {
                selectedValues: ['recommended', 'fromOrg'],
                inputs: {
                  recommended: {
                    label: 'Recommended',
                    value: 'recommended',
                    isChecked: true,
                    isApplied: true,
                    icon: 'fas fa-star',
                  },
                  fromOrg: {
                    label: `Created by ${currentUserOrgName} Members`,
                    value: 'fromOrg',
                    isChecked: true,
                    isApplied: true,
                    icon: 'fas fa-users',
                  },
                },
              },
            },
            everyone: {
              label: 'Public',
              value: 'everyone',
              isChecked: false,
              icon: 'fas fa-globe-americas',
            },
          },
        },
      };
      let isAdmin = this.model.currentUser.isAdmin;

      if (isAdmin) {
        filter.primaryFilters.inputs.mine.isChecked = false;
        filter.primaryFilters.inputs.all = {
          label: 'All',
          value: 'all',
          icon: 'fas fa-infinity',
          isChecked: true,
          secondaryFilters: {
            selectedValue: 'org',
            initialItems: ['org'],
            inputs: {
              org: {
                label: 'Organization',
                value: 'org',
                selectedValues: [],
                subFilters: {
                  selectedValues: ['recommended', 'fromOrg'],
                  inputs: {
                    recommended: {
                      label: 'Recommended',
                      value: 'recommended',
                      isChecked: true,
                      isApplied: true,
                      icon: 'fas fa-star',
                    },
                    fromOrg: {
                      label: `Created by Members`,
                      value: 'fromOrg',
                      isChecked: true,
                      isApplied: true,
                      icon: 'fas fa-users',
                    },
                  },
                },
              },
              creator: {
                label: 'Creator',
                value: 'creator',
                selectedValues: [],
              },
              // author: {
              //   label: "Author",
              //   value: "author",
              //   selectedValues: []
              // },
              pows: {
                label: 'PoWs',
                value: 'pows',
                selectedValues: ['shared', 'unshared'],
                secondaryFilters: {
                  selectedValues: ['shared', 'unshared'],
                  inputs: {
                    unshared: {
                      label: 'Private',
                      value: 'unshared',
                      isChecked: true,
                      isApplied: true,
                      icon: 'fas fa-unlock',
                    },
                    shared: {
                      label: 'Public',
                      value: 'shared',
                      isChecked: true,
                      isApplied: true,
                      icon: 'fas fa-globe-americas',
                    },
                  },
                },
              },
            },
          },
        };
      }
      this.set('filter', filter);
    },
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

      filter.createdBy = userId;

      return filter;
    },
    buildPublicFilter() {
      let filter = {};

      filter.privacySetting = 'E';

      return filter;
    },

    buildMyOrgFilter() {
      let filter = {};

      // 2 options : recommended, fromOrg
      let secondaryValues = this.primaryFilter.secondaryFilters.selectedValues;

      let includeRecommended = _.indexOf(secondaryValues, 'recommended') !== -1;
      let includeFromOrg = _.indexOf(secondaryValues, 'fromOrg') !== -1;

      // immediately return 0 results
      if (!includeRecommended && !includeFromOrg) {
        this.set('criteriaTooExclusive', true);
        return;
      }

      filter.$or = [];

      if (includeRecommended) {
        let recommendedProblems =
          this.model.currentUser.organization.recommendedProblems || [];
        let ids = recommendedProblems.mapBy('id');

        if (!_.isEmpty(ids)) {
          filter.$or.push({ _id: { $in: ids } });
        } else {
          if (!includeFromOrg) {
            // rec only request, but no recs; immediately return nothing;
            this.set('areNoRecommendedProblems', true);
            this.set('problems', []);
            this.set('problemsMetadata', null);
            return;
          }
        }
      }

      if (includeFromOrg) {
        filter.$or.push({
          organization: this.model.currentUser.organization.id,
        });
      }

      return filter;
    },
    // eslint-disable-next-line complexity
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

        let includeRecommended =
          _.indexOf(secondaryValues, 'recommended') !== -1;
        let includeFromOrg = _.indexOf(secondaryValues, 'fromOrg') !== -1;

        // immediately return 0 results
        if (!includeRecommended && !includeFromOrg) {
          this.set('criteriaTooExclusive', true);
          return;
        }
        filter.all = {};
        filter.all.org = {};

        //fromOrg only
        if (includeFromOrg && !includeRecommended) {
          filter.all.org.organizations = selectedValues;
        }
        // recommendedOnly
        if (includeRecommended && !includeFromOrg) {
          filter.all.org.recommended = selectedValues;
        }

        if (includeRecommended && includeFromOrg) {
          filter.all.org.organizations = selectedValues;
          filter.all.org.recommended = selectedValues;
        }
      }

      if (currentVal === 'creator') {
        if (!isEmpty) {
          filter.createdBy = { $in: selectedValues };
        }
      }

      if (currentVal === 'author') {
        if (!isEmpty) {
          filter.author = { $in: selectedValues };
        }
      }
      if (currentVal === 'pows') {
        // public box is checked
        let doShared = _.indexOf(selectedValues, 'shared') !== -1;

        // private box is checked
        let doUnshared = _.indexOf(selectedValues, 'unshared') !== -1;

        if (doShared && doUnshared) {
          filter.pows = 'all';
        }

        if (_.isEmpty(selectedValues)) {
          // should this immediately return no results?
          this.set('criteriaTooExclusive', true);
          return;
          // filter.pows="none";
        }
        if (doShared && !doUnshared) {
          filter.pows = 'publicOnly';
        }
        if (!doShared && doUnshared) {
          filter.pows = 'privateOnly';
        }

        // otherwise both checked, no restrictions
        // should this only show PoWs problems? currently showing all
      }

      return filter;
    },

    buildPrivacySettingFilter: function () {
      //privacy setting determined from privacy drop down on main display
      let privacySetting = this.privacySettingFilter;
      return {
        $in: privacySetting,
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
      let filterBy;

      if (primaryFilterValue === 'mine') {
        filterBy = this.buildMineFilter();
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
        filterBy.privacySetting = { $in: ['E'] };
      } else {
        let privacySetting = this.privacySettingFilter;
        filterBy.privacySetting = privacySetting;
      }
      let categoriesFilter = this.categoriesFilter;

      if (!_.isEmpty(categoriesFilter)) {
        let filterType = 'or';
        let includeSubCats = this.doIncludeSubCategories;
        let ids = categoriesFilter.mapBy('id');
        filterBy.categories = {};

        if (filterType === 'or') {
          filterBy.categories.ids = ids;
          filterBy.categories.includeSubCats = includeSubCats;
        } else if (filterType === 'and') {
          // todo and filter
        }
      }

      let statusFilter = this.statusFilter;
      if (!_.isEmpty(statusFilter)) {
        filterBy.status = { $in: statusFilter };
      } else {
        this.set('criteriaTooExclusive', true);
        return;
      }
      return filterBy;
    },

    displayProblems: computed(
      'problems.@each.isTrashed',
      'toggleTrashed',
      function () {
        let problems = this.problems;
        if (problems) {
          if (this.toggleTrashed) {
            return problems;
          } else {
            return problems.rejectBy('isTrashed');
          }
        }
        return;
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

      if (this.criteriaTooExclusive || this.areNoRecommendedProblems) {
        // display message or just 0 results
        this.set('problems', []);
        this.set('problemsMetadata', null);
        this.set('isFetchingProblems', false);
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
    handleLoadingMessage: observer('isFetchingProblems', function () {
      const that = this;
      if (!this.isFetchingProblems) {
        this.set('showLoadingMessage', false);
        return;
      }
      later(function () {
        if (
          that.isDestroyed ||
          that.isDestroying ||
          !that.get('isFetchingProblems')
        ) {
          return;
        }
        that.set('showLoadingMessage', true);
      }, 300);
    }),

    getProblems: function (page, isTrashedOnly = false) {
      this.set('isFetchingProblems', true);
      let queryParams = this.buildQueryParams(page, isTrashedOnly);

      if (this.criteriaTooExclusive || this.areNoRecommendedProblems) {
        if (this.isFetchingProblems) {
          this.set('isFetchingProblems', false);
        }
        return;
      }

      this.store
        .query('problem', queryParams)
        .then((results) => {
          this.removeMessages('problemLoadErrors');
          this.set('problems', results);
          this.set('problemsMetadata', results.get('meta'));
          this.set('isFetchingProblems', false);

          let isSearching = this.isSearchingProblems;

          if (isSearching) {
            this.set('isDisplayingSearchResults', true);
            this.set('isSearchingProblems', false);
          }

          if (this.searchByRelevance) {
            this.set('searchByRelevance', false);
          }

          if (this.isChangingPage) {
            this.set('isChangingPage', false);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'problemLoadErrors');
          this.set('isFetchingProblems', false);
        });
    },

    actions: {
      clearSearchResults: function () {
        this.set('searchQuery', null);
        this.set('searchInputValue', null);
        this.set('isDisplayingSearchResults', false);
        this.send('triggerFetch');
      },
      updatePageResults(results) {
        this.set('problems', results);
      },
      refreshList() {
        let isTrashedOnly = this.toggleTrashed;
        // $('.refresh-icon').addClass('fa-spin');
        // Ember.run.later(() => {
        //   $('.refresh-icon').removeClass('fa-spin');
        // }, 2000);
        this.getProblems(null, isTrashedOnly);
      },
      searchProblems(val, criterion) {
        if (criterion === 'general' || criterion === 'category') {
          this.set('searchByRelevance', true);
        }
        this.set('searchQuery', val);
        this.set('searchCriterion', criterion);
        this.set('isSearchingProblems', true);
        this.send('triggerFetch');
      },
      initiatePageChange: function (page) {
        this.set('isChangingPage', true);
        let isTrashedOnly = this.toggleTrashed;
        this.getProblems(page, isTrashedOnly);
      },
      addCategory: function (cat) {
        let filterCategories = this.filter.categories;
        filterCategories.addObject(cat);
      },
      removeCategory: function (cat) {
        let filterCategories = this.filter.categories;
        filterCategories.removeObject(cat);
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
      triggerFetch(isTrashedOnly = false) {
        for (let prop of ['criteriaTooExclusive', 'areNoRecommendedProblems']) {
          if (this.get(prop)) {
            this.set(prop, null);
          }
        }
        this.getProblems(null, isTrashedOnly);
      },
      triggerShowTrashed() {
        this.send('triggerFetch', this.toggleTrashed);
      },
      sendtoApplication(categories) {
        this.sendAction('sendtoApplication', categories);
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
      updatePrivacySetting(val) {
        if (!val) {
          return;
        }
        this.set('selectedPrivacySetting', val);
        this.send('triggerFetch');
      },
      toggleMenu: function () {
        $('#filter-list-side').toggleClass('collapse');
        $('#arrow-icon').toggleClass('fa-rotate-180');
        $('#filter-list-side').addClass('animated slideInLeft');
      },

      updateStatusFilter: function (status) {
        let allowedValues = ['approved', 'pending', 'flagged'];
        if (!_.contains(allowedValues, status)) {
          return;
        }
        let statusFilter = this.statusFilter;

        if (_.contains(statusFilter, status)) {
          statusFilter.removeObject(status);
        } else {
          statusFilter.addObject(status);
        }
        this.send('triggerFetch');
      },
      toProblemInfo(problem) {
        this.sendAction('toProblemInfo', problem);
        this.$('#outlet').removeClass('hidden');
      },
      closeModal() {
        this.set('showCategoryList', false);
      },
      searchCategory(cat) {
        this.selectedCategories.pushObject(cat);
      },
    },
  }
);
