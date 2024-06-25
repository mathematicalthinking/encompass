import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import $ from 'jquery';
import moment from 'moment';
import { later } from '@ember/runloop';

export default class WorkspaceNewEncComponent extends Component {
  @service('sweet-alert') alert;
  @service('error-handling') errorHandling;
  @tracked selectedPdSetId = null;
  @tracked selectedFolderSet = null;
  @tracked selectedAssignment = null;
  @tracked selectedSection = null;
  @tracked selectedProblem = null;
  @tracked selectedOwner = null;
  @tracked teacher = null;
  @tracked mode = 'private';
  @tracked userList = null;
  @tracked findRecordErrors = [];
  @tracked wsRequestErrors = [];
  @tracked tooltips = {};
  @tracked missingRequiredFields = false;
  @tracked isRequestInProgress = false;
  @tracked isEmptyAnswerSet = false;
  @tracked createWorkspaceError = null;
  @tracked requestedName = '';

  constructor() {
    super(...arguments);
    this.userList = this.args.model.users;
    this.tooltips = {
      teacher: 'Find all work related to this teacher',
      assignment: 'Find all work related to this assignment',
      problem: 'Find all accessible work related to this problem',
      class: 'Find all work completed by this class',
      dateRange: 'Find all accessible work for this date range',
      owner: 'Who will have ownership of this workspace',
      name: 'Give your workspace a name. If not, workspace names are generated based off given criteria',
      folders: 'Choose a starter folder set, you can create your own later',
      privacy:
        'Private workspaces are only visible by the owner and collaborators. Public workspaces are visible to all users',
    };
  }
  didInsertElement() {
    super.didInsertElement(...arguments);

    const dateRangeInput = this.element.querySelector(
      'input[name="daterange"]'
    );

    if (!dateRangeInput) {
      return;
    }

    const pickerOptions = {
      autoUpdateInput: false,
      showDropdowns: true,
      locale: {
        cancelLabel: 'Clear',
      },
    };

    const datePicker = new DateRangePicker(dateRangeInput, pickerOptions);

    dateRangeInput.addEventListener('apply.daterangepicker', (ev) => {
      const { startDate, endDate } = ev.detail;
      dateRangeInput.value = `${startDate.format(
        'MM/DD/YYYY'
      )} - ${endDate.format('MM/DD/YYYY')}`;
    });

    dateRangeInput.addEventListener('cancel.daterangepicker', () => {
      dateRangeInput.value = '';
    });

    dateRangeInput.setAttribute('placeholder', 'mm/dd/yyyy - mm/dd/yyyy');
  }
  willDestroy() {
    super.willDestroy(...arguments);
    $('.daterangepicker').remove();
  }

  get isDateRangeValid() {
    const htmlFormat = 'YYYY-MM-DD';
    let start = this.startDate;
    let end = this.endDate;

    if (isEmpty(start) || isEmpty(end)) {
      return false;
    }
    start = moment(start, htmlFormat);
    end = moment(end, htmlFormat);

    return end > start;
  }

  get isAnswerCriteriaValid() {
    const params = [
      'selectedTeacher',
      'selectedAssignment',
      'selectedProblem',
      'selectedSection',
    ];
    for (let param of params) {
      if (this[param]) {
        return true;
      }
    }
    return false;
  }

  get isFormValid() {
    return (
      this.isDateRangeValid ||
      this.isAnswerCriteriaValid ||
      this.isWorkspaceSettingsValid
    );
  }

  get isWorkspaceSettingsValid() {
    const params = ['selectedOwner', 'mode'];
    for (let param of params) {
      if (!this[param]) {
        return false;
      }
    }
    return true;
  }

