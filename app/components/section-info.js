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
  isEditingStudents: false,
  removeObject: null,
  organization: null,
  isStudent: false,

  didInsertElement: function () {
    var user = this.get('user');
    var teachers = this.get('teachers');
  },

  didReceiveAttrs: function() {
    return this.section.get('organization').then((org) => {
      console.log(('organization', org));
      this.set('organization', org);
    })
    .catch((err) => {
      console.log('error getting org', err);
    });
  },

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
      let section = this.get('section');
      //let teachers = this.get('teachers');
      let organization = this.get('organization');
      var user = this.get('user');
      var name = this.get('studentName');
      console.log('name', name);
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

      //let student organization = teacher organization
        console.log('org', organization);
      var createUserData = {
        name: name,
        username: username,
        password: password,
        isStudent: true
      };

      if (organization) {
        createUserData.organization = organization.id;
      }
      return Ember.$.post({
        url: '/auth/signup',
        data: createUserData
      })
        .then((res) => {
          console.log('res', res);
          if (res.message === 'Username already exists') {
            that.set('usernameAlreadyExists', true);
          } else if(res.message === 'Can add existing user') {
            // TODO: display to user message that user already exists within your organization, and display info about existing user and give the user the option to add the existing user to the section
            console.log('User already exists inside your org, add them if you wish.');
            console.log('res.user', res.user);
          }
          else {
            var userId = res._id;
            var section = this.get('section');
            //var name = section.get('name');
            var students = section.get('students');
            //var organization = section.get('organization');
            var sectionPassword = section.get('sectionPassword');

            console.log('section password is currently', sectionPassword);
            return this.store.findRecord('user', userId)
              .then((user) => {
                students.pushObject(user);
                section.save();
                this.set('name', '');
                this.set('studentUsername', '');
                if (!usingDefaultPassword) {
                  this.set('studentPassword', '');
                }
                // this.removeUsername = function () {
                //   students.removeObject(user);
                // };
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

      /*findrecord of user
        then push to students array if new student (username) message 'student info not found'  */

    addExistingStudent: function (res) {
     //var students = section.get('students');
     var userId = res._id;
     let username = this.get('addExistingStudent');
     this.store.findAll('user', username)
     .then((res) => {
      if (res.message === 'Username already exists') {
        this.set('usernameAlreadyExists', true);
      } else {
      let section = this.get('section');
      var students = section.get('addExistingStudent')
     .then((user) => {
       students.pushObject(user);
       section.save();
       this.set('studentUsername', '');
     })
     .catch((err) => {
       console.log(err);
        });
      }
    });
    },

    removeStudent: function (user) {
      let section = this.get('section');
      let students = this.get('students');
      let username = section.get('studentUsername');

      console.log('user', username);
      //this.get('studentUsername').removeObject(this.get(username));
      this.get('students').removeObject(this.get(username));
      students.removeObject(username);

      // Save to Database
      section.save();
      // Route to
      this.transitionTo('section');
    },

    toggleAddExistingStudent: function () {
      if (this.get('isAddingExistingStudents') !== true) {
        this.set('isAddingExistingStudents', true);
      } else {
        this.set('isAddingExistingStudents', false);
      }
    },

    doneAddingStudent: function () {
      this.set('addExistingStudent', false);
    },

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




   // editStudent: function (_id) {
    //   let section = this.get('section');
    //   this.set('isEditingStudents', true);
    //   //var students = section.get('students');
    //   let name = section.get('editstudentName');
    //   let username = section.get('editstudentUsername');
    //   let password = section.get('editstudentPassword');

    //   this.store.findRecord('user', _id).then(function (user){
    //     this.set('studentName', name);
    //     this.set('studentUsername', username);
    //     this.set('studentpassword', password);

		// 		// Save to Database
    //     section.save();
    //     // Route to
    //     this.transitionTo('section');
    //   });
    // },

    // updateStudents: function () {
    //   //when finish editing update button to update & close
    // },