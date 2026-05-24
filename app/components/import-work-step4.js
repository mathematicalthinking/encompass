import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ImportWorkStep4Component extends Component {
  @service('utility-methods') utils;
  @service('sweet-alert') alert;

  @tracked addedStudentNames = [];
  @tracked isMatchingIncompleteError = null;
  @tracked isReadyToReviewAnswers = false;

  get answers() {
    return Array.isArray(this.args.answers) ? this.args.answers : [];
  }

  get selectedSection() {
    return this.args.selectedSection || null;
  }

  get selectedValue() {
    return this.args.selectedValue === true;
  }

  get studentMap() {
    return this.args.studentMap || null;
  }

  get displayList() {
    if (!this.studentMap) {
      return [];
    }
    return Object.keys(this.studentMap).map((key) => this.studentMap[key]);
  }

  @action
  addStudentNameFilter(name) {
    if (typeof name !== 'string') {
      return false;
    }
    let trimmed = name.trim();
    let names = this.addedStudentNames;
    return trimmed.length > 1 && !names.includes(trimmed);
  }

  normalizeArray(val) {
    if (Array.isArray(val)) {
      return val;
    }
    if (typeof val?.slice === 'function') {
      return val.slice();
    }
    return [];
  }

  getRecordId(record) {
    if (!record) {
      return null;
    }
    return (
      record.id ||
      record._id ||
      record.userId ||
      (typeof record.get === 'function'
        ? record.get('id') || record.get('_id') || record.get('userId')
        : null)
    );
  }

  areArraysEqual(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right)) {
      return false;
    }
    if (left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; i++) {
      if (left[i] !== right[i]) {
        return false;
      }
    }
    return true;
  }

  getStudentById(id) {
    if (!id || !this.studentMap) {
      return null;
    }
    const normalizedId = String(id);
    if (this.studentMap[normalizedId]) {
      return this.studentMap[normalizedId];
    }
    let mapKeys = Object.keys(this.studentMap);
    for (let key of mapKeys) {
      let student = this.studentMap[key];
      let candidateId = this.getRecordId(student);
      if (String(candidateId) === normalizedId) {
        return student;
      }
    }
    return null;
  }

  syncAnswerMatchesFromUI() {
    this.answers.forEach((answer) => {
      const image =
        answer?.explanationImage ||
        (typeof answer?.get === 'function'
          ? answer.get('explanationImage')
          : null);
      const imageId = this.getRecordId(image);
      const inputId = `select-add-student${imageId || ''}`;
      const inputEl =
        typeof document !== 'undefined'
          ? document.getElementById(inputId)
          : null;

      let values = [];
      if (inputEl?.selectize && Array.isArray(inputEl.selectize.items)) {
        values = inputEl.selectize.items.slice();
      } else if (inputEl && Array.isArray(inputEl.value)) {
        values = inputEl.value;
      } else if (
        typeof inputEl?.value === 'string' &&
        inputEl.value.length > 0
      ) {
        values = inputEl.value.split(',');
      }

      let students = [];
      let studentNames = [];
      values.forEach((value) => {
        if (!value) {
          return;
        }
        let trimmed = typeof value === 'string' ? value.trim() : value;
        if (!trimmed) {
          return;
        }

        if (this.utils.isValidMongoId(trimmed)) {
          const student = this.getStudentById(trimmed);
          if (student) {
            students.push(student);
            return;
          }
        }
        studentNames.push(trimmed);
      });

      let currentStudents = this.normalizeArray(answer.students);
      let currentStudentIds = currentStudents
        .map((student) => this.getRecordId(student))
        .filter(Boolean);
      let nextStudentIds = students
        .map((student) => this.getRecordId(student))
        .filter(Boolean);

      if (!this.areArraysEqual(currentStudentIds, nextStudentIds)) {
        set(answer, 'students', students);
      }

      let currentStudentNames = this.normalizeArray(answer.studentNames).map(
        (name) => (typeof name === 'string' ? name.trim() : name)
      );
      let nextStudentNames = studentNames.map((name) =>
        typeof name === 'string' ? name.trim() : name
      );

      if (!this.areArraysEqual(currentStudentNames, nextStudentNames)) {
        set(answer, 'studentNames', studentNames);
      }
    });
  }

  isReadyToProceed() {
    return (
      this.answers.length > 0 &&
      this.answers.every((ans) => {
        return (
          this.normalizeArray(ans.students).length > 0 ||
          this.normalizeArray(ans.studentNames).length > 0
        );
      })
    );
  }

  updateMatchingStatus() {
    this.syncAnswerMatchesFromUI();
    let isReady = this.isReadyToProceed();
    if (isReady && this.isMatchingIncompleteError) {
      this.isMatchingIncompleteError = null;
    }
    this.isReadyToReviewAnswers = isReady;
    return isReady;
  }

  @action
  resetMatchingIncompleteError() {
    this.isMatchingIncompleteError = null;
  }

  @action
  refreshStudents() {
    if (typeof this.args.onRefreshStudents === 'function') {
      this.args.onRefreshStudents();
    }
  }

  @action
  addAddedStudentName(name) {
    if (typeof name !== 'string') {
      return;
    }

    let trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    let names = this.normalizeArray(this.addedStudentNames);
    if (names.includes(trimmed)) {
      return;
    }

    this.addedStudentNames = [...names, trimmed];
  }

  @action
  checkStatus() {
    return this.updateMatchingStatus();
  }

  @action
  next() {
    let isReady = this.updateMatchingStatus();
    if (isReady) {
      if (typeof this.args.onProceed === 'function') {
        this.args.onProceed();
      }
      if (typeof this.args.goToStep === 'function') {
        this.args.goToStep(5);
      }
      return;
    }

    this.isMatchingIncompleteError = true;
    this.alert.showToast(
      'error',
      'Please match at least one student/name for each submission',
      'bottom-end',
      3000,
      false,
      null
    );
  }

  @action
  back() {
    if (typeof this.args.onBack === 'function') {
      this.args.onBack(-1);
    }
  }
}
