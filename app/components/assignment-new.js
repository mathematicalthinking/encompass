Encompass.AssignmentNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  createAssignmentError: null,
  isMissingRequiredFields: null,
  selectedSection: null,
  selectedProblem: null,
  validator: Ember.inject.service('form-validator'),
  sectionList: null,
  problemList: null,
  formId: null,
  createRecordErrors: [],

  init: function() {
    console.log('running Init problem-new');
    this._super(...arguments);
    const formId = 'form#newassignmentform';
    this.set('formId', formId);
  },

  didReceiveAttrs: function() {
    if (this.sections) {
      const sections = this.sections.filter((section) => {
        return !section.get('isTrashed') && section.id;
      });
      this.set('sectionList', sections);
    }

    if (this.problems) {
      const problems = this.problems.filterBy('isTrashed', false);
      this.set('problemList', problems);
    }
  },

  didInsertElement: function() {
    console.log('running didInsertElement problemNew');
    const formId = this.get('formId');
    let isMissing = this.checkMissing.bind(this);
    if (formId) {
      this.get('validator').initialize(formId, isMissing);
    }
  },

  checkMissing: function() {
    const id = this.get('formId');
    let isMissing = this.get('validator').isMissingRequiredFields(id);
    this.set('isMissingRequiredFields', isMissing);
  },
  createAssignment: function() {
    const that = this;

    const createdBy = that.get('currentUser');
    const section = that.get('selectedSection');
    const problem = that.get('selectedProblem');
    const startDate = $('#assignedDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    const assignedDate = that.getMongoDate(startDate);
    const endDate = $('#dueDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
    const dueDate = that.getEndDate(endDate);
    let name = that.get('name');

    if (!name) {
      let assignedDate = $('#assignedDate').data('daterangepicker').startDate.format('MMM Do YYYY');
      let problemTitle = problem.get('title');
      name = problemTitle + ' / ' + assignedDate;
    }

    if (assignedDate > dueDate) {
      this.set('invalidDateRange', true);
      return;
    }
    // need to get all students from section
    const students = section.get('students');


    const createAssignmentData = that.store.createRecord('assignment', {
      createdBy: createdBy,
      createDate: new Date(),
      section: section,
      problem: problem,
      assignedDate: assignedDate,
      dueDate: dueDate,
      name: name,
    });

    students.forEach((student) => {
      createAssignmentData.get('students').pushObject(student);
    });

    createAssignmentData.save()
      .then((assignment) => {
        that.sendAction('toAssignmentInfo', assignment);
        //TODO: decide how to handle clearing form and whether to redirect to the created assignment
            //that.get('validator').clearForm();
        })
        .catch((err) => {
          that.handleErrors(err, 'createRecordErrors', createAssignmentData);
          });
    },

    getMongoDate: function(htmlDateString) {
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


  actions: {
    validate: function() {
      var that = this;
      return this.get('validator').validate(that.get('formId'))
      .then((res) => {
        if (res.isValid) {
          // proceed with assignment creation
          this.createAssignment();
        } else {
          if (res.invalidInputs) {
            this.set('isMissingRequiredFields', true);
            return;
          }
        }
      })
      .catch(console.log);
    },

    cancel: function() {
      if (this.cancel) {
        this.cancel();
      } else {
        this.sendAction('toAssignmentsHome');
      }

    }
  }
});

