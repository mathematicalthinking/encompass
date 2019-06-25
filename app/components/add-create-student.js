/*global _:false */
Encompass.AddCreateStudentComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  elementId: 'add-create-student',
  isUsingDefaultPassword: false,
  fieldType: 'password',
  isShowingClassPassword: true,
  createUserErrors: [],
  findUserErrors: [],
  updateSectionErrors: [],
  alert: Ember.inject.service('sweet-alert'),

  clearCreateInputs: function () {
    let fields = ['username', 'name', 'password'];
    for (let field of fields) {
      this.set(field, null);
    }
  },

  clearAddExistingUser: function () {
    let fields = ['canAddExistingUser', 'existingUser'];
    for (let field of fields) {
      this.set(field, null);
    }
  },

  initialStudentOptions: function() {
    let peeked = this.get('store').peekAll('user').toArray();
    let currentStudents = this.get('students').toArray();
    let filtered = [];

    if (peeked && currentStudents) {
      filtered = peeked.removeObjects(currentStudents);
      return filtered.map((obj) => {
        return {
          id: obj.get('id'),
          username: obj.get('username')
        };
      });
    }
    return filtered;

  }.property('students.[]'),

  createStudent: function (info) {
    const that = this;
    // info is object with username, password, name?
    let {
      username,
      password,
      name
    } = info;

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
    } else {
      createUserData.organization = this.get('currentUser.organization.id');
    }

    return Ember.$.post({
        url: '/auth/signup',
        data: createUserData
      })
      .then((res) => {
        that.removeMessages('createUserErrors');
        if (res.message === 'There already exists a user with that username') {
          that.set('usernameAlreadyExists', true);
          return;
        } else if (res.user && res.canAddExistingUser === true) {
          this.set('canAddExistingUser', true);
          this.set('existingUser', res.user);
        } else {
          let userId = res._id;
          let section = this.get('section');
          let students = section.get('students');
          return this.store.findRecord('user', userId)
            .then((user) => {
              students.pushObject(user); //add student to students aray
              section.save().then(() => {
                  that.clearCreateInputs();
                  this.get('alert').showToast('success', 'Student Created', 'bottom-end', 3000, false, null);
                })
                .catch((err) => {
                  that.handleErrors(err, 'updateSectionErrors', section);
                });
            })
            .catch((err) => {
              that.handleErrors(err, 'findUserErrors');
            });
        }
      })
      .catch((err) => {
        that.handleErrors(err, 'createUserErrors', createUserData);

      });
  },

  clearSelectizeInput(id) {
    if (!id) {
      return;
    }
    let selectize = this.$(`#${id}`)[0].selectize;
    if (!selectize) {
      return;
    }
    selectize.clear();
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

    addExistingStudent: function () {
      let student = this.get('existingUser');
      if (!student) {
        return;
      }
      let students = this.get('students');
      this.store.findRecord('user', student._id).then((user) => {
        this.removeMessags('findUserErrors');
        if (!students.includes(user)) {
          students.pushObject(user);

          this.clearAddExistingUser();
          this.clearCreateInputs();
        } else {
          this.set('userAlreadyInSection', true);
        }
      })
      .catch((err) => {
        this.handleErrors(err, 'findUserErrors');
      });
    },

    exitAddExistingUsername: function () {
      this.clearAddExistingUser();
      this.clearCreateInputs();
    },

    validateCreateStudent: function () {
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

    updateSectionPassword: function () {
      this.set('isEditingSectionPassword', false);
      let section = this.get('section');
      if (section.get('hasDirtyAttributes')) {
        section.save().then(() => {
          this.get('alert').showToast('success', 'Class Password Updated', 'bottom-end', 3000, false, null);
          this.removeMessages('updateSectionErrors');
        })
        .catch((err) => {
          this.handleErrors(err, 'updateSectionErrors');
        });
      }
    },
    updateStudents: function(val, $item) {
      if (!val) {
        return;
      }
      let user = this.get('store').peekRecord('user', val);
      if (!user) {
        return;
      }

      let students = this.get('students');

      // adding
      if (students.includes(user)) {
        this.set('userAlreadyInSection', true);
        this.clearSelectizeInput('select-add-student');
        return;
      }
      students.addObject(user);

      this.get('section').save()
        .then(() => {
          this.get('alert').showToast('success', 'Student Added', 'bottom-end', 3000, false, null);
          // clear selectize
          this.clearSelectizeInput('select-add-student');
        })
        .catch((err) => {
          this.handleErrors(err, 'updateSectionErrors');
        });
    }
  }
});