import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class StudentMatchingAnswerComponent extends Component {
  @service('utility-methods') utils;

  @tracked isExpanded = false;

  get answer() {
    return this.args.answer;
  }

  get image() {
    return this.answer?.explanationImage;
  }

  get selectizeInputId() {
    const id = this.image?.id || this.answer?.id || '';
    return `select-add-student${id}`;
  }

  ensureSubmissionCollections() {
    const submission = this.answer;
    if (!submission) {
      return null;
    }

    if (!Array.isArray(submission.students)) {
      set(submission, 'students', []);
    }
    if (!Array.isArray(submission.studentNames)) {
      set(submission, 'studentNames', []);
    }

    return submission;
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

  getRecordValue(record, prop) {
    if (!record) {
      return null;
    }
    if (typeof record.get === 'function') {
      return record.get(prop);
    }
    return record[prop];
  }

  getRecordId(record) {
    return (
      this.getRecordValue(record, 'id') ||
      this.getRecordValue(record, '_id') ||
      null
    );
  }

  get initialStudentItems() {
    const submission = this.ensureSubmissionCollections();
    if (!submission) {
      return [];
    }

    const userItems = this.normalizeArray(submission.students)
      .map((student) => this.getRecordId(student))
      .filter(Boolean);
    const nameItems = this.normalizeArray(submission.studentNames);

    return [...userItems, ...nameItems];
  }

  get studentOptions() {
    if (!this.args.studentMap) {
      return [];
    }

    const options = [];

    Object.values(this.args.studentMap).forEach((student) => {
      const id = this.getRecordId(student);
      if (!id) {
        return;
      }

      options.push({
        id,
        username: this.getRecordValue(student, 'username') || '',
      });
    });

    (this.args.addedStudentNames || []).forEach((name) => {
      options.push({
        id: name,
        username: name,
      });
    });

    return options;
  }

  addUnique(arrayRef, value) {
    if (!Array.isArray(arrayRef) || !value) {
      return;
    }
    if (typeof arrayRef.addObject === 'function') {
      arrayRef.addObject(value);
      return;
    }
    if (!arrayRef.includes(value)) {
      arrayRef.push(value);
    }
  }

  removeValue(arrayRef, value, matcher = null) {
    if (!Array.isArray(arrayRef)) {
      return;
    }

    if (typeof arrayRef.removeObject === 'function' && !matcher) {
      arrayRef.removeObject(value);
      return;
    }

    const index = arrayRef.findIndex((item) => {
      if (matcher) {
        return matcher(item);
      }
      return item === value;
    });

    if (index > -1) {
      arrayRef.splice(index, 1);
    }
  }

  updateAnswer(userId, doRemove) {
    if (!userId) {
      return;
    }

    const submission = this.ensureSubmissionCollections();
    if (!submission) {
      return;
    }

    let isMongoId = this.utils.isValidMongoId(userId);

    // add or remove encompass user from students array on answer object
    if (isMongoId) {
      let creators = this.normalizeArray(submission.students);
      const userObj = (this.args.studentMap || {})[userId];

      if (doRemove) {
        this.removeValue(creators, userObj, (student) => {
          return this.getRecordId(student) === userId;
        });
      } else if (userObj) {
        const existing = creators.find((student) => {
          return this.getRecordId(student) === userId;
        });
        if (!existing) {
          this.addUnique(creators, userObj);
        }
      }
      set(submission, 'students', creators);
      // add or remove string name from studentNames array on answer object
    } else {
      let creators = this.normalizeArray(submission.studentNames);
      if (doRemove) {
        this.removeValue(creators, userId);
      } else {
        this.addUnique(creators, userId);
        // keep track of which string name items have been added
        // once user creates item for one answer, it should be available on other answers to select
        this.addUnique(this.args.addedStudentNames, userId);
      }
      set(submission, 'studentNames', creators);
    }
    // keep Step 4 status in sync after any student/name mutation
    if (typeof this.args.checkStatus === 'function') {
      this.args.checkStatus();
    }
  }

  // val will either be mongo objectId of encompass user or string name added by user
  @action
  updateSelectedIds(val, item) {
    if (!val) {
      return;
    }
    const doRemove = this.utils.isNullOrUndefined(item);
    this.updateAnswer(val, doRemove);
  }

  @action
  expandImage() {
    this.isExpanded = !this.isExpanded;
  }

  // runs when creating item in selectize control
  // used for adding non encompass users which will be added to studentNames array
  @action
  addStudentName(input, cb) {
    if (typeof input !== 'string') {
      return;
    }
    let trimmed = input.trim();

    return cb({
      username: trimmed,
      id: trimmed,
    });
  }
}
