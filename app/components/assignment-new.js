Encompass.AssignmentNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  createAssignmentError: null,
  isMissingRequiredFields: null,
  selectedSection: null,
  selectedProblem: null,
  validator: Ember.inject.service('form-validator'),
  alert: Ember.inject.service('sweet-alert'),
  sectionList: null,
  problemList: null,
  formId: null,
  createRecordErrors: [],
  queryErrors: [],

  init: function() {
    this._super(...arguments);
    const formId = 'form#newassignmentform';
    this.set('formId', formId);
    $(function () {
      $('input[name="daterange"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
      });
    });
  },

  didReceiveAttrs: function() {
    if (this.sections) {
      const sections = this.sections.filter((section) => {
        return !section.get('isTrashed') && section.id;
      });
      this.set('sectionList', sections);
    }

    // if (this.problems) {
    //   const problems = this.problems.filterBy('isTrashed', false);
    //   this.set('problemList', problems);
    // }

    if (!this.get('addProblemTypeahead')) {
      this.set('addProblemTypeahead',this.getAddableProblems.call(this));
    }
  },

  didInsertElement: function() {

    const formId = this.get('formId');
    let isMissing = this.checkMissing.bind(this);
    if (formId) {
      this.get('validator').initialize(formId, isMissing);
    }
  },

  willDestroyElement: function () {
    $(".daterangepicker").remove();
    this._super(...arguments);
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
      this.get('alert').showToast('success', 'Assignment Created', 'bottom-end', 3000, false, null);
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

    getAddableProblems: function () {
      const store = this.get('store');
      let ret = function (query, syncCb, asyncCb) {
        let text = query.replace(/\W+/g, "");
        return store.query('problem', {
           filterBy: {
             title: text
           }
          }).then((problems) => {
            if (!problems) {
              return [];
            }

            return asyncCb(problems.toArray());
          })
          .catch((err) => {
            this.handleErrors(err, 'queryErrors');
          });
      };
      return ret.bind(this);
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

