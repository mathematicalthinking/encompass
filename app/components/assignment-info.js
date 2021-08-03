import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  utils: service('utility-methods'),

  currentAssignment: null,

  currentProblem: computed('currentAssignment.problem.content', function () {
    let assignment = this.currentAssignment;
    if (!assignment) {
      return null;
    }
    return assignment.get('problem.content');
  }),

  currentSection: computed('currentAssignment.section.content', function () {
    let assignment = this.currentAssignment;
    if (!assignment) {
      return null;
    }
    return assignment.get('section.content');
  }),

  assignmentStudents: computed(
    'currentAssignment.students.content',
    function () {
      let assignment = this.currentAssignment;
      if (!assignment) {
        return [];
      }
      return assignment.get('students.content');
    }
  ),

  didReceiveAttrs: function () {
    if (this.assignment.id !== this.currentAssignment.id) {
      this.set('currentAssignment', this.assignment);
    }
  },

  actions: {
    toAssignments: function () {
      this.sendAction('toAssignments');
    },

    toAnswerInfo: function (answer) {
      this.sendAction('toAnswerInfo', answer);
    },
  },
});
