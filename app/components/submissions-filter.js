/*global _:false */
Encompass.SubmissionsFilterComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'submissions-filter',
  alert: Ember.inject.service('sweet-alert'),
  findRecordErrors: [],
  wsRequestErrors: [],
  utils: Ember.inject.service('utility-methods'),
  isVmtOnly: false,
  showVmtFilters: false,

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

    const that = this;

    $(function () {
      let startDate = that.get('startDate');
      let endDate = that.get('endDate');

      if (!startDate) {
        startDate = moment().subtract(1, 'years');
      } else if (_.isString(startDate)) {
        startDate = moment(startDate);
      }
      if (!endDate) {
        endDate = moment();
      } else if (_.isString(endDate)) {
        endDate = moment(endDate);
      }

      $('input[name="startDate"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1990,
        autoUpdateInput: true,
        locale: {
          cancelLabel: 'Clear'
        },
        startDate: startDate,
      });
      $('input[name="endDate"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1990,
        autoUpdateInput: true,
        locale: {
          cancelLabel: 'Clear'
        },
        startDate: endDate,
      });
      $('input[name="startDate"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY'));
      });
      $('input[name="endDate"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY'));
      });
      $('input[name="startDate"]').attr('placeholder', 'mm/dd/yyyy');
      $('input[name="endDate"]').attr('placeholder', 'mm/dd/yyyy');
    });
  },
  missingCriteriaMessage: 'Please select either a teacher, assignment, problem, class, or at least one student.',
  invalidDateRangeMessage: 'Please provide a valid date range.',

  doFetchStudents: function() {
    return !this.get('selectedAssignment') && !this.get('selectedSection') && !this.get('selectedTeacher');
  }.property('selectedAssignment', 'selectedSection', 'selectedTeacher'),

  isTeacher: function() {
   return this.get('currentUser.accountType') === 'T' && this.get('currentUser.actingRole') !== 'student';
  }.property('currentUser'),

  initialTeacherItem: function() {
    if (this.get('isTeacher')) {
      return [this.get('currentUser.id')];
    }
    if (this.get('selectedTeacher')) {
      return [this.get('selectedTeacher.id')];
    }
    return [];
  }.property('selectedTeacher', 'isTeacher'),

  initialStudentItem: function() {
    if(this.get('currentUser.isStudent')) {
        return [this.get('currentUser.id')];
    }
    if (_.isArray(this.get('selectedStudents'))) {
      return this.get('selectedStudents').mapBy('id');
    }
    return [];
  }.property('currentUser', 'selectedStudents.[]'),

  initialAssignmentItem: function() {
    if (this.get('selectedAssignment')) {
      return [this.get('selectedAssignment.id')];
    }
    return [];
  }.property('selectedAssignment'),

  initialProblemItem: function() {
    if (this.get('selectedProblem')) {
      return [this.get('selectedProblem.id')];
    }
    return [];
  }.property('selectedProblem'),

  initialSectionItem: function() {
    if (this.get('selectedSection')) {
      return [this.get('selectedSection.id')];
    }
    return [];
  }.property('selectedSection'),

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
      let results = [];
      studentsBySection.forEach((students) => {
        results.addObjects(students);
      });
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
      results.ids = [id];
    }
    return results;
  }.property('selectedAssignment'),

  studentPoolOptions: function() {
    let students = this.get('studentPool');

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
    let sectionObjects = [];
    studentSections.forEach((arr) => {
      sectionObjects.addObjects(arr);
    });

    let filtered = sectionObjects.filterBy('role', 'student');
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
    const utils = this.get('utils');
    const params = ['selectedTeacher', 'selectedAssignment', 'selectedProblem', 'selectedSection', 'vmtSearchText'];
    for (let param of params) {
      if (this.get(param)) {
        return true;
      }
    }
    if (utils.isNonEmptyArray(this.get('selectedStudents'))) {
      return true;
    }
    return false;
  }.property('selectedTeacher', 'selectedAssignment', 'selectedProblem', 'selectedSection', 'selectedStudents.[]'),

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
      //clear errors if any
      let errorProps = ['isMissingCriteria', 'isInvalidDateRange'];
      _.each(errorProps, (prop) => {
        if (this.get(prop)) {
          this.set(prop, null);
        }
      });
      const utils = this.get('utils');
      if (!this.get('isAnswerCriteriaValid')) {
        this.set('isMissingCriteria', true);
        return;
      }

      let startDate = $('#startDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
      let endDate = $('#endDate').data('daterangepicker').startDate.format('YYYY-MM-DD');

      const students = this.get('selectedStudents');
      let studentIds;
      if (students) {
        studentIds = students.mapBy('id');
      }
      const criteria = {
        teacher: this.get('selectedTeacher.id'),
        assignment: this.get('selectedAssignment.id'),
        problem: this.get('selectedProblem.id'),
        section: this.get('selectedSection.id'),
        startDate: startDate,
        endDate: endDate,
        students: studentIds,
        doIncludeOldPows: this.get('doIncludeOldPows'),
        isVmtOnly: this.get('isVmtOnly'),
        vmtSearchText: this.get('vmtSearchText'),
      };
      _.each(criteria, (val, key) => {
        if (utils.isNullOrUndefined(val)|| val === '') {
          delete criteria[key];
        }
      });
      this.get('onSearch')(criteria);

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
    },
    toggleVmtFilters() {
      this.toggleProperty('showVmtFilters');
    },
  }
});