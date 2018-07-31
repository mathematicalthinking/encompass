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



  willDestroyElement: function () {
    console.log('destroyingEl');
    this.set('createdStudents', null);
  },

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

    createStudent: function () {
      var that = this;
      var username = this.get('studentUsername');
      var students = this.get('createdStudents');
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
             }
            else {
              var userId = res._id;
              console.log('userID', userId);
              var section = this.get('section');
              console.log('section', section);
              var sectionID = section.get('id');
              console.log('id', sectionID);
              var students = section.get('students');
              console.log('students', students);
              // students.pushObject(userId);

              return this.store.findRecord('user', userId)
                .then((user) => {
                  console.log('user found', user.get('username'));
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
        console.log('done Adding button clicked');
        // this.set('problemPublic', problem.get('isPublic'));
      },

      editSection: function () {
        let section = this.get('section');
        console.log('edit section button clicked');
        console.log('section name', section.name);
        this.set('isEditing', true);
        this.set('sectionName', section.get('name'));
        let teacher = section.get('teachers');
        console.log('section Name is', this.sectionName);
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
