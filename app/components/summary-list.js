import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SummaryList extends Component {
  @tracked isShowing = false;
  get sortedSubmissions() {
    const studentDataMap = new Map();

    this.args.submissions.forEach((submission) => {
      let username = '';
      if (submission.get('createdBy.username')) {
        username = submission.get('createdBy.username');
      } else if (submission.get('creator.username')) {
        username = submission.get('creator.username');
      } else {
        username = '';
      }

      const currentDate = submission.get('createDate');

      let studentData = studentDataMap.get(username);
      if (!studentData) {
        studentData = {
          newestSubmission: null,
          id: null,
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
        studentData.responsesCount += responses.filter(
          (response) => response.text
        ).length;

        const mostRecentResponse = responses.sortBy('createDate').reverse()[0];
        studentData.newestResponse = mostRecentResponse;
      }

      studentData.responsesCount += submission.responses.length;
      studentData.numOfRevisions++;
      studentData.id = submission.id;
      studentDataMap.set(username, studentData);
    });

    const studentDataArray = Array.from(studentDataMap.values());

    studentDataArray.sort((data1, data2) => {
      const username1 = getUsername(data1.newestSubmission);
      const username2 = getUsername(data2.newestSubmission);
      return username1.localeCompare(username2);
    });

    // Add a separate function to get the username based on the available properties
    function getUsername(newestSubmission) {
      if (newestSubmission) {
        return (
          newestSubmission.get('createdBy.username') ||
          newestSubmission.get('creator.username')
        );
      }
    }

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
    } else {
      workspaceData.assignment = this.args.workspaces.name;
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
