Encompass.AddCreateStudentComponent = Ember.Component.extend({
  elementId: 'add-create-student',
  isUsingDefaultPassword: false,
  fieldType: 'password',

  clearFields: function(doInputs, doErrors, doExistingUser) {
    let fields = [];

    if (doInputs) {
      fields = fields.concat(['username', 'name', 'password']);
    }

  if (doErrors) {
    let errors = ['userAlreadyInSection', 'isMissingCredentials'];
    fields = fields.concat(errors);
  }

  if (doExistingUser) {
    fields = fields.concat(['canAddExistingUser', 'existingUser']);
  }

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
    let isUsingDefaultPassword = this.get('isUsingDefaultPassword');
    //let students = section.get('students');


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
          console.log('this inside', this);
          this.set('canAddExistingUser', true);
          this.set('existingUser', res.user);
        } else {
          let userId = res._id;
          let section = this.get('section');
          let students = section.get('students');
          let studentPassword = section.get('studentPassword');
          console.log('section password is currently', studentPassword);
          return this.store.findRecord('user', userId)
            .then((user) => {
              students.pushObject(user);   //add student to students aray
              section.save();  //save section
              that.clearFields(true, true, true);
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

    addExistingStudent: function() {
      let student = this.get('existingUser');
      if (!student) {
        return;
      }
      let students = this.get('students');
      this.store.findRecord('user', student._id).then((user) => {
        if (!students.includes(user)) {
          students.pushObject(user);
          this.clearFields(true, false, true);
        } else {
          this.set('userAlreadyInSection', true);
        }
      });
    },

    validateCreateStudent: function() {
      const username = this.get('username');
      let password;

      const isUsingDefaultPassword = this.get('isUsingDefaultPassword');

      if (isUsingDefaultPassword) {
        password = this.get('defaultPassword');
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

      const name = this.get('name');

      const ret = {
        username,
        password,
        name
      };
      this.createStudent(ret);
    },

  }


});