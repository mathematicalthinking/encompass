import Component from '@ember/component';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'assignment-info-student',

  utils: service('utility-methods'),

  formattedDueDate: null,
  formattedAssignedDate: null,
  isResponding: false,
  isRevising: false,
  displayedAnswer: null,
  loadAnswerErrors: [],

  didReceiveAttrs() {
    let assignment = this.assignment;

    if (assignment) {
      if (this.displayedAnswer) {
        this.set('displayedAnswer', null);
      }

      this.toggleResponse();

      let dateTime = 'YYYY-MM-DD';
      let dueDate = assignment.get('dueDate');
      let assignedDate = assignment.get('assignedDate');

      if (dueDate) {
        this.set('formattedDueDate', moment(dueDate).format(dateTime));
      }
      if (assignedDate) {
        this.set(
          'formattedAssignedDate',
          moment(assignedDate).format(dateTime)
        );
      }
    }

    this._super(...arguments);
  },

  workspacesToUpdateIds: computed(
    'assignment.linkedWorkspaces.[]',
    function () {
      return this.utils.getHasManyIds(this.assignment, 'linkedWorkspaces');
    }
  ),

  isComposing: computed('isRevising', 'isResponding', function () {
    return this.isRevising || this.isResponding;
  }),

  showReviseButton: computed('isComposing', 'sortedList.[]', function () {
    return !this.isComposing && this.get('sortedList.length') > 0;
  }),

  showRespondButton: computed('isComposing', 'sortedList.[]', function () {
    return !this.isComposing && this.get('sortedList.length') === 0;
  }),

  sortedList: computed('answerList.[]', function () {
    if (!this.answerList) {
      return [];
    }
    return this.answerList.sortBy('createDate').reverse();
  }),

  priorAnswer: computed('sortedList.[]', function () {
    return this.sortedList.get('firstObject');
  }),

  toggleResponse: function () {
    if (this.isResponding) {
      this.set('isResponding', false);
    } else if (this.isRevising) {
      this.set('isRevising', false);
    }
  },

  actions: {
    beginAssignmentResponse: function () {
      this.set('isResponding', true);
      later(() => {
        $('html, body').animate({ scrollTop: $(document).height() });
      }, 100);
    },

    reviseAssignmentResponse: function () {
      this.set('isRevising', true);

      later(() => {
        $('html, body').animate({ scrollTop: $(document).height() });
      }, 100);
    },

    toAnswerInfo: function (answer) {
      this.sendAction('toAnswerInfo', answer);
    },

    displayAnswer: function (answer) {
      this.set('displayedAnswer', answer);
      later(() => {
        $('html, body').animate({ scrollTop: $(document).height() });
      }, 100);
    },

    handleCreatedAnswer: function (answer) {
      this.toggleResponse();
      this.answerList.addObject(answer);
    },

    cancelResponse: function () {
      this.toggleResponse();
    },
  },
});
