import Component from '@glimmer/component';
import { action } from '@ember/object';
// Purpose of the class component is to sort the submissions
// by the newest submission and accumulate the total responses count for each student. Normally every response is related to each submission -
// thus adding a map to store the newest submission and total responses count for each student.
export default class SummaryList extends Component {
  get sortedSubmissions() {
    // Create a map to store the newest submission and total responses count for each student
    const studentDataMap = new Map();

    // Iterate through each submission and update the map with the newest submission and accumulate total responses count for each student
    this.args.submissions.forEach((submission) => {
      const username = submission.get('createdBy.username') || '';
      const currentDate = submission.get('createDate');

      // Get the current student data from the map, or initialize it if not present
      let studentData = studentDataMap.get(username);
      if (!studentData) {
        studentData = {
          newestSubmission: null,
          responsesCount: 0,
        };
      }

      // If the username is not in the map or the submission date is newer, update the map
      if (
        !studentData.newestSubmission ||
        currentDate > studentData.newestSubmission.get('createDate')
      ) {
        studentData.newestSubmission = submission;
      }

      // Accumulate total responses count for each student
      studentData.responsesCount += submission.responses.length;

      // Update the map with the modified student data
      studentDataMap.set(username, studentData);
    });

    // Convert the map values to an array
    const studentDataArray = Array.from(studentDataMap.values());

    // Sort the array by the username
    studentDataArray.sort((data1, data2) => {
      const username1 = data1.newestSubmission.get('createdBy.username') || '';
      const username2 = data2.newestSubmission.get('createdBy.username') || '';
      return username1.localeCompare(username2);
    });

    return studentDataArray;
  }
  @action
  toggleDetailsRow(submission) {
    console.log('clicked');
    submission.showDetails = !submission.showDetails;
  }
}
