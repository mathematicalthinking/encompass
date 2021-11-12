import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  dataToShow: 'workspace',
  currentBound: 'allTime',
  dateBounds: {
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
  },
  tableColumns: computed('dataToShow', function () {
    if (this.dataToShow === 'workspace') {
      return [
        { name: 'Workspace', valuePath: 'name' },
        { name: 'owner', valuePath: 'owner.username' },
        { name: 'submissions', valuePath: 'submissionsLength' },
        { name: 'selections', valuePath: 'selectionsLength' },
        { name: 'comments', valuePath: 'commentsLength' },
        { naem: 'Last Updated', valuePath: 'lastModifiedDate' },
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
        { name: 'Workspaces', valuePath: 'workspace.name' },
        { name: 'Type', valuePath: 'responseType' },
        { name: 'Created', valuePath: 'createDate' },
        { name: 'Due', valuePath: 'dueDate' },
        { name: 'Status', valuePath: 'status' },
      ];
    }
  }),
  data: computed('dataToShow', 'currentBound', function () {
    if (this.dataToShow === 'workspace') {
      return [
        {
          label: 'My Workspaces',
          workspaces: this.workspaces
            .toArray()
            .filter(
              (workspace) =>
                workspace.lastModifiedDate.getTime() >
                this.dateBounds[this.currentBound].getTime()
            ),
        },
        {
          label: 'My Collab Workspaces',
          workspaces: this.collabWorkspaces
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
      return (
        this.userSections
          .map(({ section, assignments, role }) => {
            const filtered = assignments.toArray().filter((assignment) => {
              return !assignment.dueDate
                ? true
                : assignment.dueDate.getTime() >
                    this.dateBounds[this.currentBound].getTime();
            });
            return { role, assignments: filtered, sectionName: section.name };
          })
          //don't show class that has no assignments
          .filter((section) => section.assignments.length)
      );
    }
    if (this.dataToShow === 'feedback') {
      return this.responses
        .toArray()
        .reverse()
        .filter(
          (response) =>
            response.createDate.getTime() >
            this.dateBounds[this.currentBound].getTime()
        );
    }
    //default to empty array
    return [];
  }),

  actions: {
    updateCurrentBound(e) {
      this.set('currentBound', e.target.value);
    },
  },
});
