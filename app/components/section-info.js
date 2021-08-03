import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { not } from '@ember/object/computed';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'section-info',
  className: ['section-info'],
  alert: service('sweet-alert'),
  utils: service('utility-methods'),

  removeTeacherError: null,
  isEditingStudents: false,
  isEditingTeachers: false,
  organization: null,
  studentList: null,
  teacherList: null,
  showAssignment: false,
  problemList: null,
  sectionList: [],
  sectionToDelete: null,
  pending: '<p>Loading results...</p>',
  notFound: '<p>No matching users.</p>',
  dataLoadErrors: [],
  updateSectionErrors: [],
  updateTeacherErrors: [],
  updateStudentErrors: [],
  queryErrors: [],
  findRecordErrors: [],
  problemLoadErrors: [],

  init: function () {
    this._super(...arguments);
    return this.setSectionAttributes().then(() => {});
  },

  didReceiveAttrs: function () {
    let section = this.currentSection;
    let didSectionChange = !isEqual(section, this.section);
    this.set('isEditing', false);
    this.set('isAddingTeacher', false);

    if (didSectionChange) {
      if (this.isEditingStudents) {
        this.set('isEditingStudents', false);
      }

      if (this.isEditingTeachers) {
        this.set('isEditingTeachers', false);
      }
      return this.setSectionAttributes();
    }
  },

  setSectionAttributes: function () {
    let section = this.section;
    this.set('currentSection', section);
    return Promise.resolve(section.get('students'))
      .then((students) => {
        this.set('studentList', students);
        return section.get('teachers');
      })
      .then((teachers) => {
        this.set('teacherList', teachers);
        return section.get('organization');
      })
      .then((org) => {
        this.set('organization', org);
      })
      .catch((err) => {
        this.handleErrors(err, 'dataLoadErrors');
      });
  },

  canEdit: computed(
    'currentUser.actingRole',
    'currentUser.accountType',
    'section.teachers',
    'section.organization',
    function () {
      // can only edit if created section, admin, pdadmin, or teacher

      if (this.currentUser.isStudent) {
        return false;
      }
      if (this.currentUser.isAdmin) {
        return true;
      }
      let creatorId = this.utils.getBelongsToId(this.section, 'createdBy');

      if (creatorId === this.currentUser.id) {
        return true;
      }

      let teacherIds = this.section.hasMany('teachers').ids();
      if (teacherIds.includes(this.currentUser.id)) {
        return true;
      }

      if (this.currentUser.isPdAdmin) {
        let sectionOrgId = this.utils.getBelongsToId(
          this.section,
          'organization'
        );
        let userOrgId = this.utils.getBelongsToId(
          this.currentUser,
          'organization'
        );
        return sectionOrgId === userOrgId;
      }
      return false;
    }
  ),

  cantEdit: not('canEdit'),

  clearSelectizeInput(id) {
    if (!id) {
      return;
    }
    let selectize = this.$(`#${id}`)[0].selectize;
    if (!selectize) {
      return;
    }
    selectize.clear();
  },

  scrollIfEditingStudents: observer('isEditingStudents', function () {
    if (this.isEditingStudents) {
      later(() => {
        $('html, body').animate({
          scrollTop: $(document).height(),
        });
      }, 100);
    }
  }),

  addTeacherQueryParams: {
    filterBy: {
      accountType: {
        $ne: 'S',
      },
    },
  },

  initialTeacherOptions: computed('teacherList.[]', function () {
    let peeked = this.store.peekAll('user').toArray();
    let currentTeachers = this.teacherList.toArray();
    let filtered = [];

    if (peeked && currentTeachers) {
      let teachersOnly = peeked.rejectBy('accountType', 'S');
      filtered = teachersOnly.removeObjects(currentTeachers);
      return filtered.map((obj) => {
        return {
          id: obj.get('id'),
          username: obj.get('username'),
        };
      });
    }
    return filtered;
  }),

  actions: {
    removeStudent: function (user) {
      if (!user) {
        return;
      }

      let section = this.currentSection;
      let students = section.get('students');
      let selectedUser = user;

      students.removeObject(selectedUser);

      section
        .save()
        .then((section) => {
          this.alert.showToast(
            'success',
            'Student Removed',
            'bottom-end',
            3000,
            false,
            null
          );
        })
        .catch((err) => {
          this.handleErrors(err, 'updateSectionErrors', section);
        });
    },

    removeTeacher: function (user) {
      let section = this.currentSection;
      let teachers = this.teacherList;
      let teachersLength = teachers.get('length');

      if (teachersLength > 1) {
        teachers.removeObject(user);
      } else {
        this.set('removeTeacherError', true);
        later(() => {
          this.set('removeTeacherError', false);
        }, 3000);
        return;
      }

      section
        .save()
        .then((section) => {
          this.alert.showToast(
            'success',
            'Teacher Removed',
            'bottom-end',
            3000,
            false,
            null
          );
        })
        .catch((err) => {
          this.handleErrors(err, 'updateSectionErrors');
        });
    },

    confirmDelete: function () {
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this class?',
          'This may interfere with any work you have already created.',
          'Yes, delete it'
        )
        .then((result) => {
          if (result.value) {
            this.send('deleteSection');
          }
        });
    },

    deleteSection: function () {
      const section = this.section;
      section.set('isTrashed', true);
      return section
        .save()
        .then(() => {
          this.alert.showToast(
            'success',
            'Class Deleted',
            'bottom-end',
            3000,
            false,
            null
          );
          this.sendAction('toSectionList');
        })
        .catch((err) => {
          this.set('sectionToDelete', null);
          this.handleErrors(err, 'updateSectionErrors', section);
        });
    },

    toAssignmentInfo: function (assignment) {
      this.sendAction('toAssignmentInfo', assignment);
    },

    showAssignment: function () {
      return this.store
        .findAll('problem')
        .then((problems) => {
          this.set('problemList', problems);
          this.set('showAssignment', true);
          this.sectionList.pushObject(this.section);

          later(() => {
            $('html, body').animate({
              scrollTop: $(document).height(),
            });
          }, 100);
        })
        .catch((err) => {
          this.handleErrors(err, 'problemLoadErrors');
        });
    },

    updateSectionName: function () {
      this.set('isEditingName', false);
      let section = this.currentSection;
      if (section.get('hasDirtyAttributes')) {
        this.currentSection
          .save()
          .then(() => {
            this.alert.showToast(
              'success',
              'Class Name Updated',
              'bottom-end',
              3000,
              false,
              null
            );
          })
          .catch((err) => {
            this.handleErrors(err, 'updateSectionErrors', section);
          });
      }
    },
    addTeacher: function (val, $item) {
      if (!val) {
        return;
      }
      let teacher = this.store.peekRecord('user', val);

      if (!teacher) {
        return;
      }

      let section = this.currentSection;

      let teachers = this.teacherList;

      if (!teachers.includes(teacher)) {
        teachers.addObject(teacher);

        section
          .save()
          .then(() => {
            this.alert.showToast(
              'success',
              'Teacher Added',
              'bottom-end',
              3000,
              false,
              null
            );
            this.clearSelectizeInput('select-add-teacher');
          })
          .catch((err) => {
            this.handleErrors(err, 'updateSectionErrors', section);
          });
      }
    },
  },
});
