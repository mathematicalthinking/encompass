import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';

export default class AssignmentInfoTeacherComponent extends ErrorHandlingComponent {
  @tracked formattedDueDate = null;
  @tracked formattedAssignedDate = null;
  @tracked isEditing = false;
  @tracked isPreparingReport = false;
  @tracked htmlDateFormat = 'YYYY-MM-DD';
  @tracked displayDateFormat = 'MMM Do YYYY';
  @tracked assignmentToDelete = null;
  @tracked dataFetchErrors = [];
  @tracked findRecordErrors = [];
  @tracked updateRecordErrors = [];
  @tracked areLinkedWsExpanded = true;
  @tracked showParentWsForm = false;
  @tracked showLinkedWsForm = false;
  @tracked areSubmissionsExpanded = true;
  @tracked cachedProblem = [];
  get showProblemInput() {
    return this.isEditing && this.canEditProblem;
  }
  get showSectionInput() {
    return this.isEditing && this.canEditProblem;
  }
  get showAssignedDateInput() {
    return this.isEditing && this.canEditAssignedDate;
  }
  get showDueDateInput() {
    return this.isEditing && this.canEditDueDate;
  }
  get hideParentWsForm() {
    return !this.showParentWsForm;
  }
  get hideLinkedWsForm() {
    return !this.showLinkedWsForm;
  }
  get allStudentsHaveWs() {
    return this.studentsWithoutWorkspaces.length === 0;
  }
  get allGroupsHaveWs() {
    return this.groupsWithoutWorkspaces.length === 0;
  }
  @service store;
  @service router;
  @service('sweet-alert') alert;
  @service('assignment-permissions') permissions;
  @service('utility-methods') utils;

  get hasLinkedWorkspaces() {
    return this.args.assignment.linkedWorkspaces.length > 0;
  }
  get doesNotHaveLinkedWs() {
    return !this.hasLinkedWorkspaces;
  }

  get showFullLinkedWsMsg() {
    return this.missingWorkspaces.length
      ? this.isEditing && this.allGroupsHaveWs
      : this.isEditing && this.allStudentsHaveWs;
  }
  get showNoParentWsMsg() {
    return this.isEditing && this.doesNotHaveLinkedWs;
  }

  constructor() {
    super(...arguments);
    // get all sections and problems
    // only need to get these on init because user won't be creating new sections or problems from this component

    this.cachedProblems = this.store.peekAll('problem');
  }

  get isYourOwn() {
    let creatorId = this.utils.getBelongsToId(
      this.args.assignment,
      'createdBy'
    );
    return this.args.currentUser.id === creatorId;
  }

  get isDirty() {
    let answerIds = this.utils.getHasManyIds(this.args.assignment, 'answers');
    return this.utils.isNonEmptyArray(answerIds);
  }

  get isClean() {
    return !this.isDirty;
  }

  get canDelete() {
    return this.permissions.canDelete(this.args.assignment);
  }

  get canEdit() {
    const isAdmin = this.args.currentUser.isAdmin;
    const isClean = this.isClean;
    const isYourOwn = this.isYourOwn;

    return isAdmin || (isClean && isYourOwn);
  }
  get isReadOnly() {
    return !this.canEdit;
  }

  get canEditDueDate() {
    return this.hasBasicEditPrivileges;
  }

  get canEditAssignedDate() {
    return this.permissions.canEditAssignedDate(this.args.assignment);
  }

  get canEditProblem() {
    return this.permissions.canEditProblem(this.args.assignment, this.section);
  }

  get hasBasicEditPrivileges() {
    return (
      this.permissions.getPermissionsLevel(this.args.assignment, this.section) >
      0
    );
  }

  get isBeforeAssignedDate() {
    // true if assignedDate is in future
    const currentDate = new Date();
    const assignedDate = this.args.assignment.assignedDate;
    return currentDate < assignedDate;
  }

  get canEditDate() {
    const isAdmin = this.args.currentUser.isAdmin;
    const canEdit = this.canEdit;
    const isBeforeAssignedDate = this.isBeforeAssignedDate;
    return isAdmin || (canEdit && isBeforeAssignedDate);
  }

  get isDateLocked() {
    return !this.canEditDate;
  }

  getMongoDate(htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    return new Date(dateMoment);
  }

  getEndDate(htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD HH:mm';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    let date = new Date(dateMoment);
    date.setHours(23, 59, 59);
    return date;
  }

  get showEditButton() {
    return (
      !this.isEditing && this.hasBasicEditPrivileges && !this.showParentWsForm
    );
  }

