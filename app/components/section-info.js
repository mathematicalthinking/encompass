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
  doyouwanttoaddexistinguser: null,
  isMissingPassword: null,
  isMissingUsername: null,
  missingFieldsError: null,
  showingPassword: false,
  fieldType: 'password',
  isEditingStudents: false,
  removeObject: null,
  organization: null,
  isStudent: false,


  didReceiveAttrs: function () {
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

  actions: {
    addNewStudents: function () {
      this.set('isAddingStudents', true);
    },

    // doneAddingExistingUsername: function () {
    //   this.set('usernameAlreadyExists', false);
    //   // this.set('problemPublic', problem.get('isPublic'));
    // },

    doyouwanttoaddexistinguser: function () {
      this.set('doyouwanttoaddexistinguser', false);
    },
    exitaddexistingusername: function () {
      this.set('doyouwanttoaddexistinguser', false);
      this.set('studentUsername', '');
    },

    addExistingStudent: function ()  {
      let student = this.get('existingUser');
      let section = this.get('section');
      let students = section.get('students');

      let sectionObj = {
        sectionId: section.id,
        role: 'student'
      };

      return this.store.findRecord('user', student.id).then((student) => {
        console.log('student rec', student);
        students.pushObject(student);
        section.save().then((section) => {
          console.log('saved section', section);

          student.get('sections').addObject(sectionObj);
          student.save().then((rec) => {
            console.log('saved student', rec);
            this.set('studentUsername', '');
          });

        });
     });

    },

    removeStudent: function (user) {
      let section = this.get('section');
      let students = section.get('students');

      students.removeObject(user);

      // Save to Database
      section.save().then((section) => {
        this.set('removedStudent', true);
      });
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
      let organization = this.get('organization');
      var name = this.get('studentName');
      console.log('username =', name);
      var username = this.get('studentUsername');
      var usingDefaultPassword = this.get('usingDefaultPassword');
      var password;
      var sectionId = this.get('section').id;
      var sectionRole = 'student';
      var currentUser = that.get('currentUser');

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
        isStudent: true,
        sectionId: sectionId,
        sectionRole: sectionRole,
        createdBy: currentUser.id
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
            this.set('doyouwanttoaddexistinguser', true);
            this.set('existingUser', res.user);

            // TODO: display to user message that user already exists within your organization, and display info about existing user and give the user the option to add the existing user to the section
            console.log('User already exists inside your org, add them if you wish.');
            console.log('res.user', res.user);

          }
          else {
            var userId = res._id;
            var section = this.get('section');
            var students = section.get('students');
            var sectionPassword = section.get('sectionPassword');
            console.log('section password is currently', sectionPassword);
            return this.store.findRecord('user', userId)
              .then((user) => {
                students.pushObject(user);   //add student to students aray
                section.save();  //save section
                this.set('name', '');   //after save clear fields
                this.set('studentUsername', '');   //after save clear fields
                if (!usingDefaultPassword) {
                  this.set('studentPassword', '');   //after save clear fields
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

    toggleAddExistingStudent: function () {
      if (this.get('isAddingExistingStudents') !== true) {
        this.set('isAddingExistingStudents', true);
      } else {
        this.set('isAddingExistingStudents', false);
      }
    },

    // doneAddingStudent: function () {
    //   this.set('addExistingStudent', false);
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

      if (this.doyouwanttoaddexistinguser) {
        this.set('doyouwanttoaddexistinguser', false);
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