import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  dataToShow: 'assignment',
  data: computed('dataToShow', function () {
    if (this.dataToShow === 'workspace') {
      return [
        ...this.workspaces.toArray().reverse(),
        ...this.collabWorkspaces.toArray(),
      ];
    }
    if (this.dataToShow === 'assignment') {
      //create array of assignments from active sections
      return (
        this.activeSections
          .map(({ data, role }) => {
            const assignments = data.assignments.toArray();
            const activeAssignments = assignments.filter((assignment) => {
              //some assignments have no due date
              return !assignment.dueDate
                ? true
                : assignment.dueDate.getTime() >= new Date().getTime();
            });
            return { role, activeAssignments, sectionName: data.name };
          })
          //don't show class that has no assignments
          .filter((section) => section.activeAssignments.length)
      );
    }
    if (this.dataToShow === 'feedback') {
      return this.responses.toArray().reverse().splice(0, 20);
    }
    //default to empty array
    return [];
  }),
});