  get problemOptions() {
    let cachedProblems = this.cachedProblems;
    let toArray = cachedProblems.toArray();
    return toArray.map((cachedProblem) => {
      return {
        id: cachedProblem.id,
        title: cachedProblem.get('title'),
      };
    });
  }
  get sectionOptions() {
    let sections = this.args.sections || [];
    let toArray = sections.toArray();
    return toArray.map((section) => {
      return {
        id: section.id,
        name: section.get('name'),
      };
    });
  }

  get initialProblemItem() {
    return [this.args.assignment.get('problem.id')];
  }

  get initialSectionItem() {
    return [this.args.assignment.get('section.id')];
  }

  get showAddParentWsBtn() {
    return (
      this.isEditing &&
      this.hasBasicEditPrivileges &&
      this.hideParentWsForm &&
      this.hasLinkedWorkspaces &&
      !this.hasParentWorkspace
    );
  }
  get showAddLinkedWsBtn() {
    return (
      this.isEditing &&
      this.hasBasicEditPrivileges &&
      this.hideLinkedWsForm &&
      this.missingWorkspaces.length
    );
  }

  get showReport() {
    return !this.showParentWsForm;
  }

  get hasParentWorkspace() {
    let workspaceId = this.utils.getBelongsToId(
      this.args.assignment,
      'parentWorkspace'
    );
    return this.utils.isValidMongoId(workspaceId);
  }

  get displayListsOptions() {
    let areLinkedWsExpanded = this.areLinkedWsExpanded;
    let areSubmissionsExpanded = this.areSubmissionsExpanded;

    let toHide = 'fas fa-chevron-down';
    let toShow = 'fas fa-chevron-left';
    return {
      linkedWs: {
        icon: areLinkedWsExpanded ? toHide : toShow,
      },
      submissions: {
        icon: areSubmissionsExpanded ? toHide : toShow,
      },
    };
  }

  get studentsWithoutWorkspaces() {
    let students = this.args.studentList || [];
    let existingWorkspaces = this.args.linkedWorkspaces || [];

    return students.reject((student) => {
      return existingWorkspaces.find((ws) => {
        let ownerId = this.utils.getBelongsToId(ws, 'owner');
        return ownerId === student.get('id');
      });
    });
  }

  get groupsWithoutWorkspaces() {
    const existingWorkspaces = this.args.linkedWorkspaces || [];
    const groups = this.args.groups.filter((group) => {
      const found = existingWorkspaces.find(
        (ws) => group.id === ws.get('group.id')
      );
      return !found;
    });
    return groups;
  }

  get linkedByGroup() {
    return this.args.assignment.linkedWorkspacesRequest.linkType === 'group';
  }

  get missingWorkspaces() {
    if (this.args.assignment.linkedWorkspacesRequest.linkType === 'group') {
      return this.groupsWithoutWorkspaces;
    }
    if (
      this.args.assignment.linkedWorkspacesRequest.linkType === 'individual'
    ) {
      return this.studentsWithoutWorkspaces;
    }
    return [
      ...this.groupsWithoutWorkspaces.toArray(),
      ...this.studentsWithoutWorkspaces.toArray(),
    ];
  }

  @action editAssignment() {
    this.isEditing = true;
  }

