Encompass.WorkspaceNewEncComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'workspace-new-enc',

  selectedPdSetId: null,
  selectedFolderSet: null,
  selectedAssignment: null,
  selectedSection: null,
  selectedProblem: null,
  selectedOwner: null,
  teacher: null,
  mode: 'private',

  didReceiveAttrs: function() {
    const currentUser = this.get('currentUser');
    if (currentUser.get('accountType') !== 'A') {
      this.set('selectedTeacher', currentUser);
    }
    this.set('teacherPool', this.getTeacherPool());

  },

  getTeacherPool: function() {
    const currentUser = this.get('currentUser');
    const accountType = currentUser.get('accountType');

    if (accountType === 'T') {
      return [currentUser];
    }

    const teachers = this.model.users.rejectBy('accountType', 'S');

    if (accountType === 'P') {
      return teachers.filterBy('organization', currentUser.organization);
    }
    if (accountType === 'A') {
      return teachers;
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
        this.set('missingRequiredFields', true);
        return;
      }

      if (!this.get('selectedOwner')) {
        this.set('selectedOwner', this.get('currentUser'));
      }
      const startDate = this.get('startDate');
      const endDate = this.get('endDate');
      const requestedName = this.get('requestedName');
      const mode = this.get('mode');
      const owner = this.get('selectedOwner');

      const criteria = {
        teacher: this.get('selectedTeacher'),
        createdBy: this.get('currentUser'),
        assignment: this.get('selectedAssignment'),
        problem: this.get('selectedProblem'),
        section: this.get('selectedSection'),
        startDate: this.getMongoDate(this.get('startDate')),
        endDate: this.getMongoDate(this.get('endDate')),
        folderSetName: this.get('selectedFolderSet.name'),
        requestedName,
        mode,
        owner
      };

      const encWorkspaceRequest = this.store.createRecord('encWorkspaceRequest', criteria);
      encWorkspaceRequest.save().then((res) => {
        if (res.get('isEmptyAnswerSet')) {
          this.set('isEmptyAnswerSet', true);
          return;
        }
        if (res.get('createWorkspaceError')) {
          this.set('createWorkspaceError', res.get('createWorkspaceError'));
          return;
        }
        //Get the created workspaceId from the res
        let workspaceId = res.get('createdWorkspace').get('id');
        //Then find the first SubmissionID, this is sent to route in order to redirect
        this.store.findRecord('workspace', workspaceId).then((workspace) => {
          let submission = workspace.get('submissions').get('firstObject');
          let submissionId = submission.get('id');
          this.sendAction('toWorkspaces', workspaceId, submissionId);
        });

      })
      .catch((err) => {
        this.set('createWorkspaceError', err);
        return;
      });
    },
  }
});

