import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { service } from '@ember/service';

export default class SectionInfoComponent extends ErrorHandlingComponent {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service router;
  @service store;
  @service currentUser;
  @tracked removeTeacherError = null;
  @tracked isEditingStudents = false;
  @tracked isEditingTeachers = false;
  @tracked isEditingAssignments = false;
  @tracked currentSection = null;
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
  @tracked editedSectionName = '';
  @tracked createdGroups = [];

  get groups() {
    const queriedGroups = this.args.groups?.toArray?.() || [];

    return [...queriedGroups, ...this.createdGroups].filter(
      (group, index, groups) =>
        groups.findIndex((candidate) => candidate.id === group.id) === index
    );
  }

  get groupedStudents() {
    return this.groups
      .filter((group) => !group.isTrashed)
      .map((group) => group.students.slice().map((student) => student.id))
      .flat();
  }
  @tracked newGroupName = '';
  @tracked newGroupStudents = [];

  constructor() {
    super(...arguments);
    this.setSectionAttributes();
  }

  async setSectionAttributes() {
    const section = this.args.section;
    this.currentSection = section;
    try {
      this.studentList = await section.students;
      this.teacherList = await section.teachers;
      this.organization = await section.organization;
    } catch (err) {
      this.handleErrors(err, 'dataLoadErrors');
    }
  }

  get canEdit() {
    // can only edit if created section, admin, pdadmin, or teacher

    if (this.currentUser.isStudent) {
      return false;
    }
    if (this.currentUser.isAdmin) {
      return true;
    }
    let creatorId = this.utils.getBelongsToId(this.args.section, 'createdBy');

    if (creatorId === this.currentUser.id) {
      return true;
    }

    let teacherIds = this.args.section.hasMany('teachers').ids();
    if (teacherIds.includes(this.currentUser.id)) {
      return true;
    }

    if (this.currentUser.isPdAdmin) {
      let sectionOrgId = this.utils.getBelongsToId(
        this.args.section,
        'organization'
      );
      let userOrgId = this.utils.getBelongsToId(
        this.currentUser.user,
        'organization'
      );
      return sectionOrgId === userOrgId;
    }
    return false;
  }

  get cantEdit() {
    return !this.canEdit;
  }

  get showDoneToImport() {
    return this.args.returnTo === 'import';
  }

  get studentCount() {
    return this.studentList?.length || this.args.section?.students?.length || 0;
  }

  get canReturnToImport() {
    if (!this.showDoneToImport) {
      return true;
    }
    return this.studentCount > 0;
  }

  get importReturnQueryParams() {
    const parsedStep = Number.parseInt(this.args.returnStep, 10);
    const queryParams = {
      step: Number.isInteger(parsedStep) ? parsedStep : 2,
      sectionId: this.args.section?.id || this.args.importSectionId || null,
      useClass: true,
    };

    if (this.args.importProblemId) {
      queryParams.problemId = this.args.importProblemId;
    }
    if (this.args.importUploadedFileIds) {
      queryParams.uploadedFileIds = this.args.importUploadedFileIds;
    }

    return queryParams;
  }

  clearSelectizeInput(id) {
    if (!id) {
      return;
    }
    const element = document.getElementById(id);
    const selectize = element?.selectize;
    if (!selectize) {
      return;
    }
    selectize.clear();
  }

  @tracked addTeacherQueryParams = {
    filterBy: {
      accountType: {
        $ne: 'S',
      },
    },
  };

