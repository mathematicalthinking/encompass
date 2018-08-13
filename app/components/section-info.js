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
  doYouWantToAddExistingUser: null,
  studentAlreadyInSection: null,
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


    doYouWantToAddExistingUser: function () {
      this.set('doYouWantToAddExistingUser', false);
    },
    exitaddexistingusername: function () {
      this.set('doYouWantToAddExistingUser', false);
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
        //if (student) already in the STUDENTS list
          if (res.message === 'Username already exists') {
          this.set('studentAlreadyInSection', true);
        } else {
          students.pushObject(student);  //add student into students list
          section.save().then((section) => {
            console.log('saved section', section);
            student.get('sections').addObject(sectionObj);
            student.save().then((rec) => {
              this.set('doYouWantToAddExistingUser', false);
              console.log('saved student', rec);
              this.set('studentUsername', '');
            });
          });
        }
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

      var createUserData = {
        name: name,
        username: username,
        password: password,
        accountType: 'S',
        sectionId: sectionId,
        sectionRole: sectionRole,
        createdBy: currentUser.id,
        isAuthorized: true,
        authorizedBy: currentUser.id
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
            this.set('doYouWantToAddExistingUser', true);
            this.set('existingUser', res.user);
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

    deleteSection: function () {
      let section = this.get('section');
      window.alert('Are you sure you want to delete this section?');
      section.set('isTrashed', true);
      section.save();
      this.sendAction('toSectionList');
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

      if (this.doYouWantToAddExistingUser) {
        this.set('doYouWantToAddExistingUser', false);
      }

      if (this.studentAlreadyInSection) {
        this.set('studentAlreadyInSection', false);
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