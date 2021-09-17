import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, equal, gt, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
/* eslint-disable complexity */
import { isEqual } from '@ember/utils';
import $ from 'jquery';
import moment from 'moment';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'assignment-info-teacher',
  classNameBindings: ['isEditing:is-editing'],
  formattedDueDate: null,
  formattedAssignedDate: null,
  isEditing: false,
  isDisplaying: not('isEditing'),
  // showReport: false,
  isPreparingReport: false,
  htmlDateFormat: 'YYYY-MM-DD',
  displayDateFormat: 'MMM Do YYYY',
  assignmentToDelete: null,
  dataFetchErrors: [],
  findRecordErrors: [],
  updateRecordErrors: [],
  areLinkedWsExpanded: true,
  showParentWsForm: false,
  showLinkedWsForm: false,
  areLinkedWsHidden: not('areLinkedWsExpanded'),
  areSubmissionsExpanded: true,
  areSubmissionsHidden: not('areSubmissionsExpanded'),
  showProblemInput: and('isEditing', 'canEditProblem'),
  showSectionInput: and('isEditing', 'canEditProblem'),
  showAssignedDateInput: and('isEditing', 'canEditAssignedDate'),
  showDueDateInput: and('isEditing', 'canEditDueDate'),
  hideParentWsForm: not('showParentWsForm'),
  hideLinkedWsForm: not('showLinkedWsForm'),
  allStudentsHaveWs: equal('studentsWithoutWorkspaces.length', 0),
  allGroupsHaveWs: equal('groupsWithoutWorkspaces.length', 0),

  alert: service('sweet-alert'),
  permissions: service('assignment-permissions'),
  utils: service('utility-methods'),

  hasLinkedWorkspaces: gt('assignment.linkedWorkspaces.length', 0),
  doesNotHaveLinkedWs: not('hasLinkedWorkspaces'),

  showFullLinkedWsMsg: computed(
    'isEditing',
    'allStudentsHaveWs',
    'allGroupsHaveWs',
    function () {
      return this.linkedByGroup
        ? this.isEditing && this.allGroupsHaveWs
        : this.isEditing && this.allStudentsHaveWs;
    }
  ),
  showNoParentWsMsg: and('isEditing', 'doesNotHaveLinkedWs'),

  init: function () {
    this._super(...arguments);
    // get all sections and problems
    // only need to get these on init because user won't be creating new sections or problems from this component

    this.set('cachedProblems', this.store.peekAll('problem'));

    return this.store
      .findAll('section')
      .then((sections) => {
        if (this.isDestroying || this.isDestroyed) {
          return;
        }
        this.set('sections', sections);
      })
      .catch((err) => {
        if (this.isDestroying || this.isDestroyed) {
          return;
        }
        this.handleErrors(err, 'dataFetchErrors');
      });
  },

  didReceiveAttrs: function () {
    const assignment = this.assignment;
    if (this.get('currentAssignment.id') !== this.get('assignment.id')) {
      this.set('currentAssignment', assignment);

      this.set('isEditing', false);

      let dateFormat = this.htmlDateFormat;
      let dueDate = this.assignment.get('dueDate');
      let assignedDate = this.assignment.get('assignedDate');
      this.set('selectedProblem', this.problem);
      this.set('selectedSection', this.section);

      this.set('assignmentName', assignment.get('name'));

      if (dueDate) {
        this.set('formattedDueDate', moment(dueDate).format(dateFormat));
      }

      if (assignedDate) {
        this.set(
          'formattedAssignedDate',
          moment(assignedDate).format(dateFormat)
        );
      }
    }
  },

  isYourOwn: computed('assignment.id', 'currentUser.id', function () {
    let creatorId = this.utils.getBelongsToId(this.assignment, 'createdBy');
    return this.get('currentUser.id') === creatorId;
  }),

  isDirty: computed('assignment.answers.[]', function () {
    let answerIds = this.utils.getHasManyIds(this.assignment, 'answers');
    return this.utils.isNonEmptyArray(answerIds);
  }),

  isClean: not('isDirty'),

  canDelete: computed(
    'currentUser.actingRole',
    'assignment.answers[]',
    function () {
      return this.permissions.canDelete(this.assignment);
    }
  ),

  canEdit: computed('isClean', 'isYourOwn', function () {
    const isAdmin = this.get('currentUser.isAdmin');
    const isClean = this.isClean;
    const isYourOwn = this.isYourOwn;

    return isAdmin || (isClean && isYourOwn);
  }),
  isReadOnly: not('canEdit'),

  canEditDueDate: computed('hasBasicEditPrivileges', function () {
    return this.hasBasicEditPrivileges;
  }),

  canEditAssignedDate: computed('assignment.assignedDate', function () {
    return this.permissions.canEditAssignedDate(this.assignment);
  }),

  canEditProblem: computed(
    'sortedAnswers.[]',
    'hasBasicEditPrivileges',
    'currentUser.actingRole',
    function () {
      return this.permissions.canEditProblem(this.assignment, this.section);
    }
  ),

  hasBasicEditPrivileges: computed(
    'section.teachers.[]',
    'currentUser.actingRole',
    'assignment',
    function () {
      return (
        this.permissions.getPermissionsLevel(this.assignment, this.section) > 0
      );
    }
  ),

  isBeforeAssignedDate: computed(
    'assignment.id',
    'assignment.assignedDate',
    function () {
      // true if assignedDate is in future
      const currentDate = new Date();
      const assignedDate = this.assignment.get('assignedDate');
      return currentDate < assignedDate;
    }
  ),

  canEditDate: computed('isBeforeAssignedDate', 'canEdit', function () {
    const isAdmin = this.get('currentUser.isAdmin');
    const canEdit = this.canEdit;
    const isBeforeAssignedDate = this.isBeforeAssignedDate;
    return isAdmin || (canEdit && isBeforeAssignedDate);
  }),

  isDateLocked: not('canEditDate'),

  getMongoDate: function (htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    return new Date(dateMoment);
  },

  getEndDate: function (htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD HH:mm';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    let date = new Date(dateMoment);
    date.setHours(23, 59, 59);
    return date;
  },

  showEditButton: computed(
    'hasBasicEditPrivileges',
    'isEditing',
    'showParentWsForm',
    function () {
      return (
        !this.isEditing && this.hasBasicEditPrivileges && !this.showParentWsForm
      );
    }
  ),

  problemOptions: computed('cachedProblems.[]', function () {
    let cachedProblems = this.cachedProblems;
    let toArray = cachedProblems.toArray();
    return toArray.map((cachedProblem) => {
      return {
        id: cachedProblem.id,
        title: cachedProblem.get('title'),
      };
    });
  }),
  sectionOptions: computed('sections.[]', function () {
    let sections = this.sections || [];
    let toArray = sections.toArray();
    return toArray.map((section) => {
      return {
        id: section.id,
        name: section.get('name'),
      };
    });
  }),

  initialProblemItem: computed('selectedProblem', function () {
    if (this.get('selectedProblem.id')) {
      return [this.get('selectedProblem.id')];
    }
    return [];
  }),

  initialSectionItem: computed('selectedSection', function () {
    if (this.get('selectedSection.id')) {
      return [this.get('selectedSection.id')];
    }
    return [];
  }),

  showAddParentWsBtn: computed(
    'hasBasicEditPrivileges',
    'isEditing',
    'hideParentWsForm',
    'hasParentWorkspace',
    'hasLinkedWorkspaces',
    function () {
      return (
        this.isEditing &&
        this.hasBasicEditPrivileges &&
        this.hideParentWsForm &&
        this.hasLinkedWorkspaces &&
        !this.hasParentWorkspace
      );
    }
  ),
  showAddLinkedWsBtn: computed(
    'isEditing',
    'hasBasicEditPrivileges',
    'hideLinkedWsForm',
    'allStudentsHaveWs',
    'allGroupsHaveWs',
    'linkedByGroup',
    function () {
      if (this.linkedByGroup) {
        return (
          this.isEditing &&
          this.hasBasicEditPrivileges &&
          this.hideLinkedWsForm &&
          !this.allGroupsHaveWs
        );
      } else {
        return (
          this.isEditing &&
          this.hasBasicEditPrivileges &&
          this.hideLinkedWsForm &&
          !this.allStudentsHaveWs
        );
      }
    }
  ),

  showReport: computed('showParentWsForm', function () {
    return !this.showParentWsForm;
  }),

  hasParentWorkspace: computed('assignment.parentWorkspace', function () {
    let workspaceId = this.utils.getBelongsToId(
      this.assignment,
      'parentWorkspace'
    );
    return this.utils.isValidMongoId(workspaceId);
  }),

  displayListsOptions: computed(
    'areLinkedWsExpanded',
    'areSubmissionsExpanded',
    function () {
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
  ),

  studentsWithoutWorkspaces: computed(
    'studentList.[]',
    'linkedWorkspaces.[]',
    function () {
      let students = this.studentList || [];
      let existingWorkspaces = this.linkedWorkspaces || [];

      return students.reject((student) => {
        return existingWorkspaces.find((ws) => {
          let ownerId = this.utils.getBelongsToId(ws, 'owner');
          return ownerId === student.get('id');
        });
      });
    }
  ),

  groupsWithoutWorkspaces: computed(
    'groups',
    'linkedWorkspaces.[]',
    function () {
      const existingWorkspaces = this.linkedWorkspaces || [];
      return this.groups.reject((group) => {
        return existingWorkspaces.find((ws) => {
          let ownerId = this.utils.getBelongsToId(ws, 'group');
          return ownerId === group.get('id');
        });
      });
    }
  ),

  linkedByGroup: computed('assignment', function () {
    return this.assignment.linkedWorkspacesRequest.linkType === 'group';
  }),

  actions: {
    editAssignment: function () {
      let assignedDate = this.get('assignment.assignedDate');
      let dueDate = this.get('assignment.dueDate');
      let format = this.htmlDateFormat;

      let autoUpdateAssigned =
        assignedDate !== null && assignedDate !== undefined;
      let autoUpdateDue = dueDate !== null && dueDate !== undefined;

      // $(function () {
      //   $('input#assignedDate').daterangepicker(
      //     {
      //       singleDatePicker: true,
      //       showDropdowns: true,
      //       autoUpdateInput: autoUpdateAssigned,
      //     },
      //     function (start, end, label) {
      //       let assignedDate = start.format(format);
      //       $('input#assignedDate').val(assignedDate);
      //     }
      //   );
      //   $('input#dueDate').daterangepicker(
      //     {
      //       singleDatePicker: true,
      //       showDropdowns: true,
      //       autoUpdateInput: autoUpdateDue,
      //     },
      //     function (start, end, label) {
      //       let dueDate = start.format(format);
      //       $('input#dueDate').val(dueDate);
      //     }
      //   );

      //   let assignedInputVal = assignedDate
      //     ? moment(assignedDate).format(format)
      //     : '';
      //   let dueInputVal = dueDate ? moment(dueDate).format(format) : '';

      this.set('assignedDateEditVal', this.formattedAssignedDate);
      this.set('dueDateEditVal', this.formattedDueDate);

      //   $('input#assignedDate').val(assignedInputVal);
      //   $('input#dueDate').val(dueInputVal);

      //   $('input[name="daterange"]').attr('placeholder', 'mm/dd/yyyy');
      // });

      this.set('isEditing', true);
    },

    showDeleteModal: function () {
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this assignment?',
          null,
          'Yes, delete it'
        )
        .then((result) => {
          if (result.value) {
            this.send('deleteAssignment');
          }
        });
    },

    deleteAssignment: function () {
      const assignment = this.assignment;
      assignment.set('isTrashed', true);
      return assignment
        .save()
        .then((assignment) => {
          this.set('assignmentToDelete', null);
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
          this.sendAction('toAssignments');
          $('.daterangepicker').remove();
        })
        .catch((err) => {
          this.set('assignmentToDelete', null);
          this.handleErrors(err, 'updateRecordErrors', assignment);
        });
    },

    updateAssignment: function () {
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

      const assignment = this.assignment;

      let selectedProblem = this.selectedProblem;
      let selectedSection = this.selectedSection;

      if (!selectedProblem || !selectedSection) {
        return this.alert.showToast(
          'error',
          'Class and Problem are required',
          'bottom-end',
          3000,
          false,
          null
        );
      }

      let currentProblem = this.problem;
      let currentSection = this.section;

      let didProblemChange = !isEqual(selectedProblem, currentProblem);
      let didSectionChange = !isEqual(selectedSection, currentSection);

      let didRelationshipsChange = didProblemChange || didSectionChange;

      const name = this.assignmentName;
      assignment.set('name', name);

      if (didProblemChange) {
        assignment.set('problem', selectedProblem);
      }
      if (didSectionChange) {
        assignment.set('section', selectedSection);
      }

      let dueDate;
      let assignedDate;
      let endDate;
      let startDate;

      let htmlDateFormat = this.htmlDateFormat;

      let currentAssignedDate = this.get('assignment.assignedDate');
      let currentDueDate = this.get('assignment.dueDate');

      let currentAssignedFmt = currentAssignedDate
        ? moment(currentAssignedDate).format(htmlDateFormat)
        : undefined;
      let currentDueFmt = currentDueDate
        ? moment(currentDueDate).format(htmlDateFormat)
        : undefined;

      let assignedDateEditVal = this.assignedDateEditVal;
      let dueDateEditVal = this.dueDateEditVal;

      if (this.canEditAssignedDate) {
        if (assignedDateEditVal) {
          startDate = this.assignedDateEditVal;

          assignedDate = this.getMongoDate(startDate);
        }
      } else {
        assignedDate = this.get('assignment.assignedDate');
      }

      if (this.canEditDueDate) {
        if (dueDateEditVal) {
          endDate = this.dueDateEditVal;

          dueDate = this.getEndDate(endDate);
        } else {
          dueDate = this.get('assignment.dueDate');
        }
      }

      if (assignedDate && dueDate && assignedDate > dueDate) {
        this.set('invalidDateRange', true);
        return;
      } else {
        if (this.invalidDateRange) {
          this.set('invalidDateRange', null);
        }
      }

      let areDueDatesSame =
        (!currentDueDate && !dueDateEditVal) ||
        currentDueFmt === dueDateEditVal;
      let areAssignedDatesSame =
        (!currentAssignedDate && !assignedDateEditVal) ||
        currentAssignedFmt === assignedDateEditVal;

      if (!areDueDatesSame) {
        assignment.set('dueDate', dueDate);
      }

      if (!areAssignedDatesSame) {
        assignment.set('assignedDate', assignedDate);
      }

      if (assignment.get('hasDirtyAttributes') || didRelationshipsChange) {
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
            this.set('assignmentUpdateSuccess', true);
            $('.daterangepicker').remove();
            this.set('isEditing', false);
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

        this.set('isEditing', false);
        $('.daterangepicker').remove();
      }
    },
    stopEditing: function () {
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
                this.set('showLinkedWsForm', false);
              }
              if (isAddingParentWs) {
                this.set('showParentWsForm');
              }
              this.set('isEditing', false);
              $('.daterangepicker').remove();
            }
          });
      } else {
        this.set('isEditing', false);
        $('.daterangepicker').remove();
      }
    },
    updateSelectizeSingle(val, $item, propToUpdate, model) {
      let errorProp = `${model}FormErrors`;
      this.set(errorProp, []);

      if ($item === null) {
        this.set(propToUpdate, null);
        return;
      }
      let record = this.store.peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    handleCreatedParentWs(assignment) {
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
    },
    handleCreatedLinkedWs(assignment) {
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
    },
    toggleProperty(propName) {
      if (typeof propName !== 'string') {
        return;
      }
      this.toggleProperty(propName);
    },
  },
});
