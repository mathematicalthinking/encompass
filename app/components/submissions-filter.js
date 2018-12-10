/*global _:false */
Encompass.SubmissionsFilterComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'submissions-filter',
  alert: Ember.inject.service('sweet-alert'),
  selectedFolderSet: null,
  selectedAssignment: null,
  selectedSection: null,
  selectedProblem: null,
  selectedStudents: [],
  teacher: null,
  findRecordErrors: [],
  wsRequestErrors: [],
  utils: Ember.inject.service('utility-methods'),

  init: function() {
    this._super(...arguments);
    let tooltips = {
      teacher: 'Find all work related to this teacher',
      assignment: 'Find all work related to this assignment',
      problem: 'Find all accessibile work related to this problem',
      class: 'Find all work completed by this class',
      dateRange: 'Find all accessibile work for this date range',
      owner: 'Who will have ownership of this workspace',
      name: 'Give your workspace a name. If not, workspace names are generated based off given criteria',
      folders: 'Choose a starter folder set, you can create your own later',
      privacy: 'Private workspaces are only visibile by the owner and collaborators. Public workspaces are visibile to all users',
    };
    this.set('tooltips', tooltips);
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
  doFetchStudents: function() {
    return !this.get('selectedAssignment') && !this.get('selectedSection') && !this.get('selectedTeacher');
  }.property('selectedAssignment', 'selectedSection', 'selectedTeacher'),

  isTeacher: function() {
   return this.get('currentUser.accountType') === 'T' && this.get('currentUser.actingRole') !== 'student';
  }.property('currentUser'),

  initialTeacherItem: function() {
    if (this.get('selectedTeacher') && this.get('isTeacher')) {
      return [this.get('selectedTeacher.id')];
    }
    return [];
  }.property('selectedTeacher', 'isTeacher'),

  initialStudentItem: function() {
    if(this.get('selectedStudent') && this.get('currentUser.isStudent')) {
        return [this.get('selectedStudent.id')];
    }
    return [];
  }.property('currentUser', 'selectedStudent'),

  didReceiveAttrs: function() {
    if (this.get('currentUser.isStudent')) {
      this.set('selectedStudent', this.get('currentUser'));
    } else if (this.get('currentUser.isTeacher')) {
      this.set('selectedTeacher', this.get('currentUser'));
    }

    for (let attr of ['sections', 'assignments', 'users']) {
      let modelProp = this.get(attr);
      let newProp = `base${attr.capitalize()}`;
      if (modelProp) {
        this.set(newProp, modelProp.toArray());
      } else {
        this.set(newProp, []);
      }
    }
    this._super(...arguments);
    // this.set('teacherPool', this.getTeacherPool());
  },

  teacherPool: function() {
    const assignment = this.get('selectedAssignment');
    const section = this.get('selectedSection');
    const students = this.get('selectedStudents');

    if (section) {
      return section.get('teachers');
    }
    if (assignment) {
      return assignment.get('section.teachers');
    }

    if (this.get('utils').isNonEmptyArray(students)) {
      let sections = this.get('selectedStudentsSections');
      if (sections) {
        let teachers = sections.mapBy('teachers');
        let results = [];
        if (teachers) {
          teachers.forEach((arr) => {
            results.addObjects(arr);
          });
          return results;
        }
      }
      return [];
    }

    if (this.get('baseUsers')) {
      return this.get('baseUsers').rejectBy('accountType', 'S');
    }
    return [];

  }.property('baseUsers.[]', 'selectedSection', 'selectedAssignment', 'selectedStudents.[]'),

  teacherPoolOptions: function() {
    if (!this.get('teacherPool')) {
      return [];
    }
    return this.get('teacherPool').map((teacher) => {
      return {
        id: teacher.get('id'),
        username: teacher.get('username')
      };
    });
  }.property('teacherPool.[]'),

  studentPool: function() {
    const assignment = this.get('selectedAssignment');
    const section = this.get('selectedSection');
    const teacher = this.get('selectedTeacher');

    // students can only make workspaces from their own work
    if (this.get('currentUser.isStudent')) {
      return [this.get('currentUser')];
    }

    if (assignment) {
      return assignment.get('students');
    }

    if (section) {
      return section.get('students');
    }

    if (teacher) {
      const sections = this.get('selectedTeacherSections');

      const studentsBySection = sections.mapBy('students');
      console.log('sbs', studentsBySection);
      let results = [];
      studentsBySection.forEach((students) => {
        results.addObjects(students);
      });
      console.log('students', results);
      return results;

    }
    const baseUsers = this.get('baseUsers');
    if (baseUsers) {
      return baseUsers;
    }
    return [];
    // const peeked = this.get('store').peekAll('user');
    // if (peeked) {
    //   return peeked;
    // }
    // return [];

  }.property('baseUsers.[]','baseSections.[]', 'selectedSection', 'selectedAssignment', 'selectedTeacher'),

  problemFilters: function() {
    let results = {};
    const assignment = this.get('selectedAssignment');
    if (assignment) {
      let id = assignment.belongsTo('problem').id();
      console.log('id', id);
      results.ids = [id];
    }
    return results;
  }.property('selectedAssignment'),

  // problemIdFilterHash: function() {
  //   const assignment = this.get('selectedAssignment');
  //   let hash = {};
  //   if (assignment) {
  //     let id = assignment.belongsTo('problem').id();
  //     hash[id] = true;
  //   }
  //   return hash;
  // }.property('selectedAssignment'),

  studentPoolOptions: function() {
    let students = this.get('studentPool');
    console.log('studentPool', students);

    if (!_.isObject(students)) {
      return [];
    }
    return students.map((user) => {
      return {
        id: user.get('id'),
        username: user.get('username')
      };
    });
  }.property('studentPool.[]'),

  // doFetchProblems: function() {
  //   return !this.get('selectedAssignment');
  // }.property('selectedAssignment'),

  selectedTeacherSectionIds: function() {
    const sectionsFromTeacher = this.get('selectedTeacher.sections');
    if (sectionsFromTeacher) {
      return sectionsFromTeacher.filter((section) => {
        return section.role === 'teacher';
      })
      .map(section => section.sectionId);
    }
    return [];
  }.property('selectedTeacher'),
  selectedTeacherAssignments: function() {
    if (!this.get('selectedTeacher')) {
      return [];
    }
    return this.get('baseAssignments').filter((assignment) => {
     return assignment.get('createdBy.id') === this.get('selectedTeacher.id') || this.get('selectedTeacherSectionIds').includes(assignment.get('section.id'));
    });
  }.property('selectedTeacher', 'baseAssignments.[]'),

  selectedProblemAssignments: function() {
    if (!this.get('selectedProblem')) {
      return [];
    }
    return this.get('baseAssignments').filterBy('problem.id', this.get('selectedProblem.id'));
  }.property('selectedProblem', 'baseAssignments.[]'),

  selectedSectionAssignments: function() {
    if (!this.get('selectedSection')) {
      return [];
    }
    return this.get('baseAssignments').filter((assignment) => {
      return this.get('selectedSection.assignments').includes(assignment);
    });
  }.property('selectedSection', 'baseAssignments.[]'),

  selectedStudentsAssignments: function() {
    const utils = this.get('utils');
    const students = this.get('selectedStudents');
    if (!utils.isNonEmptyArray(students)) {
      return [];
    }
    const assignments = students.mapBy('assignments');
    let results = [];
    assignments.forEach((arr) => {
      results.addObjects(arr);
    });
    return results;
  }.property('selectedStudents.[]', 'baseAssignments.[]'),


  assignmentOptions: function() {
    let assignments = [];
    let teacher = this.get('selectedTeacher');
    let problem = this.get('selectedProblem');
    let section = this.get('selectedSection');
    let students = this.get('selectedStudents');
    const utils = this.get('utils');

    if (!teacher && !problem && !section && !students) {
      assignments = this.get('baseAssignments');
    } else {
      let hashMaps = [];
      if (teacher) {
        let teacherMap = {};
        this.get('selectedTeacherAssignments').forEach((assignment) => {
          teacherMap[assignment.get('id')] = true;
        });
        hashMaps.push(teacherMap);
      }
      if (problem) {
        let problemMap = {};
        this.get('selectedProblemAssignments').forEach((assignment) => {
          problemMap[assignment.get('id')] = true;
        });
        hashMaps.push(problemMap);
      }
      if (section) {
        let sectionMap = {};
        this.get('selectedSectionAssignments').forEach((assignment) => {
          sectionMap[assignment.get('id')] = true;
        });
        hashMaps.push(sectionMap);
      }
      if (utils.isNonEmptyArray(students)) {
        let studentsMap = {};
        this.get('selectedStudentsAssignments').forEach((assignment) => {
          studentsMap[assignment.get('id')] = true;
        });
        hashMaps.push(studentsMap);
      }
      assignments = this.get('baseAssignments').filter((assignment) => {
        return hashMaps.every((hashMap) => hashMap[assignment.get('id')]);
      });
    }

    let mapped = _.map(assignments, (assignment) => {
      return {
        id: assignment.id,
        name: assignment.get('name')
      };

    });
    return mapped;
  }.property('baseAssignments.[]', 'selectedTeacher', 'selectedProblem', 'selectedSection', 'selectedStudents.[]'),

  sectionPool: function() {
    const assignment = this.get('selectedAssignment');
    const teacher = this.get('selectedTeacher');
    const students = this.get('selectedStudents');
    const utils = this.get('utils');
    if (assignment) {
      let section = assignment.get('section');
      if (section) {
        return [section];
      }
      return [];
    }

    if (utils.isNonEmptyArray(students)) {
      return this.get('selectedStudentsSections');
    }

    if (teacher) {
      return this.get('selectedTeacherSections');
    }
    if (this.get('baseSections')) {
      return this.get('baseSections');
    }
    return [];

  }.property('selectedTeacher', 'selectedAssignment', 'selectedStudentsSections.[]', 'selectedStudents.[]'),

  sectionPoolOptions: function() {
    const sections = this.get('sectionPool');
    if (sections) {
      return sections.map((section) => {
        return {
          id: section.get('id'),
          name: section.get('name')
        };
      });
    }
    return [];
  }.property('sectionPool.[]'),

  selectedStudentSectionIds: function() {
    const students = this.get('selectedStudents');
    if (!students) {
      return [];
    }
    const studentSections = students.mapBy('sections');
    console.log('sections', studentSections);
    let sectionObjects = [];
    studentSections.forEach((arr) => {
      sectionObjects.addObjects(arr);
    });

    let filtered = sectionObjects.filterBy('role', 'student');
    console.log('filtered', filtered);
    let ids = filtered.mapBy('sectionId');
    return ids;
  }.property('selectedStudents.[]'),

  selectedStudentsSections: function() {
    const students = this.get('selectedStudents');
    const sections = this.get('baseSections');
    if (!students) {
      return [];
    }
    const ids = this.get('selectedStudentSectionIds');
    if (sections && _.isArray(ids)) {
      return sections.filter((section) => {
        return ids.includes(section.get('id'));
      });
    }

  }.property('selectedStudentSectionIds.[]', 'baseSections.[]'),

  selectedTeacherSections: function() {
    if (!this.get('selectedTeacher')) {
      return [];
    }
    const sections = this.get('baseSections');
    const ids = this.get('selectedTeacherSectionIds');
    if (sections && _.isArray(ids)) {
      return sections.filter((section) => {
        return ids.includes(section.get('id'));
      });
    }
    return [];

  }.property('selectedTeacher', 'baseSections.[]'),

  selectedAssignmentSections: function() {
    if (!this.get('selectedAssignment')) {
      return [];
    }
    return this.get('baseSections').filter((section) => {
      const assignments = section.get('assignments');
      if (assignments) {
        return assignments.includes(this.get('selectedAssignment'));
      }
    });
  }.property('baseSections.[]', 'selectedAssignment'),

  sectionOptions: function() {
    let sections = [];
    let teacher = this.get('selectedTeacher');
    let assignment = this.get('selectedAssignment');

    if (!teacher && !assignment) {
      sections = this.get('baseSections');
    } else {
      let hashMaps = [];
      if (teacher) {
        let teacherMap = {};
        this.get('selectedTeacherSections').forEach((section) => {
          teacherMap[section.get('id')] = true;
        });
        hashMaps.push(teacherMap);
      }

      if (assignment) {
        let assignmentMap = {};
        this.get('selectedAssignmentSections').forEach((assignment) => {
          assignmentMap[assignment.get('id')] = true;
        });
        hashMaps.push(assignmentMap);
      }
      sections = this.get('baseSections').filter((section) => {
        return hashMaps.every((hashMap) => hashMap[section.get('id')]);
      });
    }

    let mapped = _.map(sections, (section) => {
      return {
        id: section.id,
        name: section.get('name')
      };

    });
    return mapped;
  }.property('baseSections.[]', 'selectedTeacher', 'selectedAssignment'),

  willDestroyElement: function () {
    $(".daterangepicker").remove();
    this._super(...arguments);
  },

  getTeacherPool: function() {
    const accountType = this.get('currentUser.accountType');
    if (accountType === 'T') {
      return [this.get('currentUser')];
    }

    let teachers = this.get('userList').rejectBy('accountType', 'S');
    let authTeachers = teachers.filterBy('isAuthorized', true);


    if (accountType === 'P') {
    let pdOrg = this.get('currentUser.organization');
      let orgTeachers = authTeachers.filterBy('organization', pdOrg);
      return orgTeachers;

    }
    if (accountType === 'A') {
      return authTeachers;
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
    buildCriteria: function() {
      const utils = this.get('utils');
      if (!this.get('isFormValid')) {
        if (this.get('missingRequiredFields')) {
          $('.error-box').removeClass('fadeIn');
          $('.error-box').addClass('pulse');
        }
        this.set('missingRequiredFields', true);
        $('.error-box').show();
        return;
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

      const criteria = {
        teacher: this.get('selectedTeacher.id'),
        assignment: this.get('selectedAssignment.id'),
        problem: this.get('selectedProblem.id'),
        section: this.get('selectedSection.id'),
        startDate: startDate,
        endDate: endDate,
      };
      _.each(criteria, (val, key) => {
        if (utils.isNullOrUndefined(val)|| _.isEmpty(val)) {
          delete criteria[key];
        }
      });
      this.get('onSearch')(criteria);

      // const encWorkspaceRequest = this.store.createRecord('encWorkspaceRequest', criteria);
      // this.set('isRequestInProgress', true);
      // encWorkspaceRequest.save().then((res) => {
      //   this.set('isRequestInProgress', false);
      //   if (res.get('isEmptyAnswerSet')) {
      //     this.set('isEmptyAnswerSet', true);
      //     $('.error-box').show();
      //     return;
      //   }
      //   if (res.get('createWorkspaceError')) {
      //     this.set('createWorkspaceError', res.get('createWorkspaceError'));
      //     return;
      //   }
      //   this.get('alert').showToast('success', 'Workspace Created', 'bottom-end', 3000, false, null);
      //   //Get the created workspaceId from the res
      //   let workspaceId = res.get('createdWorkspace').get('id');
      //   //Then find the first SubmissionID, this is sent to route in order to redirect
      //   this.store.findRecord('workspace', workspaceId).then((workspace) => {
      //     let submission = workspace.get('submissions').get('firstObject');
      //     let submissionId = submission.get('id');
      //     this.sendAction('toWorkspaces', workspaceId, submissionId);
      //   }).catch((err) => {
      //     this.handleErrors(err, 'findRecordErrors');
      //   });

      // })
      // .catch((err) => {
      //   this.set('isRequestInProgress', false);

      //   this.handleErrors(err, 'wsRequestErrors', encWorkspaceRequest);
      //   return;
      // });
    },
    closeError: function (error) {
      $('.error-box').addClass('fadeOutRight');
      Ember.run.later(() => {
        $('.error-box').removeClass('fadeOutRight');
        $('.error-box').removeClass('pulse');
        $('.error-box').hide();
      }, 500);
    },

    updateSelectizeSingle(val, $item, propToUpdate, model) {
      console.log('uss', val, $item,propToUpdate);
      if (_.isNull($item)) {
        this.set(propToUpdate, null);
        return;
      }
      let record = this.get('store').peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    updateSelectedStudents(val, $item) {
      if (!val) {
        return;
      }
      let selectedStudents = this.get('selectedStudents');
      if (_.isNull($item)) {
        // removal
        let studentToRemove = selectedStudents.findBy('id', val);
        if (studentToRemove) {
          selectedStudents.removeObject(studentToRemove);
          return;
        }
      }
      let record = this.get('store').peekRecord('user', val);
      if (record) {
        selectedStudents.addObject(record);
      }
    },
    updateMultiSelect(val, $item, propToUpdate, model) {
      if (!val || !propToUpdate) {
        return;
      }
      let isRemoval = _.isNull($item);
      let prop = this.get(propToUpdate);
      let isPropArray = _.isArray(prop);

      if (isRemoval) {
        if (!isPropArray) {
          this.set(prop, null);
        } else {
          // val is id and prop is array of ember records
          let objectToRemove = prop.findBy('id', val);
          if (objectToRemove) {
            prop.removeObject(val);
          }
        }
        return;
      }
      if (!isPropArray) {
        this.set(prop, val);
      } else {
        let record = this.get('store').peekRecord(model, val);
      if (!record) {
        return;
      }
        prop.pushObject(record);
      }
    }

    // setSelectedProblem(problemId) {
    //   let peeked = this.get('store').peekAll('problem');

    //   let problem = peeked.findBy('id', problemId);
    //   if (!problem) {
    //     return;
    //   }
    //   this.set('selectedProblem', problem);
    // }
  }
});