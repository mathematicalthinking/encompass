/**
 * # Index Controller
 * @description This is the controller for the Index view. It receives the model from the Index Route and filters the data according to the selected date bound (this.currentBound). It also controls the display (this.showTable) and which data to display (this.dataToShow). It renders home-page components.
 * @author Tim Leonard <tleonard@21pstem.org>
 * @since 3.1.0
 */

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @tracked dataToShow = 'workspace';
  @tracked currentBound = 'oneWeek';
  @tracked showTable = true;
  dateBounds = {
    oneWeek: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7
    ),
    oneMonth: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    ),
    sixMonths: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 6,
      new Date().getDate()
    ),
    schoolYear:
      new Date().getMonth() > 7
        ? new Date(new Date().getFullYear(), 7)
        : new Date(new Date().getFullYear() - 1, 7),
    allTime: new Date(2012),
  };
  get tableColumns() {
    if (this.dataToShow === 'workspace') {
      return [
        { name: 'Workspace', valuePath: 'name' },
        { name: 'Owner', valuePath: 'owner.username' },
        { name: 'Submissions', valuePath: 'submissionsLength' },
        { name: 'Selections', valuePath: 'selectionsLength' },
        { name: 'Comments', valuePath: 'commentsLength' },
        { name: 'Last Updated', valuePath: 'lastModifiedDate' },
      ];
    }
    if (this.dataToShow === 'assignment') {
      return [
        { name: 'Assignment', valuePath: 'name' },
        { name: 'Problem', valuePath: 'problem.title' },
        { name: 'Assigned', valuePath: 'assignedDate' },
        { name: 'Due', valuePath: 'dueDate' },
        { name: 'To Do', valuePath: 'name' },
      ];
    }
    if (this.dataToShow === 'feedback') {
      return [
        { name: 'Recipient', valuePath: 'recipient.displayName' },
        { name: 'Sent By', valuePath: 'createdBy.displayName' },
        { name: 'Workspace', valuePath: 'workspace.name' },
        { name: 'Type', valuePath: 'responseType' },
        { name: 'Created', valuePath: 'createDate' },
        { name: 'Status', valuePath: 'status' },
      ];
    }
    //getter must return a value
    return [];
  }
  get data() {
    if (this.dataToShow === 'workspace') {
      return [
        {
          label: 'Mine',
          details: this.model.workspaces
            .toArray()
            .filter(
              (workspace) =>
                workspace.lastModifiedDate.getTime() >
                this.dateBounds[this.currentBound].getTime()
            ),
        },
        {
          label: 'Collaborative',
          details: this.model.collabWorkspaces
            .toArray()
            .filter(
              (workspace) =>
                workspace.lastModifiedDate.getTime() >
                this.dateBounds[this.currentBound].getTime()
            ),
        },
      ];
    }
    if (this.dataToShow === 'assignment') {
      //create array of assignments from active sections
      return this.model.userSections.map(({ section, assignments, role }) => {
        const filtered = assignments.toArray().filter((assignment) => {
          return !assignment.dueDate
            ? true
            : assignment.dueDate.getTime() >
                this.dateBounds[this.currentBound].getTime();
        });
        return { role, details: filtered, label: section.name };
      });
    }
    if (this.dataToShow === 'feedback') {
      const responses = this.model.responses
        .toArray()
        .reverse()
        .filter(
          (response) =>
            response.createDate.getTime() >
            this.dateBounds[this.currentBound].getTime()
        )
        .map((response) => {
          return {
            name: response.get('recipient.username'),
            recipient: response.recipient,
            createdBy: response.createdBy,
            workspace: response.workspace,
            responseType: response.responseType,
            createDate: response.createDate,
            status: response.status,
          };
        });
      const responsesReceived = this.model.responsesReceived
        .toArray()
        .reverse()
        .filter(
          (response) =>
            response.createDate.getTime() >
            this.dateBounds[this.currentBound].getTime()
        )
        .map((response) => {
          return {
            name: response.student,
            recipient: response.student,
            createdBy: response.createdBy,
            workspace: response.workspace,
            responseType: response.responseType,
            createDate: response.createDate,
            status: response.status,
            submission: response.submission,
          };
        });
      return [
        { label: 'Given', details: responses },
        { label: 'Received', details: responsesReceived },
      ];
    }
    //getter must return a value
    return [];
  }
  @action updateCurrentBound(e) {
    this.currentBound = e.target.value;
  }
}
