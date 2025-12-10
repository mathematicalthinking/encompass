import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default class AddCreateStudentComponent extends Component {
  @service('sweet-alert') alert;
  @service errorHandling;
  @service currentUser;
  @service store;

  @tracked username = null;
  @tracked firstName = null;
  @tracked lastName = null;
  @tracked password = null;
  @tracked isUsingDefaultPassword = false;
  @tracked showingPassword = false;
  @tracked isShowingClassPassword = true;
  @tracked usernameAlreadyExists = false;
  @tracked userAlreadyInSection = false;
  @tracked isMissingCredentials = false;
  @tracked incorrectUsername = false;

  clearCreateInputs() {
    this.username = null;
    this.firstName = null;
    this.lastName = null;
    this.password = null;
  }

  clearAddExistingUser() {
    let fields = ['canAddExistingUser', 'existingUser'];
    for (let field of fields) {
      this[field] = null;
    }
  }

  get createUserErrors() {
    return this.errorHandling.getErrors('createUserErrors') || [];
  }

  get findUserErrors() {
    return this.errorHandling.getErrors('findUserErrors') || [];
  }

  get updateSectionErrors() {
    return this.errorHandling.getErrors('updateSectionErrors') || [];
  }

  get initialStudentOptions() {
    let peeked = this.store.peekAll('user').toArray();
    let currentStudents = this.args.students.toArray();
    let filtered = [];

    if (peeked && currentStudents) {
      filtered = peeked.removeObjects(currentStudents);
      return filtered.map((obj) => {
        return {
          id: obj.id,
          username: obj.username,
        };
      });
    }
    return filtered;
  }

  async createStudent(info) {
    // info is object with username, password, name?
    let { username, password, firstName, lastName } = info;

    let organization = this.organization;
    let sectionId = this.args.section.id;
    let sectionRole = 'student';
    let currentUserId = this.currentUser.id;

    let createUserData = {
      firstName,
      lastName,
      username,
      password,
      sectionId,
      sectionRole,
      createdBy: currentUserId,
      isAuthorized: true,
      accountType: 'S',
      authorizedBy: currentUserId,
      isFromSectionPage: true,
    };

    if (organization) {
      createUserData.organization = organization.id;
    } else {
      createUserData.organization =
        (await this.currentUser.user.organization?.id) ?? '';
    }

    return $.post({
      url: '/auth/signup',
      data: createUserData,
    })
      .then(async (res) => {
        this.errorHandling.removeMessages('createUserErrors');
        if (res.message) {
          if (
            res.message === 'There already exists a user with that username'
          ) {
            this.usernameAlreadyExists = true;
          } else {
            this.errorHandling.handleErrors(res.message, 'createUserErrors');
          }
        } else if (res.user && res.canAddExistingUser === true) {
          this.canAddExistingUser = true;
          this.existingUser = res.user;
        } else {
          let userId = res._id;
          let section = this.args.section;
          let students = await section.students;
          return this.store
            .findRecord('user', userId)
            .then((user) => {
              students.pushObject(user); //add student to students aray
              section
                .save()
                .then(() => {
                  this.clearCreateInputs();
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
                  this.errorHandling.handleErrors(
                    err,
                    'updateSectionErrors',
                    section
                  );
                });
            })
            .catch((err) => {
              this.errorHandling.handleErrors(err, 'findUserErrors');
            });
        }
      })
      .catch((err) => {
        this.errorHandling.handleErrors(
          err,
          'createUserErrors',
          createUserData
        );
      });
  }

  clearSelectizeInput(id) {
    if (!id) {
      return;
    }
    let selectize = $(`#${id}`)[0].selectize;
    if (!selectize) {
      return;
    }
    selectize.clear();
  }

  @action showPassword() {
    this.showingPassword = !this.showingPassword;
  }

  @action addExistingStudent() {
    let student = this.existingUser;
    if (!student) {
      return;
    }
    let students = this.args.students;
    this.store
      .findRecord('user', student._id)
      .then((user) => {
        this.errorHandling.removeMessages('findUserErrors');
        if (!students.includes(user)) {
          students.pushObject(user);

          this.clearAddExistingUser();
          this.clearCreateInputs();
          this.args.section.save().then(() => {
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
          this.userAlreadyInSection = true;
        }
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'findUserErrors');
      });
  }

  @action exitAddExistingUsername() {
    this.clearAddExistingUser();
    this.clearCreateInputs();
  }

  @action validateCreateStudent() {
    const username = this.username;
    let password;

    const isUsingDefaultPassword = this.isUsingDefaultPassword;

    if (isUsingDefaultPassword) {
      password = this.args.sectionPassword;
    } else {
      password = this.password;
    }

    if (!username || !password) {
      this.isMissingCredentials = true;
      return;
    }

    const students = this.args.students;

    if (!isEmpty(students.findBy('username', username))) {
      this.userAlreadyInSection = true;
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
  }

  @action usernameValidate() {
    var username = this.username;
    if (username) {
      var usernamePattern = new RegExp(/^[a-z0-9_]{3,30}$/);
      var usernameTest = usernamePattern.test(username);

      if (usernameTest === false) {
        this.incorrectUsername = true;
        return;
      }

      if (usernameTest === true) {
        this.incorrectUsername = false;
        this.isMissingCredentials = false;
        return;
      }
    }
  }

  @action checkError() {
    let errors = [
      'usernameAlreadyExists',
      'userAlreadyInSection',
      'isMissingCredentials',
    ];

    for (let error of errors) {
      if (this[error]) {
        this[error] = false;
      }
    }
  }

  @action updateSectionPassword() {
    this.isEditingSectionPassword = false;
    let section = this.args.section;
    if (section.hasDirtyAttributes) {
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
          this.errorHandling.removeMessages('updateSectionErrors');
        })
        .catch((err) => {
          this.errorHandling.handleErrors(err, 'updateSectionErrors');
        });
    }
  }
  @action updateStudents(val, $item) {
    if (!val) {
      return;
    }
    let user = this.store.peekRecord('user', val);
    if (!user) {
      return;
    }

    let students = this.args.students;

    // adding
    if (students.includes(user)) {
      this.userAlreadyInSection = true;
      this.clearSelectizeInput('select-add-student');
      return;
    }
    students.addObject(user);

    this.args.section
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
        this.errorHandling.handleErrors(err, 'updateSectionErrors');
      });
  }

  @action
  setIsEditingSectionPassword(val) {
    this.isEditingSectionPassword = val;
  }

  @action
  setIsShowingClassPassword(val) {
    this.isShowingClassPassword = val;
  }
}
