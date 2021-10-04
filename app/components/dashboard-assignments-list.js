import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Component.extend({
  currentUser: service(),
  store: service(),
  utils: service('utility-methods'),
  sortCriterion: {
    name: 'A-Z',
    sortParam: { param: 'name', direction: 'asc' },
    icon: 'fas fa-sort-alpha-down sort-icon',
    type: 'name',
  },
  sortOptions: {
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
        sortParam: {
          param: 'linkedAssignment.section.name',
          direction: 'asc',
        },
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
        sortParam: {
          param: 'assignedDate',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'assignedDate',
      },
      {
        name: 'Oldest',
        sortParam: {
          param: 'assignedDate',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'assignedDate',
      },
    ],
    dueDate: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: {
          param: 'dueDate',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'dueDate',
      },
      {
        name: 'Oldest',
        sortParam: {
          param: 'dueDate',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'dueDate',
      },
    ],
    status: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: {
          param: 'answers.length',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'status',
      },
      {
        name: 'Oldest',
        sortParam: {
          param: 'answers.length',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'status',
      },
    ],
  },
  didReceiveAttrs: function () {
    this.filterAssignments();
  },

  filterAssignments: observer(
    'assignments.@each.isTrashed',
    'currentUser.isStudent',
    function () {
      let currentUser = this.get('currentUser.user');
      let filtered = this.assignments.filter((assignment) => {
        return assignment.id && !assignment.get('isTrashed');
      });
      filtered = filtered.sortBy('createDate').reverse();
      if (currentUser.get('accountType') === 'S') {
        // what is this if block for?
        // console.log('current user is a student');
      }
      // let currentDate = new Date();
      this.set('assignmentList', filtered);
    }
  ),

  yourList: function () {
    const date = new Date();

    let currentUser = this.get('currentUser.user');
    let yourList = this.assignments.filter((assignment) => {
      let userId = currentUser.get('id');
      const assignedStudents = assignment
        .get('students')
        .content.currentState.map((student) => student.id);
      if (!assignment.get('assignedDate')) {
        return true;
      }
      return (
        assignedStudents.includes(userId) &&
        !assignment.get('isTrashed') &&
        assignment.get('assignedDate').getTime() < date.getTime()
      );
    });

    return yourList;
  },

  sortedProblems: function () {
    let sortValue = this.get('sortCriterion.sortParam.param') || 'name';
    let sortDirection = this.get('sortCriterion.sortParam.direction') || 'asc';
    let sorted;
    if (this.yourList()) {
      sorted = this.yourList().sortBy(sortValue);
    }
    if (sortDirection === 'desc') {
      return sorted.reverse();
    }

    return sorted;
  }.property('sortCriterion'),
  actions: {
    updateSortCriterion(criterion) {
      this.set('sortCriterion', criterion);
    },
  },
});
