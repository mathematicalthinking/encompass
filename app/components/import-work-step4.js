import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { service } from '@ember/service';

export default Component.extend({
  elementId: 'import-work-step4',
  utils: service('utility-methods'),
  alert: service('sweet-alert'),

  addedStudentNames: [],

  init() {
    this._super(...arguments);
    this.set('newNameFilter', this.addStudentNameFilter.bind(this));
  },

  displayList: computed('studentMap', function () {
    if (!this.studentMap) {
      return [];
    }
    return Object.keys(this.studentMap).map((key) => this.studentMap[key]);
  }),

  addStudentNameFilter: function (name) {
    if (typeof name !== 'string') {
      return;
    }
    let trimmed = name.trim();
    let names = this.addedStudentNames;
    return trimmed.length > 1 && !names.includes(trimmed);
  },

  normalizeArray(val) {
    if (Array.isArray(val)) {
      return val;
    }
    if (typeof val?.toArray === 'function') {
      return val.toArray();
    }
    return [];
  },

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
  },

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
  },

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
  },

  syncAnswerMatchesFromUI() {
    let answers = Array.isArray(this.answers) ? this.answers : [];
    answers.forEach((answer) => {
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
  },

  isReadyToProceed() {
    let answers = this.answers;
    return (
      Array.isArray(answers) &&
      answers.length > 0 &&
      answers.every((ans) => {
        return (
          this.normalizeArray(ans.students).length > 0 ||
          this.normalizeArray(ans.studentNames).length > 0
        );
      })
    );
  },

  updateMatchingStatus() {
    this.syncAnswerMatchesFromUI();
    let isReady = this.isReadyToProceed();
    if (isReady && this.isMatchingIncompleteError) {
      this.set('isMatchingIncompleteError', null);
    }
    this.set('isReadyToReviewAnswers', isReady);
    return isReady;
  },

  actions: {
    refreshStudents() {
      if (typeof this.onRefreshStudents === 'function') {
        this.onRefreshStudents();
      }
    },
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

      this.set('addedStudentNames', [...names, trimmed]);
    },
    checkStatus: function () {
      return this.updateMatchingStatus();
    },
    next() {
      let isReady = this.updateMatchingStatus();
      if (isReady) {
        if (typeof this.onProceed === 'function') {
          this.onProceed();
        }
        if (typeof this.goToStep === 'function') {
          this.goToStep(5);
        }
      } else {
        this.set('isMatchingIncompleteError', true);
        this.alert.showToast(
          'error',
          'Please match at least one student/name for each submission',
          'bottom-end',
          3000,
          false,
          null
        );
      }
    },
    back() {
      this.onBack(-1);
    },
  },
});
