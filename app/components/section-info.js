Encompass.SectionInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'section-info',
  className: ['section-info'],
  isEditing: false,
  sectionName: null,
  teacher: null,
  isAddStudents: false,
  createdStudents: null,
  selectedOrganization: null,
  isAddingStudents: false,
  usingDefaultPassword: true,
  usernameAlreadyExists: null,
  isMissingPassword: null,
  isMissingUsername: null,
  missingFieldsError: null,
  showingPassword: false,
  fieldType: 'password',



  willDestroyElement: function () {
    this.set('createdStudents', null);
  },

  isShowingPassword: Ember.computed(function () {
    var showing = this.get('showingPassword');
    return showing;
  }),

  // //Array containing students in a section/class
  // studentsNotEmpty: Ember.computed('createdStudents.[]', function () {
  //   var createdStudents = this.get('createdStudents');
  //   if (createdStudents === null) {
  //     return false;
  //   }
  //   console.log('createdStudents', createdStudents);
  //   console.log('len', createdStudents.length);
  //   return createdStudents.get('length') > 0;
  // }),

  actions: {
    addNewStudents: function () {
      this.set('isAddingStudents', true);
    },

    showPassword: function () {
      var isShowingPassword = this.get('showingPassword');
      console.log('isShowingPassword =', isShowingPassword);
      if (isShowingPassword === false) {
        this.set('showingPassword', true);
        this.set('fieldType', 'text');
      } else {
        this.set('showingPassword', false);
        this.set('fieldType', 'password');
      }

    },

    createStudent: function () {
      var that = this;
      var username = this.get('studentUsername');
      var usingDefaultPassword = this.get('usingDefaultPassword');
      var password;

      if (usingDefaultPassword) {
        password = this.get('defaultPassword');
      } else {
        password = this.get('studentPassword');
      }
      if (!password) {
        this.set('isMissingPassword', true);
        return;
      }
      if (!username) {
        this.set('isMissingUsername', true);
        return;
      }

      var createUserData = {
        username: username,
        password: password,
        isStudent: true
      };
      return Ember.$.post({
          url: '/auth/signup',
          data: createUserData
        })
        .then((res) => {
          if (res.message === 'Username already exists') {
            that.set('usernameAlreadyExists', true);
          } else {
            var userId = res._id;
            var section = this.get('section');
            var students = section.get('students');
            var sectionPassword = section.get('sectionPassword');

            return this.store.findRecord('user', userId)
              .then((user) => {
                students.pushObject(user);
                section.save();
                this.set('studentUsername', '');
                if (!usingDefaultPassword) {
                  this.set('studentPassword', '');
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // insertStudent: function () {
    //   let giveStudent = this.get('students');
    //   this.set('studentUsername', giveStudent.get('students'));
    // },

    doneAdding: function () {
      this.set('isAddingStudents', false);
      // this.set('problemPublic', problem.get('isPublic'));
    },

    editSection: function () {
      let section = this.get('section');
      this.set('isEditing', true);
      this.set('sectionName', section.get('name'));
      let teacher = section.get('teachers');
    },

    updateSection: function () {
      let name = this.get('sectionName');
      let section = this.get('section');
      section.set('name', name);
      section.save();
      this.set('isEditing', false);
    },

    checkError: function () {
      if (this.invalidTeacherUsername) {
        this.set('invalidTeacherUsername', false);
      }

      if (this.usernameAlreadyExists) {
        this.set('usernameAlreadyExists', false);
      }

      if (this.isMissingPassword) {
        this.set('isMissingPassword', false);
      }
      if (this.missingFieldsError) {
        this.set('missingFieldsError', false);
      }
    }
  }
});