  getTeacherPool() {
    const currentUser = this.currentUser;
    const accountType = currentUser.get('accountType');

    if (accountType === 'T') {
      return [currentUser];
    }

    let teachers = this.userList.rejectBy('accountType', 'S');
    let authTeachers = teachers.filterBy('isAuthorized', true);

    if (accountType === 'P') {
      let pdOrg = currentUser.get('organization');
      let orgTeachers = authTeachers.filterBy('organization', pdOrg);
      return orgTeachers;
    }
    if (accountType === 'A') {
      return authTeachers;
    }
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
    const htmlFormat = 'YYYY-MM-DD';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    let date = new Date(dateMoment);
    date.setHours(23, 59, 59);
    return date;
  }

  @action
  radioSelect(value) {
    this.mode = value;
  }

  @action
  buildCriteria() {
    if (!this.isFormValid) {
      if (this.missingRequiredFields) {
        $('.error-box').removeClass('fadeIn');
        $('.error-box').addClass('pulse');
      }
      this.missingRequiredFields = true;
      $('.error-box').show();
      return;
    }

    if (!this.selectedOwner) {
      this.selectedOwner = this.currentUser;
    }

    let startDate;
    let endDate;
    let dateRangeTextVal = $('#dateRange').val(); // empty string if no date range is picked

    if (dateRangeTextVal) {
      // user selected a date range
      const start = $('#dateRange')
        .data('daterangepicker')
        .startDate.format('YYYY-MM-DD');
      const end = $('#dateRange')
        .data('daterangepicker')
        .endDate.format('YYYY-MM-DD');
      startDate = this.getMongoDate(start);
      endDate = this.getEndDate(end);
    } else {
      startDate = null;
      endDate = null;
    }

    const requestedName = this.requestedName;
    const mode = this.mode;
    const owner = this.selectedOwner;

    const criteria = {
      teacher: this.selectedTeacher,
      createdBy: this.currentUser,
      assignment: this.selectedAssignment,
      problem: this.selectedProblem,
      section: this.selectedSection,
      startDate: startDate,
      endDate: endDate,
      folderSet: this.selectedFolderSet,
      requestedName,
      mode,
      owner,
    };

    const encWorkspaceRequest = this.store.createRecord(
      'encWorkspaceRequest',
      criteria
    );
    this.isRequestInProgress = true;
    encWorkspaceRequest
      .save()
      .then((res) => {
        this.isRequestInProgress = false;
        if (res.get('isEmptyAnswerSet')) {
          this.isEmptyAnswerSet = true;
          $('.error-box').show();
          return;
        }
        if (res.get('createWorkspaceError')) {
          this.createWorkspaceError = res.get('createWorkspaceError');
          return;
        }
        this.alert.showToast(
          'success',
          'Workspace Created',
          'bottom-end',
          3000,
          false,
          null
        );
        // Get the created workspaceId from the res
        let workspaceId = res.get('createdWorkspace').get('id');
        // Then find the first SubmissionID, this is sent to route in order to redirect
        this.store
          .findRecord('workspace', workspaceId)
          .then((workspace) => {
            let submission = workspace.get('submissions').get('firstObject');
            let submissionId = submission.get('id');
            this.sendAction('toWorkspaces', workspaceId, submissionId);
          })
          .catch((err) => {
            this.errorHandling.handleErrors(err, 'findRecordErrors');
          });
      })
      .catch((err) => {
        this.isRequestInProgress = false;
        this.errorHandling.handleErrors(
          err,
          'wsRequestErrors',
          encWorkspaceRequest
        );
        return;
      });
  }

  @action
  closeError() {
    const errorBox = this.element.querySelector('.error-box');

    if (errorBox) {
      errorBox.classList.add('fadeOutRight');

      later(() => {
        errorBox.classList.remove('fadeOutRight');
        errorBox.classList.remove('pulse');
        errorBox.style.display = 'none'; // Hide the error box
      }, 500);
    }
  }

  @action
  setSelectedProblem(problemId) {
    let peeked = this.store.peekAll('problem');
    let problem = peeked.findBy('id', problemId);
    if (!problem) {
      return;
    }
    this.selectedProblem = problem;
  }
}
