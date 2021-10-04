import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DashboardClassesListComponent extends Component {
  @service('utility-methods') utils;
  @tracked tableHeight = '';
  @tracked sortCriterion = {
    name: 'A-Z',
    sortParam: { param: 'createDateAnswer', direction: 'asc' },
    icon: 'fas fa-sort-alpha-down sort-icon',
    type: 'createDateAnswer',
  };
  sortOptions = {
    name: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { param: 'problem.title', direction: 'asc' },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'name',
      },
      {
        name: 'Z-A',
        sortParam: { param: 'problem.title', direction: 'desc' },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'name',
      },
    ],
    classes: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: {
          param: 'section.name',
          direction: 'asc',
        },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'classes',
      },
      {
        name: 'Z-A',
        sortParam: {
          param: 'section.name',
          direction: 'desc',
        },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'classes',
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
    submissions: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: {
          param: 'answers.length',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'submissions',
      },
      {
        name: 'Oldest',
        sortParam: {
          param: 'answers.length',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'submissions',
      },
    ],
    createDateAnswer: [
      { sortParam: null, icon: '' },
      {
        id: 3,
        name: 'Newest',
        sortParam: {
          param: 'createDateAnswer',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'createDateAnswer',
      },
      {
        id: 4,
        name: 'Oldest',
        sortParam: {
          param: 'createDateAnswer',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'createDateAnswer',
      },
    ],
  };
  get cleanSections() {
    return this.args.sections.rejectBy('isTrashed');
  }
  get yourAssignments() {
    let yourSections = this.cleanSections.filter((section) => {
      let creatorId = this.utils.getBelongsToId(section, 'createdBy');
      return creatorId === this.args.user.id;
    });

    const yourSectionIds = yourSections.map((section) => section.id);

    let assignmentsList = this.args.assignments.filter((assignment) =>
      yourSectionIds.includes(assignment.section.get('id'))
    );
    assignmentsList.forEach((assignment) => {
      if (assignment.answers.length) {
        // loop through answers and create new property with latest answer create date
        let createDate;
        const latestAnswerA = assignment.answers.sortBy('createDate');
        if (latestAnswerA[0]) {
          createDate = latestAnswerA[0].createDate;
        }

        assignment.createDateAnswer = createDate;
      }
    });

    // Return list of assignments, add section name, id to each
    return assignmentsList;
  }
  get sortedClasses() {
    let sortValue = this.sortCriterion.sortParam.param || 'createDateAnswer';
    let sortDirection = this.sortCriterion.sortParam.direction || 'asc';
    let sorted;
    if (this.yourAssignments.length) {
      sorted = this.yourAssignments.sortBy(sortValue);
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
