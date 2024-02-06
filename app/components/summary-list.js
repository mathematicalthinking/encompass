import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SummaryList extends Component {
  @tracked isShowing = false;
  get sortedSubmissions() {
    const studentDataMap = new Map();

    this.args.submissions.forEach((submission) => {
      const username = submission.get('createdBy.username') || '';
      console.log(submission, 'submission in summary-list.js');
      console.log('username', username);
      const currentDate = submission.get('createDate');

      let studentData = studentDataMap.get(username);
      if (!studentData) {
        studentData = {
          newestSubmission: null,
          newestMentorResponse: null,
          responsesCount: 0,
          numOfRevisions: 0,
        };
      }

      if (
        !studentData.newestSubmission ||
        currentDate > studentData.newestSubmission.get('createDate')
      ) {
        studentData.newestSubmission = submission;
      }
      const responses = submission.get('responses');
      if (responses && responses.length > 0) {
        // Sort the responses and get the most recent one
        const mostRecentResponse = responses.sortBy('createDate').reverse()[0];
        studentData.newestResponse = mostRecentResponse;
      }

      studentData.responsesCount += submission.responses.length;
      studentData.numOfRevisions++;
      studentDataMap.set(username, studentData);
    });

    const studentDataArray = Array.from(studentDataMap.values());

    studentDataArray.sort((data1, data2) => {
      const username1 = data1.newestSubmission.get('createdBy.username');
      const username2 = data2.newestSubmission.get('createdBy.username');
      return username1.localeCompare(username2);
    });

    return studentDataArray;
  }
  get workspaceInfo() {
    let workspaceData = {};
    const assignment = this.args.workspaces.get('linkedAssignment.name');
    const workspaceOwner = this.args.workspaces.get('createdBy.username');
    const problem = this.args.workspaces.get('linkedAssignment.problem.title');
    const submissionId = this.args.workspaces.submissions.toArray()[0].id;

    if (assignment) {
      workspaceData.assignment = assignment;
    }
    if (problem) {
      workspaceData.problem = problem;
    }
    if (workspaceOwner) {
      workspaceData.workspaceOwner = workspaceOwner;
    }
    if (submissionId) {
      workspaceData.submissionId = submissionId;
    }
    return workspaceData;
  }

  @action
  toggleShowing() {
    this.isShowing = !this.isShowing;
  }
}
