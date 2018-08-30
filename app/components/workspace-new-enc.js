Encompass.WorkspaceNewEncComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  ElementId: 'workspace-new-enc',

  selectedPdSetId: null,
  selectedFolderSet: null,
  selectedAssignment: null,
  selectedSection: null,
  selectedProblem: null,
  selectedOwner: null,
  teacher: null,
  mode: 'private',

  didReceiveAttrs: function() {
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
    const params = ['teacher', 'selectedAssignment', 'selectedProblem', 'selectedSection'];
    for (let param of params) {
      console.log(param);
      if (this.get(param)) {
        return true;
      }
    }
  }.property('teacher', 'selectedAssignment', 'selectedProblem', 'selectedSection'),

  isFormValid: Ember.computed.or('isDateRangeValid', 'isAnswerCriteriaValid'),


  actions: {
    // radioSelect: function( value ){
    //   console.log("Radio select: " + value );
    //   this.set('importMode', value );
    // },

    radioSelect: function (value) {
      this.set('mode', value);
    },


    buildCriteria: function() {
      if (!this.get('isFormValid')) {
        this.set('missingRequiredFields', true);
        return;
      }
      if (!this.get('selectedTeacher')) {
        this.set('selectedTeacher', this.get('currentUser'));
      }

      if (!this.get('selectedOwner')) {
        this.set('selectedOwner', this.get('currentUser'));
      }
      const startDate = this.get('startDate');
      const endDate = this.get('endDate');
      const requestedName = this.get('requestedName');
      const mode = this.get('mode');
      const owner = this.get('selectedOwner');

      console.log(startDate, endDate);
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
        console.log('res ws', res);
        if (res.get('isEmptyAnswerSet')) {
          this.set('isEmptyAnswerSet', true);
          return;
        }
        if (res.get('createWorkspaceError')) {
          this.set('createWorkspaceError', res.get('createWorkspaceError'));
          return;
        }

        // currently redirecting to workspaces list if successful
        // should we try to redirect to the individual workspace page?
        this.sendAction('toWorkspaces');
      })
      .catch((err) => {
        this.set('createWorkspaceError', err);
        return;
      });
    },
  }
});


