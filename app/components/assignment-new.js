Encompass.AssignmentNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  createAssignmentError: null,
  isMissingRequiredFields: null,
  selectedSection: null,
  selectedProblem: null,
  validator: Ember.inject.service('form-validator'),
  sectionList: null,
  problemList: null,
  formId: null,

  init: function() {
    console.log('running Init problem-new');
    this._super(...arguments);
    const formId = 'form#newassignmentform';
    this.set('formId', formId);
  },

  didReceiveAttrs: function() {
    const currentUser = this.get('currentUser');
    if (this.sections) {
      // let sections = this.sections.filterBy('isTrashed', false);
      const sections = this.sections.filter((section) => {
        return !section.get('isTrashed') && section.id;
      });
      this.set('sectionList', sections);
    }

    if (this.problems) {
      const problems = this.problems.filterBy('isTrashed', false);
      const myProblems = problems.filterBy('createdBy.content', currentUser);
      this.set('problemList', myProblems);
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
    console.log('creating Assignment');
    const that = this;

    const createdBy = that.get('currentUser');
    const section = that.get('selectedSection');
    const problem = that.get('selectedProblem');
    const assignedDate = that.getMongoDate(that.get('assignedDate'));
    const dueDate = that.getMongoDate(that.get('dueDate'));

    // need to get all students from section
    const students = section.get('students');


    const createAssignmentData = that.store.createRecord('assignment', {
      createdBy: createdBy,
      createDate: new Date(),
      section: section,
      problem: problem,
      assignedDate: assignedDate,
      dueDate: dueDate,
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
            that.set('createAssignmentError', err);
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

  actions: {
    validate: function() {
      var that = this;
      return this.get('validator').validate(that.get('formId'))
      .then((res) => {
        console.log('res', res);
        if (res.isValid) {
          // proceed with assignment creation
          console.log('Form is Valid!');
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
  }
});

