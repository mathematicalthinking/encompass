Encompass.AddCreateStudentComponent = Ember.Component.extend({
  elementId: 'add-create-student',
  isUsingDefaultPassword: false,
  fieldType: 'password',
  isShowingClassPassword: true,

  clearCreateInputs: function() {
    let fields = ['username', 'name', 'password'];

    for (let field of fields) {
      this.set(field, null);
    }
  },
  clearAddExistingUser: function() {
  let fields = ['canAddExistingUser', 'canAddExistingUser', 'canAddExistingUser'];

    for (let field of fields) {
      this.set(field, null);
    }
  },

  addStudent: function() {
    let student = this.get('studentToAdd');
    if (!student) {
      return;
    }

    let students = this.get('students');

    if (students.includes(student)) {
      this.set('userAlreadyInSection', true);
      this.set('studentToAdd', null);
      return;
    }

    students.pushObject(student);
    this.set('studentToAdd', null);
  }.observes('studentToAdd'),



  createStudent: function (info) {
    const that = this;
    // info is object with username, password, name?
    let { username, password, name } = info;


    let organization = this.get('organization');

    let sectionId = this.get('section').id;
    let sectionRole = 'student';
    let currentUser = that.get('currentUser');

    let createUserData = {
      name,
      username,
      password,
      sectionId,
      sectionRole,
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
        if (res.message === 'Username already exists') {
          that.set('usernameAlreadyExists', true);
          return;
        } else if (res.message === 'Can add existing user') {
          this.set('canAddExistingUser', true);
          this.set('existingUser', res.user);
        } else {
          let userId = res._id;
          let section = this.get('section');
          let students = section.get('students');
          return this.store.findRecord('user', userId)
            .then((user) => {
              students.pushObject(user);   //add student to students aray
              section.save();  //save section
              that.clearCreateInputs();
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

  actions: {
    showPassword: function () {
      let isShowingPassword = this.get('showingPassword');
      if (!isShowingPassword) {
        this.set('showingPassword', true);
        this.set('fieldType', 'text');
      } else {
        this.set('showingPassword', false);
        this.set('fieldType', 'password');
      }
    },

    addExistingStudent: function() {
      let student = this.get('existingUser');
      if (!student) {
        return;
      }
      let students = this.get('students');
      this.store.findRecord('user', student._id).then((user) => {
        if (!students.includes(user)) {
          students.pushObject(user);
          this.clearAddExistingUser();
          this.clearCreateInputs();
        } else {
          this.set('userAlreadyInSection', true);
        }
      });
    },

    exitAddExistingUsername: function () {
      this.clearAddExistingUser();
      this.clearCreateInputs();
    },

    validateCreateStudent: function() {
      const username = this.get('username');
      let password;

      const isUsingDefaultPassword = this.get('isUsingDefaultPassword');

      if (isUsingDefaultPassword) {
        password = this.get('sectionPassword');
      } else {
        password = this.get('password');
      }

      if (!username || !password) {
        this.set('isMissingCredentials', true);
        return;
      }

      const students = this.get('students');

      if (!Ember.isEmpty(students.findBy('username', username))) {
        this.set('userAlreadyInSection', true);
        return;
      }

      if (this.get('incorrectUsername')) {
        return;
      }

      const name = this.get('name');

      const ret = {
        username,
        password,
        name
      };
      this.createStudent(ret);
    },

    usernameValidate() {
      var username = this.get('username');
      if (username) {
        var usernamePattern = new RegExp(/^[a-z0-9.\-_@]{3,64}$/);
        var usernameTest = usernamePattern.test(username);

        if (usernameTest === false) {
          this.set('incorrectUsername', true);
          return;
        }

        if (usernameTest === true) {
          this.set('incorrectUsername', false);
          this.set('isMissingCredentials', false);
          return;
        }
      }
    },

    checkError: function () {
      let errors = ['usernameAlreadyExists', 'userAlreadyInSection', 'isMissingCredentials'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, null);
        }
      }
    },

    updateSectionPassword: function() {
      this.set('isEditingSectionPassword', false);
      let section = this.get('section');
      if (section.get('dirtyType') === 'updated') {
        section.save().then(() => {
          console.log('section password updated!');
        });
      }

    }
  }
});