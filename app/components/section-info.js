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
  userAlreadyInSection: null,
  isMissingPassword: null,
  isMissingUsername: null,
  missingFieldsError: null,
  showingPassword: false,
  fieldType: 'password',
  isEditingStudents: false,
  removeObject: null,
  organization: null,
  isStudent: false,
  studentList: null,
  studentUsername: "",


  didReceiveAttrs: function () {
    return this.section.get('organization').then((org) => {
      console.log(('organization', org));
      this.set('organization', org);
    })
    .then(() => {
      // get users and set result on component
      this.store.findAll('user').then((users) => {
        this.set('userList', users);
      });
    })
    .catch((err) => {
      console.log('error getting org', err);
    });
  },

  searchResults: function () {
    var searchText = this.get('studentUsername');
    console.log('search text is', searchText);
    searchText = searchText.replace(/\W+/g, "");
    if (searchText.length < 1) {
      return;
    }

    let people = this.get('store').query('user', {
      name: {
        username: searchText
      }
    });
    return people;
  }.property('studentUsername'),


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
      this.set('userAlreadyInSection', false);
    },

    userAlreadyInSection: function () {
      this.set('userAlreadyInSection', false);
      this.set('doYouWantToAddExistingUser', false);
    },

    exitAddExistingUsername: function () {
      this.set('doYouWantToAddExistingUser', false);
      this.set('userAlreadyInSection', false);
      this.set('studentUsername', '');
    },

    addStudent: function (student) {
      //onClick addStudent = studentUsername
      let section = this.get('section');
      // let student = this.get('searchResults');
      let username = this.get('studentUsername');
      console.log('editor', student);
      console.log('username', username);
      //check if username already exists in section
      let students = section.get('students');
      //let students = section.get('username');


      var checkRegisteredStudent = students.filterBy('username', username);
      //isempty will check the STUDENTS list (in front-end) to see if
      //the new username we are trying to add already exists.
      if (!Ember.isEmpty(checkRegisteredStudent)) {
        this.set('userAlreadyInSection', true);
        console.log('user not in this section');
      } else if (!section.get('students').contains(student)){
        section.get('students').pushObject(student);
        section.save();  //adds the new student (username) to database (backend)
    }
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
        students.pushObject(student);  //add student into students list
        this.set('doYouWantToAddExistingUser', false);
        //save section in student
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
      var username = this.get('studentUsername');
      console.log('username', username);
      var usingDefaultPassword = this.get('usingDefaultPassword');
      var password;
      var sectionId = this.get('section').id;
      var sectionRole = 'student';
      var currentUser = that.get('currentUser');
      let section = this.get('section');
      //let students = section.get('students');

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
        sectionId: sectionId,
        sectionRole: sectionRole,
        createdBy: currentUser.id,
        isAuthorized: true,
        accountType: 'S'
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
          } else if (res.message === 'Can add existing user') {
            this.set('doYouWantToAddExistingUser', true);
            this.set('existingUser', res.user);
          } else {
            var userId = res._id;
            var section = this.get('section');
            var students = section.get('students');
            var studentPassword = section.get('studentPassword');
            console.log('section password is currently', studentPassword);
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

      if (this.userAlreadyInSection) {
        this.set('userAlreadyInSection', false);
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