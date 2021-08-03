import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'submissions-filter',
  alert: service('sweet-alert'),
  findRecordErrors: [],
  wsRequestErrors: [],
  utils: service('utility-methods'),
  isVmtOnly: false,
  showVmtFilters: false,

  init: function () {
    this._super(...arguments);
    let tooltips = {
      teacher: 'Find all work related to this teacher',
      assignment: 'Find all work related to this assignment',
      problem: 'Find all accessibile work related to this problem',
      class: 'Find all work completed by this class',
      dateRange: 'Find all accessibile work for this date range',
      owner: 'Who will have ownership of this workspace',
      name:
        'Give your workspace a name. If not, workspace names are generated based off given criteria',
      folders: 'Choose a starter folder set, you can create your own later',
      privacy:
        'Private workspaces are only visibile by the owner and collaborators. Public workspaces are visibile to all users',
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

      // $('input[name="startDate"]').daterangepicker({
      //   singleDatePicker: true,
      //   showDropdowns: true,
      //   minYear: 1990,
      //   autoUpdateInput: true,
      //   locale: {
      //     cancelLabel: 'Clear',
      //   },
      //   startDate: startDate,
      // });
      // $('input[name="endDate"]').daterangepicker({
      //   singleDatePicker: true,
      //   showDropdowns: true,
      //   minYear: 1990,
      //   autoUpdateInput: true,
      //   locale: {
      //     cancelLabel: 'Clear',
      //   },
      //   startDate: endDate,
      // });
      // $('input[name="startDate"]').on(
      //   'apply.daterangepicker',
      //   function (ev, picker) {
      //     $(this).val(picker.startDate.format('MM/DD/YYYY'));
      //   }
      // );
      // $('input[name="endDate"]').on(
      //   'apply.daterangepicker',
      //   function (ev, picker) {
      //     $(this).val(picker.startDate.format('MM/DD/YYYY'));
      //   }
      // );
      // $('input[name="startDate"]').attr('placeholder', 'mm/dd/yyyy');
      // $('input[name="endDate"]').attr('placeholder', 'mm/dd/yyyy');
    });
  },
  missingCriteriaMessage:
    'Please select either a teacher, assignment, problem, class, or at least one student.',
  invalidDateRangeMessage: 'Please provide a valid date range.',

  doFetchStudents: computed(
    'selectedAssignment',
    'selectedSection',
    'selectedTeacher',
    function () {
      return (
        !this.selectedAssignment &&
        !this.selectedSection &&
        !this.selectedTeacher
      );
    }
  ),

  isTeacher: computed('currentUser', function () {
    return (
      this.get('currentUser.accountType') === 'T' &&
      this.get('currentUser.actingRole') !== 'student'
    );
  }),

  initialTeacherItem: computed('selectedTeacher', 'isTeacher', function () {
    if (this.isTeacher) {
      return [this.get('currentUser.id')];
    }
    if (this.selectedTeacher) {
      return [this.get('selectedTeacher.id')];
    }
    return [];
  }),

  initialStudentItem: computed(
    'currentUser',
    'selectedStudents.[]',
    function () {
      if (this.get('currentUser.isStudent')) {
        return [this.get('currentUser.id')];
      }
      if (_.isArray(this.selectedStudents)) {
        return this.selectedStudents.mapBy('id');
      }
      return [];
    }
  ),

  initialAssignmentItem: computed('selectedAssignment', function () {
    if (this.selectedAssignment) {
      return [this.get('selectedAssignment.id')];
    }
    return [];
  }),

  initialProblemItem: computed('selectedProblem', function () {
    if (this.selectedProblem) {
      return [this.get('selectedProblem.id')];
    }
    return [];
  }),

  initialSectionItem: computed('selectedSection', function () {
    if (this.selectedSection) {
      return [this.get('selectedSection.id')];
    }
    return [];
  }),

  didReceiveAttrs: function () {
    // if (this.get('currentUser.isStudent')) {
    //   this.set('selectedStudent', this.currentUser);
    // } else if (this.get('currentUser.isTeacher')) {
    //   this.set('selectedTeacher', this.currentUser);
    // }

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

  teacherPool: computed(
    'baseUsers.[]',
    'selectedSection',
    'selectedAssignment',
    'selectedStudents.[]',
    function () {
      const assignment = this.selectedAssignment;
      const section = this.selectedSection;
      const students = this.selectedStudents;

      if (section) {
        return section.get('teachers');
      }
      if (assignment) {
        return assignment.get('section.teachers');
      }

      if (this.utils.isNonEmptyArray(students)) {
        let sections = this.selectedStudentsSections;
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

      if (this.baseUsers) {
        return this.baseUsers.rejectBy('accountType', 'S');
      }
      return [];
    }
  ),

  teacherPoolOptions: computed('teacherPool.[]', function () {
    if (!this.teacherPool) {
      return [];
    }
    return this.teacherPool.map((teacher) => {
      return {
        id: teacher.get('id'),
        username: teacher.get('username'),
      };
    });
  }),

  studentPool: computed(
    'baseUsers.[]',
    'baseSections.[]',
    'selectedSection',
    'selectedAssignment',
    'selectedTeacher',
    function () {
      const assignment = this.selectedAssignment;
      const section = this.selectedSection;
      const teacher = this.selectedTeacher;

      // students can only make workspaces from their own work
      if (this.get('currentUser.isStudent')) {
        return [this.currentUser];
      }

      if (assignment) {
        return assignment.get('students');
      }

      if (section) {
        return section.get('students');
      }

      if (teacher) {
        const sections = this.selectedTeacherSections;

        const studentsBySection = sections.mapBy('students');
        let results = [];
        studentsBySection.forEach((students) => {
          results.addObjects(students);
        });
        return results;
      }
      const baseUsers = this.baseUsers;
      if (baseUsers) {
        return baseUsers;
      }
      return [];
      // const peeked = this.get('store').peekAll('user');
      // if (peeked) {
      //   return peeked;
      // }
      // return [];
    }
  ),

  problemFilters: computed('selectedAssignment', function () {
    let results = {};
    const assignment = this.selectedAssignment;
    if (assignment) {
      let id = assignment.belongsTo('problem').id();
      results.ids = [id];
    }
    return results;
  }),

  studentPoolOptions: computed('studentPool.[]', function () {
    let students = this.studentPool;

    if (!_.isObject(students)) {
      return [];
    }
    return students.map((user) => {
      return {
        id: user.get('id'),
        username: user.get('username'),
      };
    });
  }),

  // doFetchProblems: function() {
  //   return !this.get('selectedAssignment');
  // }.property('selectedAssignment'),

  selectedTeacherSectionIds: computed('selectedTeacher', function () {
    const sectionsFromTeacher = this.get('selectedTeacher.sections');
    if (sectionsFromTeacher) {
      return sectionsFromTeacher
        .filter((section) => {
          return section.role === 'teacher';
        })
        .map((section) => section.sectionId);
    }
    return [];
  }),
  selectedTeacherAssignments: computed(
    'selectedTeacher',
    'baseAssignments.[]',
    function () {
      if (!this.selectedTeacher) {
        return [];
      }
      return this.baseAssignments.filter((assignment) => {
        return (
          assignment.get('createdBy.id') === this.get('selectedTeacher.id') ||
          this.selectedTeacherSectionIds.includes(assignment.get('section.id'))
        );
      });
    }
  ),

  selectedProblemAssignments: computed(
    'selectedProblem',
    'baseAssignments.[]',
    function () {
      if (!this.selectedProblem) {
        return [];
      }
      return this.baseAssignments.filterBy(
        'problem.id',
        this.get('selectedProblem.id')
      );
    }
  ),

  selectedSectionAssignments: computed(
    'selectedSection',
    'baseAssignments.[]',
    function () {
      if (!this.selectedSection) {
        return [];
      }
      return this.baseAssignments.filter((assignment) => {
        return this.get('selectedSection.assignments').includes(assignment);
      });
    }
  ),

  selectedStudentsAssignments: computed(
    'selectedStudents.[]',
    'baseAssignments.[]',
    function () {
      const utils = this.utils;
      const students = this.selectedStudents;
      if (!utils.isNonEmptyArray(students)) {
        return [];
      }
      const assignments = students.mapBy('assignments');
      let results = [];
      assignments.forEach((arr) => {
        results.addObjects(arr);
      });
      return results;
    }
  ),

  assignmentOptions: computed(
    'baseAssignments.[]',
    'selectedTeacher',
    'selectedProblem',
    'selectedSection',
    'selectedStudents.[]',
    function () {
      let assignments = [];
      let teacher = this.selectedTeacher;
      let problem = this.selectedProblem;
      let section = this.selectedSection;
      let students = this.selectedStudents;
      const utils = this.utils;

      if (!teacher && !problem && !section && !students) {
        assignments = this.baseAssignments;
      } else {
        let hashMaps = [];
        if (teacher) {
          let teacherMap = {};
          this.selectedTeacherAssignments.forEach((assignment) => {
            teacherMap[assignment.get('id')] = true;
          });
          hashMaps.push(teacherMap);
        }
        if (problem) {
          let problemMap = {};
          this.selectedProblemAssignments.forEach((assignment) => {
            problemMap[assignment.get('id')] = true;
          });
          hashMaps.push(problemMap);
        }
        if (section) {
          let sectionMap = {};
          this.selectedSectionAssignments.forEach((assignment) => {
            sectionMap[assignment.get('id')] = true;
          });
          hashMaps.push(sectionMap);
        }
        if (utils.isNonEmptyArray(students)) {
          let studentsMap = {};
          this.selectedStudentsAssignments.forEach((assignment) => {
            studentsMap[assignment.get('id')] = true;
          });
          hashMaps.push(studentsMap);
        }
        assignments = this.baseAssignments.filter((assignment) => {
          return hashMaps.every((hashMap) => hashMap[assignment.get('id')]);
        });
      }

      let mapped = _.map(assignments, (assignment) => {
        return {
          id: assignment.id,
          name: assignment.get('name'),
        };
      });
      return mapped;
    }
  ),

  sectionPool: computed(
    'selectedTeacher',
    'selectedAssignment',
    'selectedStudentsSections.[]',
    'selectedStudents.[]',
    function () {
      const assignment = this.selectedAssignment;
      const teacher = this.selectedTeacher;
      const students = this.selectedStudents;
      const utils = this.utils;
      if (assignment) {
        let section = assignment.get('section');
        if (section) {
          return [section];
        }
        return [];
      }

      if (utils.isNonEmptyArray(students)) {
        return this.selectedStudentsSections;
      }

      if (teacher) {
        return this.selectedTeacherSections;
      }
      if (this.baseSections) {
        return this.baseSections;
      }
      return [];
    }
  ),

  sectionPoolOptions: computed('sectionPool.[]', function () {
    const sections = this.sectionPool;
    if (sections) {
      return sections.map((section) => {
        return {
          id: section.get('id'),
          name: section.get('name'),
        };
      });
    }
    return [];
  }),

  selectedStudentSectionIds: computed('selectedStudents.[]', function () {
    const students = this.selectedStudents;
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
  }),

  selectedStudentsSections: computed(
    'selectedStudentSectionIds.[]',
    'baseSections.[]',
    function () {
      const students = this.selectedStudents;
      const sections = this.baseSections;
      if (!students) {
        return [];
      }
      const ids = this.selectedStudentSectionIds;
      if (sections && _.isArray(ids)) {
        return sections.filter((section) => {
          return ids.includes(section.get('id'));
        });
      }
    }
  ),

  selectedTeacherSections: computed(
    'selectedTeacher',
    'baseSections.[]',
    function () {
      if (!this.selectedTeacher) {
        return [];
      }
      const sections = this.baseSections;
      const ids = this.selectedTeacherSectionIds;
      if (sections && _.isArray(ids)) {
        return sections.filter((section) => {
          return ids.includes(section.get('id'));
        });
      }
      return [];
    }
  ),

  selectedAssignmentSections: computed(
    'baseSections.[]',
    'selectedAssignment',
    function () {
      if (!this.selectedAssignment) {
        return [];
      }
      return this.baseSections.filter((section) => {
        const assignments = section.get('assignments');
        if (assignments) {
          return assignments.includes(this.selectedAssignment);
        }
      });
    }
  ),

  sectionOptions: computed(
    'baseSections.[]',
    'selectedTeacher',
    'selectedAssignment',
    function () {
      let sections = [];
      let teacher = this.selectedTeacher;
      let assignment = this.selectedAssignment;

      if (!teacher && !assignment) {
        sections = this.baseSections;
      } else {
        let hashMaps = [];
        if (teacher) {
          let teacherMap = {};
          this.selectedTeacherSections.forEach((section) => {
            teacherMap[section.get('id')] = true;
          });
          hashMaps.push(teacherMap);
        }

        if (assignment) {
          let assignmentMap = {};
          this.selectedAssignmentSections.forEach((assignment) => {
            assignmentMap[assignment.get('id')] = true;
          });
          hashMaps.push(assignmentMap);
        }
        sections = this.baseSections.filter((section) => {
          return hashMaps.every((hashMap) => hashMap[section.get('id')]);
        });
      }

      let mapped = _.map(sections, (section) => {
        return {
          id: section.id,
          name: section.get('name'),
        };
      });
      return mapped;
    }
  ),

  willDestroyElement: function () {
    // $('.daterangepicker').remove();
    this._super(...arguments);
  },

  getMongoDate: function (htmlDateString) {
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

  isAnswerCriteriaValid: computed(
    'selectedTeacher',
    'selectedAssignment',
    'selectedProblem',
    'selectedSection',
    'selectedStudents.[]',
    function () {
      const utils = this.utils;
      const params = [
        'selectedTeacher',
        'selectedAssignment',
        'selectedProblem',
        'selectedSection',
        'vmtSearchText',
      ];
      for (let param of params) {
        if (this.get(param)) {
          return true;
        }
      }
      if (utils.isNonEmptyArray(this.selectedStudents)) {
        return true;
      }
      return false;
    }
  ),

  isWorkspaceSettingsValid: computed('selectedOwner', 'mode', function () {
    const params = ['selectedOwner', 'mode'];
    for (let param of params) {
      if (!this.get(param)) {
        return false;
      }
    }
    return true;
  }),

  actions: {
    changeDate: function () {
      console.log("changing date");
      console.log(this.startDate);
      console.log(this.endDate);
    },
    buildCriteria: function () {
      //clear errors if any
      let errorProps = ['isMissingCriteria', 'isInvalidDateRange'];
      _.each(errorProps, (prop) => {
        if (this.get(prop)) {
          this.set(prop, null);
        }
      });
      const utils = this.utils;
      if (!this.isAnswerCriteriaValid) {
        this.set('isMissingCriteria', true);
        return;
      }

      // let startDate = $('#startDate')
      //   .data('daterangepicker')
      //   .startDate.format('YYYY-MM-DD');
      // let endDate = $('#endDate')
      //   .data('daterangepicker')
      //   .startDate.format('YYYY-MM-DD');

      const students = this.selectedStudents;
      let studentIds;
      if (students) {
        studentIds = students.mapBy('id');
      }
      const criteria = {
        teacher: this.get('selectedTeacher.id'),
        assignment: this.get('selectedAssignment.id'),
        problem: this.get('selectedProblem.id'),
        section: this.get('selectedSection.id'),
        startDate: this.startDate,
        endDate: this.endDate,
        students: studentIds,
        doIncludeOldPows: this.doIncludeOldPows,
        isVmtOnly: this.isVmtOnly,
        vmtSearchText: this.vmtSearchText,
        isTrashedOnly: this.isTrashedOnly,
      };
      _.each(criteria, (val, key) => {
        if (utils.isNullOrUndefined(val) || val === '') {
          delete criteria[key];
        }
      });
      this.onSearch(criteria);
    },
    closeError: function (error) {
      $('.error-box').addClass('fadeOutRight');
      later(() => {
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
      let record = this.store.peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    updateSelectedStudents(val, $item) {
      if (!val) {
        return;
      }
      let selectedStudents = this.selectedStudents;
      if (_.isNull($item)) {
        // removal
        let studentToRemove = selectedStudents.findBy('id', val);
        if (studentToRemove) {
          selectedStudents.removeObject(studentToRemove);
          return;
        }
      }
      let record = this.store.peekRecord('user', val);
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
        let record = this.store.peekRecord(model, val);
        if (!record) {
          return;
        }
        prop.pushObject(record);
      }
    },
    toggleVmtFilters() {
      this.toggleProperty('showVmtFilters');
    },
  },
});
