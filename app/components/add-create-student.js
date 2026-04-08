import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class AddCreateStudentComponent extends ErrorHandlingComponent {
  @tracked isUsingDefaultPassword = false;
  @tracked showingPassword = false;
  @tracked isShowingClassPassword = true;
  @tracked createUserErrors = [];
  @tracked findUserErrors = [];
  @tracked updateSectionErrors = [];
  @tracked usernameAlreadyExists = false;
  @tracked userAlreadyInSection = false;
  @tracked isMissingCredentials = false;
  @tracked incorrectUsername = false;
  @service('sweet-alert') alert;
  @service store;
  @service currentUser;

  clearCreateInputs() {
    let fields = ['username', 'firstName', 'lastName', 'password'];
    for (let field of fields) {
      this[field] = null;
    }
  }

  clearAddExistingUser() {
    let fields = ['canAddExistingUser', 'existingUser'];
    for (let field of fields) {
      this[field] = null;
    }
  }

  get initialStudentOptions() {
    let peeked = this.store.peekAll('user').toArray();
    let currentStudents = this.args.students.toArray();
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
  }

  async createStudent(info) {
    // info is object with username, password, name?
    let { username, password, firstName, lastName } = info;

    let organization = this.organization;
    let sectionId = this.args.section.id;
    let sectionRole = 'student';
    let currentUser = this.currentUser.user;

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

    const org = organization || (await currentUser.organization);
    createUserData.organization = org?.id;

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(createUserData),
        credentials: 'same-origin',
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const res = await response.json();
      this.removeMessages('createUserErrors');
      if (res.message) {
        if (res.message === 'There already exists a user with that username') {
          this.usernameAlreadyExists = true;
        } else {
          this.createUserErrors = [res.message];
        }
      } else if (res.user && res.canAddExistingUser === true) {
        this.canAddExistingUser = true;
        this.existingUser = res.user;
      } else {
        const userId = res._id;
        const section = this.args.section;
        const students = section.get('students');
        try {
          const user = await this.store.findRecord('user', userId);
          students.pushObject(user);
          try {
            await section.save();
            this.clearCreateInputs();
            this.alert.showToast(
              'success',
              'Student Created',
              'bottom-end',
              3000,
              false,
              null
            );
          } catch (err) {
            this.handleErrors(err, 'updateSectionErrors', section);
          }
        } catch (err) {
          this.handleErrors(err, 'findUserErrors');
        }
      }
    } catch (err) {
      this.handleErrors(err, 'createUserErrors');
    }
  }

  clearSelectizeInput(id) {
    if (!id) {
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      return;
    }
    const selectize = el.selectize;
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
        this.removeMessages('findUserErrors');
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
        this.handleErrors(err, 'findUserErrors');
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
        this.handleErrors(err, 'updateSectionErrors');
      });
  }
}
