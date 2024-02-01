import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SummaryList extends Component {
  @tracked isShowing = false;
  get sortedSubmissions() {
    const studentDataMap = new Map();

    this.args.submissions.forEach((submission) => {
      const username = submission.get('createdBy.username') || '';
      const currentDate = submission.get('createDate');

      let studentData = studentDataMap.get(username);
      if (!studentData) {
        studentData = {
          newestSubmission: null,
          responsesCount: 0,
        };
      }

      if (
        !studentData.newestSubmission ||
        currentDate > studentData.newestSubmission.get('createDate')
      ) {
        studentData.newestSubmission = submission;
      }

      studentData.responsesCount += submission.responses.length;

      studentDataMap.set(username, studentData);
    });

    const studentDataArray = Array.from(studentDataMap.values());

    studentDataArray.sort((data1, data2) => {
      const username1 = data1.newestSubmission.get('createdBy.username') || '';
      const username2 = data2.newestSubmission.get('createdBy.username') || '';
      return username1.localeCompare(username2);
    });

    return studentDataArray;
  }

  @action
  toggleShowing() {
    this.isShowing = !this.isShowing;
  }
}
