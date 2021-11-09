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
      return [
        ...this.assignments
          .toArray()
          .filter(
            (assignment) =>
              assignment.get('createdBy.id') === this.user.id &&
              !assignment.isTrashed
          )
          .reverse()
          .slice(0, 10)
          .map((assignment) => {
            assignment.todo = 'Review Student Work';
            return assignment;
          }),
        ...this.user.assignments
          .toArray()
          .filter((assignment) => !assignment.isTrashed)
          .reverse()
          .slice(0, 10)
          .map((assignment) => {
            assignment.todo = 'Answer Problem';
            return assignment;
          }),
      ];
    }
    if (this.dataToShow === 'feedback') {
      return this.responses.toArray().reverse().splice(0, 20);
    }
    return [];
  }),
});
