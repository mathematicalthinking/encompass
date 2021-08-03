import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'add-create-student',
  isUsingDefaultPassword: false,
  fieldType: 'password',
  isShowingClassPassword: true,
  createUserErrors: [],
  findUserErrors: [],
  updateSectionErrors: [],
  alert: service('sweet-alert'),

  clearCreateInputs: function () {
    let fields = ['username', 'firstName', 'lastName', 'password'];
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

  initialStudentOptions: computed('students.[]', function () {
    let peeked = this.store.peekAll('user').toArray();
    let currentStudents = this.students.toArray();
    let filtered = [];

    if (peeked && currentStudents) {
      filtered = peeked.removeObjects(currentStudents);
      return filtered.map((obj) => {
        return {
          id: obj.get('id'),
          username: obj.get('username'),
        };
      });
    }
    return filtered;
  }),

  createStudent: function (info) {
    const that = this;
    // info is object with username, password, name?
    let { username, password, firstName, lastName } = info;

    let organization = this.organization;
    let sectionId = this.section.id;
    let sectionRole = 'student';
    let currentUser = that.get('currentUser');

    let createUserData = {
      firstName,
      lastName,
      username,
      password,
      sectionId,
      sectionRole,
      createdBy: currentUser.id,
      isAuthorized: true,
      accountType: 'S',
      authorizedBy: currentUser.id,
      isFromSectionPage: true,
    };

    if (organization) {
      createUserData.organization = organization.id;
    } else {
      createUserData.organization = this.currentUser.organization.id;
    }

    return $.post({
      url: '/auth/signup',
      data: createUserData,
    })
      .then((res) => {
        that.removeMessages('createUserErrors');
        if (res.message) {
          if (
            res.message === 'There already exists a user with that username'
          ) {
            that.set('usernameAlreadyExists', true);
          } else {
            this.set('createUserErrors', [res.message]);
          }
        } else if (res.user && res.canAddExistingUser === true) {
          this.set('canAddExistingUser', true);
          this.set('existingUser', res.user);
        } else {
          let userId = res._id;
          let section = this.section;
          let students = section.get('students');
          return this.store
            .findRecord('user', userId)
            .then((user) => {
              students.pushObject(user); //add student to students aray
              section
                .save()
                .then(() => {
                  that.clearCreateInputs();
                  this.alert.showToast(
                    'success',
                    'Student Created',
                    'bottom-end',
                    3000,
                    false,
                    null
                  );
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
      let isShowingPassword = this.showingPassword;
      if (!isShowingPassword) {
        this.set('showingPassword', true);
        this.set('fieldType', 'text');
      } else {
        this.set('showingPassword', false);
        this.set('fieldType', 'password');
      }
    },

    addExistingStudent: function () {
      let student = this.existingUser;
      if (!student) {
        return;
      }
      let students = this.students;
      this.store
        .findRecord('user', student._id)
        .then((user) => {
          this.removeMessages('findUserErrors');
          if (!students.includes(user)) {
            students.pushObject(user);

            this.clearAddExistingUser();
            this.clearCreateInputs();
            this.section.save().then(() => {
              this.alert.showToast(
                'success',
                'Student added',
                'bottom-end',
                3000,
                false,
                null
              );
            });
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
      const username = this.username;
      let password;

      const isUsingDefaultPassword = this.isUsingDefaultPassword;

      if (isUsingDefaultPassword) {
        password = this.sectionPassword;
      } else {
        password = this.password;
      }

      if (!username || !password) {
        this.set('isMissingCredentials', true);
        return;
      }

      const students = this.students;

      if (!isEmpty(students.findBy('username', username))) {
        this.set('userAlreadyInSection', true);
        return;
      }

      if (this.incorrectUsername) {
        return;
      }

      const firstName = this.firstName;
      const lastName = this.lastName;

      const ret = {
        username,
        password,
        firstName,
        lastName,
      };
      this.createStudent(ret);
    },

    usernameValidate() {
      var username = this.username;
      if (username) {
        var usernamePattern = new RegExp(/^[a-z0-9_]{3,30}$/);
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
      let errors = [
        'usernameAlreadyExists',
        'userAlreadyInSection',
        'isMissingCredentials',
      ];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, null);
        }
      }
    },

    updateSectionPassword: function () {
      this.set('isEditingSectionPassword', false);
      let section = this.section;
      if (section.get('hasDirtyAttributes')) {
        section
          .save()
          .then(() => {
            this.alert.showToast(
              'success',
              'Class Password Updated',
              'bottom-end',
              3000,
              false,
              null
            );
            this.removeMessages('updateSectionErrors');
          })
          .catch((err) => {
            this.handleErrors(err, 'updateSectionErrors');
          });
      }
    },
    updateStudents: function (val, $item) {
      if (!val) {
        return;
      }
      let user = this.store.peekRecord('user', val);
      if (!user) {
        return;
      }

      let students = this.students;

      // adding
      if (students.includes(user)) {
        this.set('userAlreadyInSection', true);
        this.clearSelectizeInput('select-add-student');
        return;
      }
      students.addObject(user);

      this.section
        .save()
        .then(() => {
          this.alert.showToast(
            'success',
            'Student Added',
            'bottom-end',
            3000,
            false,
            null
          );
          // clear selectize
          this.clearSelectizeInput('select-add-student');
        })
        .catch((err) => {
          this.handleErrors(err, 'updateSectionErrors');
        });
    },
  },
});
