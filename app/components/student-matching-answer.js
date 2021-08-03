import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { inject as service } from '@ember/service';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  classNames: ['student-matching-answer'],
  utils: service('utility-methods'),

  section: null,
  submission: null,
  isExpanded: false,
  selectedIds: [],

  selectizeInputId: computed('answer.id', function () {
    let id = this.get('answer.explanationImage.id') || '';
    return `select-add-student${id}`;
  }),

  didReceiveAttrs: function () {
    const section = this.selectedSection;
    const answer = this.answer;
    const image = answer.explanationImage;
    this.set('image', image);

    this.set('section', section);
    this.set('submission', answer);

    if (!Array.isArray(this.get('submission.students'))) {
      this.set('submission.students', []);
    }
    if (!Array.isArray(this.get('submission.studentNames'))) {
      this.set('submission.studentNames', []);
    }
  },

  initialStudentItems: computed(
    'submission.students.[]',
    'submission.studentNames.[]',
    function () {
      let userItems = this.get('submission.students').mapBy('id');
      let nameItems = this.get('submission.studentNames');
      return userItems.pushObjects(nameItems);
    }
  ),

  studentOptions: computed(
    'selectedIds.[]',
    'studentMap',
    'addedStudentNames.[]',
    function () {
      if (!this.studentMap) {
        return [];
      }
      let options = [];
      let selectedIds = this.selectedIds || [];

      _.each(this.studentMap, (val, key) => {
        if (!selectedIds.includes(val)) {
          options.addObject({
            id: val.get('id'),
            username: val.get('username'),
          });
        }
      });
      _.each(this.addedStudentNames, (name) => {
        options.addObject({
          id: name,
          username: name,
        });
      });
      return options;
    }
  ),

  updateAnswer(userId, doRemove) {
    if (!userId) {
      return;
    }

    let isMongoId = this.utils.isValidMongoId(userId);

    let creators;
    let userObj;

    // add or remove encompass user from students array on answer object
    if (isMongoId) {
      creators = this.get('submission.students');
      userObj = creators.findBy('id', userId);
      if (doRemove) {
        creators.removeObject(userObj);
      } else {
        creators.addObject(this.studentMap[userId]);
      }
      // add or remove string name from studentNames array on answer object
    } else {
      creators = this.get('submission.studentNames');
      userObj = creators.find((name) => {
        return name === userObj;
      });
      if (doRemove) {
        creators.removeObject(userObj);
      } else {
        creators.addObject(userId);
        // keep track of which string name items have been added
        // once user creates item for one answer, it should be available on other answers to select
        this.addedStudentNames.addObject(userId);
      }
    }
    // check if all answers have been assigned at least one student
    this.checkStatus();
  },

  actions: {
    //val will either be mongo objectId of encompass user or string name added by user
    updateSelectedIds: function (val, $item) {
      if (!val) {
        return;
      }
      let doRemove;
      if (_.isNull($item)) {
        this.selectedIds.removeObject(val);
        doRemove = true;
      } else {
        this.selectedIds.addObject(val);
        doRemove = false;
      }

      this.updateAnswer(val, doRemove);
    },
    expandImage: function () {
      this.set('isExpanded', !this.isExpanded);
    },

    // runs when creating item in selectize control
    // used for adding non encompass users which will be added to studentNames array
    addStudentName: function (input, cb) {
      if (typeof input !== 'string') {
        return;
      }
      let trimmed = input.trim();

      return cb({
        username: trimmed,
        id: trimmed,
      });
    },
  },
});
