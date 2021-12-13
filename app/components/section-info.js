import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class SectionInfoComponent extends ErrorHandlingComponent {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service router;
  @service store;
  @tracked removeTeacherError = null;
  @tracked isEditingStudents = false;
  @tracked isEditingTeachers = false;
  @tracked organization = null;
  @tracked studentList = null;
  @tracked teacherList = null;
  @tracked showAssignment = false;
  @tracked problemList = null;
  @tracked sectionList = [];
  @tracked dataLoadErrors = [];
  @tracked updateSectionErrors = [];
  @tracked updateTeacherErrors = [];
  @tracked updateStudentErrors = [];
  @tracked queryErrors = [];
  @tracked findRecordErrors = [];
  @tracked problemLoadErrors = [];
  @tracked addGroup = false;
  @tracked isEditingName = false;
  get groupedStudents() {
    return this.args.groups
      .toArray()
      .filter((group) => !group.isTrashed)
      .map((group) => group.students.toArray().map((student) => student.id))
      .flat();
  }
  @tracked newGroupName = '';
  @tracked newGroupStudents = [];
  constructor() {
    super(...arguments);
    this.setSectionAttributes();
  }

  // didReceiveAttrs() {
  //   let section = this.currentSection;
  //   let didSectionChange = !isEqual(section, this.args.section);
  //   this.isAddingTeacher = false;

  //   if (didSectionChange) {
  //     if (this.isEditingStudents) {
  //       this.isEditingStudents = false;
  //     }

  //     if (this.isEditingTeachers) {
  //       this.isEditingTeachers = false;
  //     }
  //     return this.setSectionAttributes();
  //   }
  // }

  setSectionAttributes() {
    let section = this.args.section;
    this.currentSection = section;
    return Promise.resolve(section.get('students'))
      .then((students) => {
        this.studentList = students;
        return section.get('teachers');
      })
      .then((teachers) => {
        this.teacherList = teachers;
        return section.get('organization');
      })
      .then((org) => {
        this.organization = org;
      })
      .catch((err) => {
        this.handleErrors(err, 'dataLoadErrors');
      });
  }

  get canEdit() {
    // can only edit if created section, admin, pdadmin, or teacher

    if (this.args.currentUser.isStudent) {
      return false;
    }
    if (this.args.currentUser.isAdmin) {
      return true;
    }
    let creatorId = this.utils.getBelongsToId(this.args.section, 'createdBy');

    if (creatorId === this.args.currentUser.id) {
      return true;
    }

    let teacherIds = this.args.section.hasMany('teachers').ids();
    if (teacherIds.includes(this.args.currentUser.id)) {
      return true;
    }

    if (this.args.currentUser.isPdAdmin) {
      let sectionOrgId = this.utils.getBelongsToId(
        this.args.section,
        'organization'
      );
      let userOrgId = this.utils.getBelongsToId(
        this.args.currentUser,
        'organization'
      );
      return sectionOrgId === userOrgId;
    }
    return false;
  }

  get cantEdit() {
    return !this.canEdit;
  }

  clearSelectizeInput(id) {
    if (!id) {
      return;
    }
    let selectize = $(`#${id}`)[0].selectize;
    if (!selectize) {
      return;
    }
    selectize.clear();
  }

  // scrollIfEditingStudents: observer('isEditingStudents', function () {
  //   if (this.isEditingStudents) {
  //     later(() => {
  //       $('html, body').animate({
  //         scrollTop: $(document).height(),
  //       });
  //     }, 100);
  //   }
  // }),

  @tracked addTeacherQueryParams = {
    filterBy: {
      accountType: {
        $ne: 'S',
      },
    },
  };

  get initialTeacherOptions() {
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
  }

  @action toggleAddGroup() {
    if (!this.studentList.length) {
      return this.alert.showToast('error', 'Please add students to class');
    }
    return (this.addGroup = !this.addGroup);
  }
  @action async saveGroup(e) {
    e.preventDefault(); //not sure why this button was causing a submit...
    if (!this.newGroupStudents.length || !this.newGroupName) {
      return this.alert.showToast('error', 'Please complete all fields');
    }
    if (this.args.groups.mapBy('name').includes(this.newGroupName)) {
      return this.alert.showToast(
        'error',
        'Your class already has a group with this name'
      );
    }
    const savedGroup = this.store.createRecord('group');
    savedGroup.section = this.args.section;
    savedGroup.createdBy = this.args.currentUser;
    savedGroup.createDate = new Date();
    savedGroup.lastModifiedBy = this.args.currentUser;
    savedGroup.lastModifiedDate = new Date();
    savedGroup.name = this.newGroupName;
    savedGroup.students = this.newGroupStudents;
    try {
      const res = await savedGroup.save();
      this.newGroupName = '';
      this.newGroupStudents = [];
      this.alert.showToast(
        'success',
        `group "${res.name}" created`,
        'bottom-end',
        3000,
        false,
        null
      );
      this.args.groups.addObject(savedGroup);
    } catch (err) {
      console.log(err);
      this.alert.showToast('error', `${err}`, 'bottom-end', 5000, false, null);
    }
  }
  @action async placeStudent(student) {
    if (this.newGroupStudents.includes(student)) {
      return this.newGroupStudents.removeObject(student);
    }
    return this.newGroupStudents.pushObject(student);
  }
  @action async updateGroup(group, user) {
    if (!user) return;
    try {
      group.students.removeObject(user);
      const res = await group.save();
      this.alert.showToast(
        'success',
        `${user.username} removed`,
        'bottom-end',
        3000,
        false,
        null
      );
    } catch (err) {
      this.alert.showToast(
        'error',
        'oops there was a problem',
        3000,
        false,
        null
      );
    }
  }
  @action async deleteGroup(group) {
    if (!group) return;
    try {
      group.isTrashed = true;
      const res = await group.save();
      this.alert.showToast(
        'success',
        `${res.name} deleted`,
        'bottom-end',
        3000,
        false,
        null
      );
    } catch (err) {
      console.log(err);
      this.alert.showToast(
        'error',
        'could not delete',
        'bottom-end',
        3000,
        false,
        null
      );
    }
  }
  @action updateGroupDraft(student) {
    return this.newGroup.students.removeObject(student);
  }
  @action removeStudent(user) {
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
  }

  @action removeTeacher(user) {
    let section = this.currentSection;
    let teachers = this.teacherList;
    let teachersLength = teachers.get('length');

    if (teachersLength > 1) {
      teachers.removeObject(user);
    } else {
      this.removeTeacherError = true;
      later(() => {
        this.removeTeacherError = false;
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
  }

  @action confirmDelete() {
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to delete this class?',
        'This may interfere with any work you have already created.',
        'Yes, delete it'
      )
      .then((result) => {
        if (result.value) {
          this.deleteSection();
        }
      });
  }

  @action deleteSection() {
    const section = this.args.section;
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
        this.router.transitionTo('sections');
      })
      .catch((err) => {
        this.handleErrors(err, 'updateSectionErrors', section);
      });
  }

  @action toAssignmentInfo(assignment) {
    this.router.transitionTo('assignments.assignment', assignment.id);
  }

  @action updateShowAssignment() {
    return this.store
      .findAll('problem')
      .then((problems) => {
        this.problemList = problems;
        this.showAssignment = true;
        this.sectionList.pushObject(this.args.section);

        later(() => {
          $('html, body').animate({
            scrollTop: $(document).height(),
          });
        }, 100);
      })
      .catch((err) => {
        this.handleErrors(err, 'problemLoadErrors');
      });
  }

  @action updateSectionName() {
    this.isEditingName = false;
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
  }
  @action addTeacher(val, $item) {
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
  }
}
