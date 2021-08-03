import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  router: service('router'),
  elementId: 'assignment-new',
  createAssignmentError: null,
  isMissingRequiredFields: null,
  selectedSection: null,
  selectedProblem: null,
  alert: service('sweet-alert'),
  sectionList: null,
  problemList: null,
  formId: null,
  createRecordErrors: [],
  queryErrors: [],
  constraints: {
    section: {
      presence: { allowEmpty: false },
    },
    problem: {
      presence: { allowEmpty: false },
    },
    name: {
      presence: false,
    },
  },

  doCreateLinkedWorkspaces: false,
  doCreateParentWorkspace: false,

  linkedWsOptions: {
    groupName: 'linkedWorkspaces',
    required: false,
    inputs: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
  },
  parentWsOptions: {
    groupName: 'parentWorkspace',
    required: false,
    inputs: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
  },

  hasSelectedSection: notEmpty('selectedSection'),

  hasProblem: notEmpty('selectedProblem'),

  hasProblemAndSection: and('hasProblem', 'hasSelectedSection'),

  showLinkedWsForm: and('doCreateLinkedWorkspaces', 'hasProblemAndSection'),

  showParentWsForm: and('doCreateParentWorkspace', 'showLinkedWsForm'),

  problemsPreloadValue: computed('cachedProblems.[]', function () {
    // if there is at least one problem in the store
    // do not auto fetch problems on focus
    let length = this.cachedProblems.length;
    return length > 0 ? undefined : 'focus';
  }),

  assignmentNamePreview: computed(
    'name',
    'selectedProblem.title',
    'nameDate',
    function () {
      let hasName = this.name.length > 0;

      if (hasName) {
        return this.name;
      }

      if (!this.hasProblem) {
        return '';
      }
      let title = this.selectedProblem.title;

      let nameDate = this.nameDate;

      return `${title} / ${nameDate}`;
    }
  ),

  init: function () {
    let that = this;
    this.set('nameDate', moment().format('MMM Do YYYY'));
    this._super(...arguments);
    let tooltips = {
      class: 'Select which class you want to assign the problem',
      problem: 'Select which problem you want to assign',
      dateAssigned:
        'Guideline for when students should begin working on assignment (not currently enforced by EnCoMPASS)',
      dueDate:
        'Guideline for when assignment should be completed by (not currently enforced by EnCoMPASS)',
      name:
        'Give your assignment a specific name or one will be generated based on the name of the problem and date assigned or created',
      linkedWorkspaces:
        'If "Yes", an empty workspace will be created for each member of the selected class (member will be the owner) and linked to this assignment. As answers / revisions are submitted for the assignment, the linked workspaces will automatically update',
      parentWorkspace:
        'If "Yes", an empty Parent workspace will be created from the newly linked student workspaces. The parent workspace will automatically update as the children workspaces are populated with new submissions and markup',
    };
    this.set('tooltips', tooltips);
    // $(function () {
    //   $('input#assignedDate').daterangepicker(
    //     {
    //       singleDatePicker: true,
    //       showDropdowns: true,
    //       autoUpdateInput: false,
    //     },
    //     function (start, end, label) {
    //       let assignedDate = start.format('MM/DD/YYYY');
    //       $('input#assignedDate').val(assignedDate);
    //       that.set('nameDate', start.format('MMM Do YYYY'));
    //     }
    //   );
    //   $('input#dueDate').daterangepicker(
    //     {
    //       singleDatePicker: true,
    //       showDropdowns: true,
    //       autoUpdateInput: false,
    //     },
    //     function (start, end, label) {
    //       let dueDate = start.format('MM/DD/YYYY');
    //       $('input#dueDate').val(dueDate);
    //     }
    //   );
    //   $('input[name="daterange"]').attr('placeholder', 'mm/dd/yyyy');
    // });
    this.set('cachedProblems', this.store.findAll('problem'));
  },

  didReceiveAttrs: function () {
    if (this.sections) {
      const sections = this.sections.filter((section) => {
        return !section.get('isTrashed') && section.id;
      });
      this.set('sectionList', sections);
    }
    let selectedProblem = this.selectedProblem;
    if (selectedProblem && selectedProblem.get('isForAssignment')) {
      this.set('FromProblemInfo', true);
    }
  },
  willDestroyElement: function () {
    $('.daterangepicker').remove();
    let problem = this.selectedProblem;
    if (problem && problem.get('isForAssignment')) {
      problem.set('isForAssignment', false);
    }
    this._super(...arguments);
  },

  createAssignment: function (formValues) {
    let { section, problem, assignedDate, dueDate, name } = formValues;
    const createdBy = this.currentUser;

    if (!name) {
      // let nameDate = $('#assignedDate')
      //   .data('daterangepicker')
      //   .startDate.format('MMM Do YYYY');
      let nameDate = new Date(assignedDate);
      let problemTitle = problem.get('title');
      name = problemTitle + ' / ' + nameDate;
    }
    if (assignedDate && dueDate && assignedDate > dueDate) {
      this.set('invalidDateRange', true);
      return;
    }
    // need to get all students from section
    const students = section.get('students');

    const createAssignmentData = this.store.createRecord('assignment', {
      createdBy,
      createDate: new Date(),
      section,
      problem,
      assignedDate: new Date(assignedDate),
      dueDate: new Date(dueDate),
      name,
    });

    const doCreateLinkedWorkspaces = this.doCreateLinkedWorkspaces;
    const doCreateParentWorkspace = this.doCreateParentWorkspace;

    let linkedFormatInput = this.$('#linked-ws-new-name');
    let linkedNameFormat;

    if (linkedFormatInput) {
      linkedNameFormat = linkedFormatInput.val();
    }

    let parentFormatInput = this.$('#parent-ws-new-name');
    let parentNameFormat;

    if (parentFormatInput) {
      parentNameFormat = parentFormatInput.val();
    }

    createAssignmentData.linkedWorkspacesRequest = {
      doCreate: doCreateLinkedWorkspaces,
      name: linkedNameFormat,
    };

    createAssignmentData.parentWorkspaceRequest = {
      doCreate: doCreateLinkedWorkspaces ? doCreateParentWorkspace : false,
      name: parentNameFormat,
    };

    students.forEach((student) => {
      createAssignmentData.get('students').pushObject(student);
    });

    createAssignmentData
      .save()
      .then((assignment) => {
        this.router.transitionTo('assignments.assignment', assignment.id);
        this.alert.showToast(
          'success',
          'Assignment Created',
          'bottom-end',
          3000,
          false,
          null
        );
      })
      .catch((err) => {
        this.handleErrors(err, 'createRecordErrors', createAssignmentData);
      });
  },

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
  sectionOptions: computed('sectionList.[]', function () {
    let sectionList = this.sectionList || [];
    let toArray = sectionList.toArray();
    return toArray.map((section) => {
      return {
        id: section.id,
        name: section.get('name'),
      };
    });
  }),

  actions: {
    validate: function () {
      const section = this.selectedSection;
      const problem = this.selectedProblem;
      let assignedDate = $('#assignedDate').val();
      let dueDate = $('#dueDate').val();
      const name = this.name;

      const values = {
        section,
        problem,
        assignedDate,
        dueDate,
        name,
      };

      const constraints = this.constraints;

      let errors = window.validate(values, constraints);
      if (errors) {
        // errors
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}FormErrors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }

      if (!assignedDate) {
        delete values.assignedDate;
      }
      if (!dueDate) {
        delete values.dueDate;
      }

      this.createAssignment(values);
    },

    cancel: function () {
      if (this.cancel) {
        this.cancel();
      } else {
        this.sendAction('toAssignmentsHome');
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
  },
});