  get initialTeacherOptions() {
    let peeked = this.store.peekAll('user').slice();
    let currentTeachers = this.teacherList.slice();
    let filtered = [];

    if (peeked && currentTeachers) {
      let teachersOnly = peeked.rejectBy('accountType', 'S');
      filtered = teachersOnly.removeObjects(currentTeachers);
      return filtered.map((obj) => {
        return {
          id: obj.id,
          username: obj.username,
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

  @action startEditingName() {
    this.editedSectionName = this.currentSection?.name || '';
    this.isEditingName = true;
  }

  @action handleFormSubmit(event) {
    event.preventDefault();
  }

  @action handleSectionNameInput(value) {
    this.editedSectionName = value;
  }

  @action handleNewGroupNameInput(value) {
    this.newGroupName = value;
  }

  @action handleSectionNameKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.updateSectionName();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.editedSectionName = this.currentSection?.name || '';
      this.isEditingName = false;
    }
  }

  @action setIsEditingAssignments(value) {
    this.isEditingAssignments = value;
  }

  @action setIsEditingTeachers(value) {
    this.isEditingTeachers = value;
  }

  @action setIsEditingStudents(value) {
    this.isEditingStudents = value;
  }

  @action hideAssignmentEditor() {
    this.showAssignment = false;
  }

  @action async saveGroup(e) {
    e.preventDefault(); //not sure why this button was causing a submit...
    if (!this.newGroupStudents.length || !this.newGroupName) {
      return this.alert.showToast('error', 'Please complete all fields');
    }
    if (this.groups.some((group) => group.name === this.newGroupName)) {
      return this.alert.showToast(
        'error',
        'Your class already has a group with this name'
      );
    }
    const savedGroup = this.store.createRecord('group');
    savedGroup.section = this.args.section;
    savedGroup.createdBy = this.currentUser.user;
    savedGroup.createDate = new Date();
    savedGroup.lastModifiedBy = this.currentUser.user;
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
      this.createdGroups = [...this.createdGroups, res];
    } catch (err) {
      console.log(err);
      this.alert.showToast('error', `${err}`, 'bottom-end', 5000, false, null);
    }
  }
  @action placeStudent(student, isSelected) {
    if (!student) {
      return;
    }

    if (isSelected) {
      if (!this.newGroupStudents.includes(student)) {
        this.newGroupStudents = [...this.newGroupStudents, student];
      }
      return;
    }

    this.newGroupStudents = this.newGroupStudents.filter((s) => s !== student);
  }
  @action async saveGroupChanges(group, { name, students }) {
    if (!group) {
      return;
    }

    const originalStudents = group.students.slice();

    group.name = name;
    group.students.setObjects(students);

    try {
      const res = await group.save();
      this.alert.showToast(
        'success',
        `group "${res.name}" updated`,
        'bottom-end',
        3000,
        false,
        null
      );
    } catch (err) {
      group.rollbackAttributes();
      group.students.setObjects(originalStudents);
      this.alert.showToast(
        'error',
        'oops there was a problem',
        3000,
        false,
        null
      );
      throw err;
    }
  }
  @action async updateGroup(group, user) {
    if (!user) return;
    try {
      group.students.removeObject(user);
      await group.save();
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

  @action removeStudent(user) {
    if (!user) {
      return;
    }

    const section = this.currentSection;
    const students = section.students;
    const selectedUser = user;

    students.removeObject(selectedUser);

    section
      .save()
      .then(() => {
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
    const section = this.currentSection;
    const teachers = this.teacherList;
    const teachersLength = teachers.length;

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
      .then(() => {
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
    section.isTrashed = true;
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

  @action updateShowAssignment() {
    return this.store
      .findAll('problem')
      .then((problems) => {
        this.problemList = problems;
        this.showAssignment = true;
        this.sectionList = [...this.sectionList, this.args.section];

        later(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      })
      .catch((err) => {
        this.handleErrors(err, 'problemLoadErrors');
      });
  }

  @action updateSectionName() {
    const section = this.currentSection;
    const newName = this.editedSectionName;

    this.isEditingName = false;

    if (!section || section.name === newName) {
      return;
    }

    section.name = newName;

    section
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
  @action addTeacher(val) {
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

  @action
  doneToImport() {
    if (!this.canReturnToImport) {
      return;
    }

    this.router.transitionTo('import', {
      queryParams: this.importReturnQueryParams,
    });
  }
}
