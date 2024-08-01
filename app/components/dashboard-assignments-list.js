import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { action, computed } from '@ember/object';

export default class DashBoardAssignmentsListComponent extends Component {
  @service currentUser;
  @service store;
  @service('utility-methods') utils;

  sortCriterion = {
    name: 'A-Z',
    sortParam: { param: 'name', direction: 'asc' },
    icon: 'fas fa-sort-alpha-down sort-icon',
    type: 'name',
  };

  sortOptions = {
    name: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { param: 'name', direction: 'asc' },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'name',
      },
      {
        name: 'Z-A',
        sortParam: { param: 'name', direction: 'desc' },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'name',
      },
    ],
    class: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { param: 'linkedAssignment.section.name', direction: 'asc' },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'class',
      },
      {
        name: 'Z-A',
        sortParam: {
          param: 'linkedAssignment.section.name',
          direction: 'desc',
        },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'class',
      },
    ],
    assignedDate: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: { param: 'assignedDate', direction: 'asc' },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'assignedDate',
      },
      {
        name: 'Oldest',
        sortParam: { param: 'assignedDate', direction: 'desc' },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'assignedDate',
      },
    ],
    dueDate: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: { param: 'dueDate', direction: 'asc' },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'dueDate',
      },
      {
        name: 'Oldest',
        sortParam: { param: 'dueDate', direction: 'desc' },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'dueDate',
      },
    ],
    status: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: { param: 'answers.length', direction: 'asc' },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'status',
      },
      {
        name: 'Oldest',
        sortParam: { param: 'answers.length', direction: 'desc' },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'status',
      },
    ],
  };

  constructor() {
    super(...arguments);
    this.filterAssignments();
  }

  @observer('assignments.@each.isTrashed', 'currentUser.isStudent')
  filterAssignments() {
    let currentUser = this.currentUser.user;
    let filtered = this.assignments.filter((assignment) => {
      return assignment.id && !assignment.isTrashed;
    });
    filtered = filtered.sortBy('createDate').reverse();
    this.set('assignmentList', filtered);
  }

  get yourList() {
    const date = new Date();
    let currentUser = this.currentUser.user;

    return this.assignments.filter((assignment) => {
      let userId = currentUser.id;
      const assignedStudents = assignment.students.content.currentState.map(
        (student) => student.id
      );

      return (
        !assignment.assignedDate ||
        (assignedStudents.includes(userId) &&
          !assignment.isTrashed &&
          assignment.assignedDate.getTime() < date.getTime())
      );
    });
  }

  @computed('sortCriterion')
  get sortedProblems() {
    let sortValue = this.sortCriterion.sortParam.param || 'name';
    let sortDirection = this.sortCriterion.sortParam.direction || 'asc';
    let sorted;

    if (this.yourList) {
      sorted = this.yourList.sortBy(sortValue);
    }

    if (sortDirection === 'desc') {
      return sorted.reverse();
    }

    return sorted;
  }

  @action
  updateSortCriterion(criterion) {
    this.sortCriterion = criterion;
  }
}
