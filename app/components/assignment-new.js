Encompass.AssignmentNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, Encompass.AddableProblemsMixin, {
  createAssignmentError: null,
  isMissingRequiredFields: null,
  selectedSection: null,
  selectedProblem: null,
  alert: Ember.inject.service('sweet-alert'),
  sectionList: null,
  problemList: null,
  formId: null,
  createRecordErrors: [],
  queryErrors: [],
  constraints: {
    section: {
      presence: { allowEmpty: false }
    },
    problem: {
      presence: { allowEmpty: false },
    },
    assignedDate: {
      presence: { allowEmpty: false }
    },
    dueDate: {
      presence: { allowEmpty: false }
    },
    name: {
      presence: false
    }
  },

  init: function() {
    this._super(...arguments);
    $(function () {
      $('input#assignedDate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        autoUpdateInput: false,
      }, function(start, end, label) {
        let assignedDate = start.format('MM/DD/YYYY');
        $('input#assignedDate').val(assignedDate);
      });
      $('input#dueDate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        autoUpdateInput: false,
      }, function(start, end, label) {
        let dueDate = start.format('MM/DD/YYYY');
        $('input#dueDate').val(dueDate);
      });
      $('input[name="daterange"]').attr('placeholder', 'MM/DD/YYYY');
    });
  },

  didReceiveAttrs: function() {
    if (this.sections) {
      const sections = this.sections.filter((section) => {
        return !section.get('isTrashed') && section.id;
      });
      this.set('sectionList', sections);
    }
    this.setAddProblemFunction('addProblemTypeahead');

  },


  willDestroyElement: function () {
    $(".daterangepicker").remove();
    this._super(...arguments);
  },


  createAssignment: function(formValues) {
    const that = this;

    let {section, problem, assignedDate, dueDate, name } = formValues;
    const createdBy = that.get('currentUser');

    if (!name) {
      let nameDate= $('#assignedDate').data('daterangepicker').startDate.format('MMM Do YYYY');
      let problemTitle = problem.get('title');
      name = problemTitle + ' / ' + nameDate;
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

  actions: {
    validate: function() {
      const section = this.get('selectedSection');
      const problem = this.get('selectedProblem');
      let assignedDate = $('#assignedDate').val();
      let dueDate = $('#dueDate').val();
      const name = this.get('name');

      const values = {
        section,
        problem,
        assignedDate,
        dueDate,
        name
      };

      const constraints = this.get('constraints');

      let errors = window.validate(values, constraints);
      if (errors) { // errors
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}FormErrors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }
      const startDate = $('#assignedDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
      values.assignedDate = this.getMongoDate(startDate);

      const endDate = $('#dueDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
      values.dueDate = this.getEndDate(endDate);

      this.createAssignment(values);

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