  @action showDeleteModal() {
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to delete this assignment?',
        null,
        'Yes, delete it'
      )
      .then((result) => {
        if (result.value) {
          this.deleteAssignment();
        }
      });
  }

  @action deleteAssignment() {
    const assignment = this.args.assignment;
    assignment.set('isTrashed', true);
    return assignment
      .save()
      .then((assignment) => {
        this.assignmentToDelete = null;
        this.alert
          .showToast(
            'success',
            'Assignment Deleted',
            'bottom-end',
            5000,
            true,
            'Undo'
          )
          .then((result) => {
            if (result.value) {
              assignment.set('isTrashed', false);
              assignment.save().then(() => {
                this.alert.showToast(
                  'success',
                  'Assignment Restored',
                  'bottom-end',
                  5000,
                  false,
                  null
                );
                window.history.back();
              });
            }
          });
        this.router.transitionTo('assignments');
      })
      .catch((err) => {
        this.assignmentToDelete = null;
        this.handleErrors(err, 'updateRecordErrors', assignment);
      });
  }

  @action updateAssignment() {
    let isAddingLinkedWs = this.showLinkedWsForm;
    let isAddingParentWs = this.showParentWsForm;

    if (isAddingLinkedWs || isAddingParentWs) {
      let msg = `Please finish or cancel adding of ${
        isAddingLinkedWs ? 'Linked Workspaces' : 'Parent Workspace'
      }`;
      return this.alert.showToast(
        'error',
        msg,
        'bottom-end',
        3000,
        false,
        null
      );
    }

    const assignment = this.args.assignment;

    if (
      !this.args.assignment.get('problem') ||
      !this.args.assignment.get('section')
    ) {
      return this.alert.showToast(
        'error',
        'Class and Problem are required',
        'bottom-end',
        3000,
        false,
        null
      );
    }

    let dueDate;
    let assignedDate;
    let endDate;
    let startDate;

    let assignedDateEditVal = this.assignedDateEditVal;
    let dueDateEditVal = this.dueDateEditVal;

    if (this.canEditAssignedDate) {
      if (assignedDateEditVal) {
        startDate = this.args.assignment.assignedDate;

        assignedDate = this.getMongoDate(startDate);
      }
    } else {
      assignedDate = this.args.assignment.assignedDate;
    }

    if (this.canEditDueDate) {
      if (dueDateEditVal) {
        endDate = this.args.assignment.dueDate;

        dueDate = this.getEndDate(endDate);
      } else {
        dueDate = this.args.assignment.dueDate;
      }
    }

    if (assignedDate && dueDate && assignedDate > dueDate) {
      this.invalidDateRange = true;
      return;
    } else {
      if (this.invalidDateRange) {
        this.invalidDateRange = null;
      }
    }

    if (assignment.get('hasDirtyAttributes')) {
      // never creating workspaces from this function
      assignment.set('linkedWorkspacesRequest', { doCreate: false });
      assignment.set('parentWorkspaceRequest', { doCreate: false });

      return assignment
        .save()
        .then(() => {
          this.alert.showToast(
            'success',
            'Assignment Updated',
            'bottom-end',
            4000,
            false,
            null
          );
          this.assignmentUpdateSuccess = true;
          $('.daterangepicker').remove();
          this.isEditing = false;
          return;
        })
        .catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', assignment);
        });
    } else {
      this.alert.showToast(
        'info',
        'No changes to save',
        'bottom-end',
        3000,
        false,
        null
      );
      this.args.assignment.rollbackAttributes();
      this.isEditing = false;
      $('.daterangepicker').remove();
    }
  }
  @action stopEditing() {
    let isAddingLinkedWs = this.showLinkedWsForm;
    let isAddingParentWs = this.showParentWsForm;

    if (isAddingLinkedWs || isAddingParentWs) {
      let title = `Are you sure you want to stop editing of this assignment?`;
      let info = `Your ${
        isAddingLinkedWs ? 'Linked Workspaces have' : 'Parent Workspace has'
      } not been created.`;
      return this.alert
        .showModal('question', title, info, 'Yes, stop editing')
        .then((result) => {
          if (result.value) {
            if (isAddingLinkedWs) {
              this.showLinkedWsForm = false;
            }
            if (isAddingParentWs) {
              this.showParentWsForm = false;
            }
            this.isEditing = false;
            $('.daterangepicker').remove();
          }
        });
    } else {
      this.isEditing = false;
      $('.daterangepicker').remove();
    }
    this.args.assignment.rollbackAttributes();
  }
  @action updateSelectizeSingle(val, $item, propToUpdate, model) {
    let errorProp = `${model}FormErrors`;
    this[errorProp] = [];

    if ($item === null) {
      this.args[propToUpdate] = null;
      return;
    }
    let record = this.store.peekRecord(model, val);
    if (!record) {
      return;
    }
    if (propToUpdate === 'section') {
      this.args.assignment.section = record;
    } else if (propToUpdate === 'problem') {
      this.args.assignment.problem = record;
    }
  }
  @action handleCreatedParentWs(assignment) {
    if (assignment) {
      this.alert.showToast(
        'success',
        'Parent Workspace Created',
        'bottom-end',
        3000,
        false,
        null
      );
    }
  }
  @action handleCreatedLinkedWs(assignment) {
    if (assignment) {
      this.alert.showToast(
        'success',
        'Linked Workspaces Created',
        'bottom-end',
        3000,
        false,
        null
      );
    }
  }
  @action toggleProperty(propName) {
    if (typeof propName !== 'string') {
      return;
    }
    this[propName] = !this[propName];
  }
  @action updateAssignedDate(event) {
    this.args.assignment.assignedDate = new Date(
      event.target.value.replace(/-/g, '/')
    );
  }

  @action updateDueDate(event) {
    this.args.assignment.dueDate = new Date(
      event.target.value.replace(/-/g, '/')
    );
  }
}
