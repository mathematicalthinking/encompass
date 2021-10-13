import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';

export default class AssignmentNewComponent extends ErrorHandlingComponent {
  @service router;
  @service store;
  @service('sweet-alert') alert;
  @tracked createAssignmentError = null;
  @tracked isMissingRequiredFields = null;
  @tracked selectedSection = null;
  @tracked selectedProblem = null;
  @tracked problemList = null;
  @tracked formId = null;
  @tracked createRecordErrors = [];
  @tracked queryErrors = [];
  @tracked linkedWorkspacesMode = 'individual';
  @tracked doCreateLinkedWorkspaces = false;
  @tracked doCreateParentWorkspace = false;
  @tracked fromProblemInfo = false;
  @tracked parentWorkspaceAccess = false;
  tooltips = {
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
  constraints = {
    section: {
      presence: { allowEmpty: false },
    },
    problem: {
      presence: { allowEmpty: false },
    },
    name: {
      presence: false,
    },
  };
  nameDate = moment().format('MMM Do YYYY');

  linkedWsOptions = {
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
  };
  groupWsOptions = {
    groupName: 'groupWorkspaces',
    requried: false,
    inputs: [
      {
        value: 'group',
        label: 'By Group',
      },
      {
        value: 'individual',
        label: 'By Student',
      },
      {
        value: 'both',
        label: 'Student and Group',
      },
    ],
  };
  parentWsOptions = {
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
  };
  parentWorkspaceAccessOptions = {
    groupName: 'accessOptions',
    required: false,
    inputs: [
      {
        value: true,
        label: 'Give access',
      },
      {
        value: false,
        label: 'Keep private',
      },
    ],
  };

  @tracked sectionGroups = [];
  @tracked groupWorkspacesToMake = [];
  @tracked studentWorkspacesToMake = [];

  @action updateLists(record) {
    if (record.constructor.modelName === 'user') {
      this.studentWorkspacesToMake.includes(record.id)
        ? this.studentWorkspacesToMake.splice(
            this.studentWorkspacesToMake.indexOf(record.id),
            1
          )
        : (this.studentWorkspacesToMake = [
            ...this.studentWorkspacesToMake,
            record.id,
          ]);
    } else {
      this.groupWorkspacesToMake.includes(record.id)
        ? this.groupWorkspacesToMake.splice(
            this.groupWorkspacesToMake.indexOf(record.id),
            1
          )
        : (this.groupWorkspacesToMake = [
            ...this.groupWorkspacesToMake,
            record.id,
          ]);
    }
    console.log(this.studentWorkspacesToMake);
    console.log(this.groupWorkspacesToMake);
  }

  @action updateSectionGroups() {
    if (this.selectedSection) {
      this.sectionGroups = this.store.query('group', {
        section: this.selectedSection.id,
        isTrashed: false,
      });
    }
  }

  get hasSelectedSection() {
    return !!this.selectedSection;
  }

  get hasProblem() {
    return !!this.selectedProblem;
  }

  get hasProblemAndSection() {
    return this.hasSelectedSection && this.hasProblem;
  }

  get showLinkedWsForm() {
    return this.doCreateLinkedWorkspaces && this.hasProblemAndSection;
  }

  get showParentWsForm() {
    return this.doCreateLinkedWorkspaces && this.showLinkedWsForm;
  }

  get problemsPreloadValue() {
    // if there is at least one problem in the store
    // do not auto fetch problems on focus
    if (this.args.cachedProblems) {
      let length = this.args.cachedProblems.length;
      return length > 0 ? undefined : 'focus';
    }
    return undefined;
  }

  get assignmentNamePreview() {
    if (this.name) {
      return this.name;
    }

    if (!this.hasProblem) {
      return '';
    }
    let title = this.selectedProblem.title;

    let nameDate = this.nameDate;

    return `${title} / ${nameDate}`;
  }
  //for the 'workspaces to be created' list
  get workspacesList() {
    if (this.linkedWorkspacesMode === 'group') {
      return this.sectionGroups;
    } else if (this.linkedWorkspacesMode === 'individual') {
      return this.selectedSection.students.content;
    } else {
      return [
        ...this.sectionGroups.toArray(),
        ...this.selectedSection.students.content.toArray(),
      ];
    }
  }

  constructor() {
    super(...arguments);
    let selectedProblem = this.args.selectedProblem;
    if (selectedProblem && selectedProblem.isForAssignment) {
      this.fromProblemInfo = true;
      this.selectedProblem = selectedProblem;
    }
    if (this.args.fromSectionInfo) {
      this.fromSectionInfo = true;
      this.selectedSection = this.args.selectedSection;
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    let problem = this.selectedProblem;
    if (problem && problem.isForAssignment) {
      problem.isForAssignment = false;
    }
  }

  createAssignment(formValues) {
    let { section, problem, assignedDate, dueDate, name } = formValues;
    const createdBy = this.args.currentUser;

    if (!name) {
      // let nameDate = $('#assignedDate')
      //   .data('daterangepicker')
      //   .startDate.format('MMM Do YYYY');
      let nameDate = assignedDate
        ? moment(new Date(assignedDate.replace(/-/g, '/'))).format(
            'MMM Do YYYY'
          )
        : moment(new Date()).format('MMM Do YYYY');
      let problemTitle = problem.get('title');
      name = `${problemTitle} / ${nameDate}`;
    }
    if (assignedDate && dueDate && assignedDate > dueDate) {
      this.invalidDateRange = true;
      return;
    }
    // need to get all students from section
    const students = section.get('students');

    const createAssignmentData = this.store.createRecord('assignment', {
      createdBy,
      createDate: new Date(),
      section,
      problem,
      assignedDate: assignedDate
        ? new Date(assignedDate.replace(/-/g, '/'))
        : '',
      dueDate: dueDate ? new Date(dueDate.replace(/-/g, '/')) : '',
      name,
    });

    const doCreateLinkedWorkspaces = this.doCreateLinkedWorkspaces;
    const doCreateParentWorkspace = this.doCreateParentWorkspace;

    let linkedFormatInput = $('#linked-ws-new-name');
    let linkedNameFormat;

    if (linkedFormatInput) {
      linkedNameFormat = linkedFormatInput.val();
    }

    let parentFormatInput = $('#parent-ws-new-name');
    let parentNameFormat;

    if (parentFormatInput) {
      parentNameFormat = parentFormatInput.val();
    }

    createAssignmentData.linkedWorkspacesRequest = {
      doCreate: doCreateLinkedWorkspaces,
      name: linkedNameFormat,
      linkType: this.linkedWorkspacesMode,
      groupsToMake: this.groupWorkspacesToMake,
      studentsToMake: this.studentWorkspacesToMake,
    };

    createAssignmentData.parentWorkspaceRequest = {
      doCreate: doCreateLinkedWorkspaces ? doCreateParentWorkspace : false,
      name: parentNameFormat,
      giveAccess: this.parentWorkspaceAccess,
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
  get problemOptions() {
    let cachedProblems = this.args.cachedProblems;
    if (cachedProblems) {
      let toArray = cachedProblems.toArray();
      return toArray.map((cachedProblem) => {
        return {
          id: cachedProblem.id,
          title: cachedProblem.get('title'),
        };
      });
    }
    return [];
  }
  get sectionOptions() {
    let sectionList = this.args.sectionList || [];
    let toArray = sectionList.toArray();
    return toArray.map((section) => {
      return {
        id: section.id,
        name: section.get('name'),
      };
    });
  }
  @action updateDoCreateLinkedWorkspaces(val) {
    this.doCreateLinkedWorkspaces = val;
  }
  @action updateLinkedWorkspacesMode(val) {
    this.linkedWorkspacesMode = val;
    //reset chosen linkedWorkspaces
    this.groupWorkspacesToMake = [];
    this.studentWorkspacesToMake = [];
  }
  @action updateDoCreateParentWorkspace(val) {
    this.doCreateParentWorkspace = val;
  }
  @action updateParentWorkspaceAccess(val) {
    this.parentWorkspaceAccess = val;
  }
  @action validate() {
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
        this[errorProp] = errors[key];
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
  }

  @action cancel() {
    if (this.cancel) {
      this.args.cancel();
    } else {
      this.router.transitionTo('assignments');
    }
  }
  @action updateSelectizeSingle(val, $item, propToUpdate, model) {
    let errorProp = `${model}FormErrors`;
    this[errorProp] = [];

    if ($item === null) {
      this[propToUpdate] = null;
      return;
    }
    let record = this.store.peekRecord(model, val);
    if (!record) {
      return;
    }
    this[propToUpdate] = record;
  }
}
