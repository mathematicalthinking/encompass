import { isEmpty } from '@ember/utils';
import Component from '@ember/component';






export default Component.extend({
  matchingStudentsError: null,
  isReadyToReviewAnswers: null,

  actions: {
    reviewAnswers: function () {
      this.reviewSubmissions();
    },
    checkStatus: function () {
      let answers = this.answers;

      answers.forEach((ans) => {
        let students = ans.students;
        if (!students || isEmpty(students)) {
          this.set('isReadyToReviewAnswers', false);
          return;
        }
        this.set('isReadyToReviewAnswers', true);
      });
    }
  },


});