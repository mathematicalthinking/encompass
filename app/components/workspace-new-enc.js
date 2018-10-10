Encompass.WorkspaceNewEncComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, Encompass.AddableProblemsMixin, {
  elementId: 'workspace-new-enc',
  alert: Ember.inject.service('sweet-alert'),
  selectedPdSetId: null,
  selectedFolderSet: null,
  selectedAssignment: null,
  selectedSection: null,
  selectedProblem: null,
  selectedOwner: null,
  teacher: null,
  mode: 'private',
  userList: null,
  findRecordErrors: [],
  wsRequestErrors: [],

  init: function() {
    this._super(...arguments);
    this.set('userList', this.model.users);
    $(function () {
      $('input[name="daterange"]').daterangepicker({
        autoUpdateInput: false,
        showDropdowns: true,
        locale: {
          cancelLabel: 'Clear'
        }
      });
      $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      });

      $('input[name="daterange"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
      });
      $('input[name="daterange"]').attr('placeholder', 'mm/dd/yyyy - mm/dd/yyyy');
    });
  },

  didReceiveAttrs: function() {
    this.setAddProblemFunction('addProblemTypeahead');
    const currentUser = this.get('currentUser');
    if (currentUser.get('accountType') === 'T') {
      this.set('selectedTeacher', currentUser);
    }
    this.set('teacherPool', this.getTeacherPool());
  },

  willDestroyElement: function () {
    $(".daterangepicker").remove();
    this._super(...arguments);
  },

  getTeacherPool: function() {
    const currentUser = this.get('currentUser');
    const accountType = currentUser.get('accountType');

    if (accountType === 'T') {
      return [currentUser];
    }

    const users = this.get('userList').rejectBy('accountType', 'S');

    if (accountType === 'P') {
      let yourUsers = this.get('userList');
      let yourUserList = [];

      yourUsers.forEach((user) => {
        let yourOrg = currentUser.get('organization').get('id');
        let userType = user.get('accountType');
        let userOrg = user.get('organization').get('id');
        let isAuth = user.get('isAuthorized');

        if (yourOrg === userOrg && userType === 'T' && isAuth) {
          yourUserList.push(user);
        }
      });
      return yourUserList;
    }
    if (accountType === 'A') {
      return users.filterBy('isAuthorized', true);
    }
  },

  isDateRangeValid: function() {
    const htmlFormat = 'YYYY-MM-DD';
    let start = this.get('startDate');
    let end = this.get('endDate');

    if (Ember.isEmpty(start) || Ember.isEmpty(end)) {
      return false;
    }
    start = moment(start, htmlFormat);
    end = moment(end, htmlFormat);

    return end > start;
  }.property('startDate', 'endDate'),

  getMongoDate: function(htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    return new Date(dateMoment);
  },

  getEndDate: function (htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    let date = new Date(dateMoment);
    date.setHours(23, 59, 59);
    return date;
  },

  isAnswerCriteriaValid: function() {
    const params = ['selectedTeacher', 'selectedAssignment', 'selectedProblem', 'selectedSection'];
    for (let param of params) {
      if (this.get(param)) {
        return true;
      }
    }
    return false;
  }.property('selectedTeacher', 'selectedAssignment', 'selectedProblem', 'selectedSection'),

  isFormValid: Ember.computed('isDateRangeValid', 'isAnswerCriteriaValid', 'isWorkspaceSettingsValid', function() {
    return this.get('isDateRangeValid') || this.get('isAnswerCriteriaValid') || this.get('isWorkspaceSettingsValid');
  }),

  isWorkspaceSettingsValid: function() {
    const params = ['selectedOwner', 'mode'];
    for (let param of params) {
      if (!this.get(param)) {
        return false;
      }
    }
    return true;
  }.property('selectedOwner', 'mode'),


  actions: {
    radioSelect: function (value) {
      this.set('mode', value);
    },

    buildCriteria: function() {
      if (!this.get('isFormValid')) {
        if (this.get('missingRequiredFields')) {
          console.log('missingRequredFields is already true');
          $('.error-box').removeClass('fadeIn');
          $('.error-box').addClass('pulse');
        }
        this.set('missingRequiredFields', true);
        $('.error-box').show();
        return;
      }

      if (!this.get('selectedOwner')) {
        this.set('selectedOwner', this.get('currentUser'));
      }

      let startDate;
      let endDate;
      let dateRangeTextVal = $('#dateRange').val(); // empty string if no date range is picked

      if (dateRangeTextVal) { // user selected a date range
        const start = $('#dateRange').data('daterangepicker').startDate.format('YYYY-MM-DD');
        const end = $('#dateRange').data('daterangepicker').endDate.format('YYYY-MM-DD');
        startDate = this.getMongoDate(start);
        endDate = this.getEndDate(end);
      } else {
        startDate = null;
        endDate = null;
      }

      const requestedName = this.get('requestedName');
      const mode = this.get('mode');
      const owner = this.get('selectedOwner');

      const criteria = {
        teacher: this.get('selectedTeacher'),
        createdBy: this.get('currentUser'),
        assignment: this.get('selectedAssignment'),
        problem: this.get('selectedProblem'),
        section: this.get('selectedSection'),
        startDate: startDate,
        endDate: endDate,
        folderSetName: this.get('selectedFolderSet.name'),
        requestedName,
        mode,
        owner
      };

      const encWorkspaceRequest = this.store.createRecord('encWorkspaceRequest', criteria);
      encWorkspaceRequest.save().then((res) => {
        if (res.get('isEmptyAnswerSet')) {
          this.set('isEmptyAnswerSet', true);
          $('.error-box').show();
          return;
        }
        if (res.get('createWorkspaceError')) {
          this.set('createWorkspaceError', res.get('createWorkspaceError'));
          return;
        }
        this.get('alert').showToast('success', 'Workspace Created', 'bottom-end', 3000, false, null);
        //Get the created workspaceId from the res
        let workspaceId = res.get('createdWorkspace').get('id');
        //Then find the first SubmissionID, this is sent to route in order to redirect
        this.store.findRecord('workspace', workspaceId).then((workspace) => {
          let submission = workspace.get('submissions').get('firstObject');
          let submissionId = submission.get('id');
          this.sendAction('toWorkspaces', workspaceId, submissionId);
        }).catch((err) => {
          this.handleErrors(err, 'findRecordErrors');
        });

      })
      .catch((err) => {
        this.handleErrors(err, 'wsRequestErrors', encWorkspaceRequest);
        return;
      });
    },
    closeError: function (error) {
      $('.error-box').addClass('fadeOutRight');
      Ember.run.later(() => {
        $('.error-box').removeClass('fadeOutRight');
        $('.error-box').removeClass('pulse');
        $('.error-box').hide();
      }, 500);
    },
  }
});

