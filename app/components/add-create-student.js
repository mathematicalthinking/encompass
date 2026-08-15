import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

export default class AddCreateStudentComponent extends ErrorHandlingComponent {
  @service('sweet-alert') alert;
  @service store;
  @service currentUser;

  // Form fields
  @tracked username = null;
  @tracked firstName = null;
  @tracked lastName = null;
  @tracked password = null;

  // UI state
  @tracked isUsingDefaultPassword = false;
  @tracked isEditingSectionPassword = false;
  @tracked showingPassword = false;
  @tracked isShowingClassPassword = true;

  // Error flags
  @tracked usernameAlreadyExists = false;
  @tracked userAlreadyInSection = false;
  @tracked isMissingCredentials = false;
  @tracked incorrectUsername = false;

  // Error message arrays
  @tracked createUserErrors = [];
  @tracked findUserErrors = [];
  @tracked updateSectionErrors = [];

  // Existing-user confirmation flow
  @tracked canAddExistingUser = false;
  @tracked existingUser = null;

  // ── helpers ──────────────────────────────────────────────────────────────

  clearCreateInputs() {
    this.username = null;
    this.firstName = null;
    this.lastName = null;
    this.password = null;
  }

  clearAddExistingUser() {
    this.canAddExistingUser = false;
    this.existingUser = null;
  }

  clearSelectizeInput(id) {
    const el = document.getElementById(id);
    const selectize = el?.selectize;
    if (selectize) {
      selectize.clear();
    }
  }

  // ── computed ─────────────────────────────────────────────────────────────

  get initialStudentOptions() {
    const allUsers = this.store.peekAll('user').slice();
    const currentStudentIds = new Set(this.args.students.map((s) => s.id));
    return allUsers
      .filter((u) => !currentStudentIds.has(u.id))
      .map((u) => ({ id: u.id, username: u.username }));
  }

  // ── actions ──────────────────────────────────────────────────────────────

  @action togglePassword() {
    this.showingPassword = !this.showingPassword;
  }

  @action startEditingSectionPassword() {
    this.isEditingSectionPassword = true;
  }

  @action showClassPassword() {
    this.isShowingClassPassword = true;
  }

  @action hideClassPassword() {
    this.isShowingClassPassword = false;
  }

  @action async updateSectionPassword() {
    this.isEditingSectionPassword = false;
    const section = this.args.section;
    if (!section.hasDirtyAttributes) {
      return;
    }
    try {
      await section.save();
      this.alert.showToast('success', 'Class Password Updated');
      this.removeMessages('updateSectionErrors');
    } catch (err) {
      this.handleErrors(err, 'updateSectionErrors');
    }
  }

  @action async updateStudents(val) {
    if (!val) {
      return;
    }
    const user = this.store.peekRecord('user', val);
    if (!user) {
      return;
    }
    const students = await this.args.section.students;
    if (students.includes(user)) {
      this.userAlreadyInSection = true;
      this.clearSelectizeInput('select-add-student');
      return;
    }
    students.push(user);
    try {
      await this.args.section.save();
      this.alert.showToast('success', 'Student Added');
      this.clearSelectizeInput('select-add-student');
    } catch (err) {
      this.handleErrors(err, 'updateSectionErrors');
    }
  }

  @action async addExistingStudent() {
    const student = this.existingUser;
    if (!student) {
      return;
    }
    try {
      const user = await this.store.findRecord('user', student._id);
      this.removeMessages('findUserErrors');
      const students = await this.args.section.students;
      if (students.includes(user)) {
        this.userAlreadyInSection = true;
        return;
      }
      students.push(user);
      this.clearAddExistingUser();
      this.clearCreateInputs();
      await this.args.section.save();
      this.alert.showToast('success', 'Student added');
    } catch (err) {
      this.handleErrors(err, 'findUserErrors');
    }
  }

  @action exitAddExistingUsername() {
    this.clearAddExistingUser();
    this.clearCreateInputs();
  }

  @action usernameValidate() {
    const username = this.username;
    if (!username) {
      return;
    }
    if (!USERNAME_PATTERN.test(username)) {
      this.incorrectUsername = true;
    } else {
      this.incorrectUsername = false;
      this.isMissingCredentials = false;
    }
  }

  @action checkError() {
    this.usernameAlreadyExists = false;
    this.userAlreadyInSection = false;
    this.isMissingCredentials = false;
  }

  @action validateCreateStudent() {
    const { username } = this;
    const password = this.isUsingDefaultPassword
      ? this.args.sectionPassword
      : this.password;

    if (!username || !password) {
      this.isMissingCredentials = true;
      return;
    }

    const alreadyInSection = this.args.students.find(
      (s) => s.username === username
    );
    if (alreadyInSection) {
      this.userAlreadyInSection = true;
      return;
    }

    if (this.incorrectUsername) {
      return;
    }

    this.createStudent({
      username,
      password,
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }

  async createStudent({ username, password, firstName, lastName }) {
    const currentUser = this.currentUser.user;
    const org = await currentUser.organization;

    const createUserData = {
      firstName,
      lastName,
      username,
      password,
      sectionId: this.args.section.id,
      sectionRole: 'student',
      createdBy: currentUser.id,
      isAuthorized: true,
      accountType: 'S',
      authorizedBy: currentUser.id,
      isFromSectionPage: true,
      organization: org?.id,
    };

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
        const section = this.args.section;
        try {
          const user = await this.store.findRecord('user', res._id);
          const students = await section.students;
          students.push(user);
          try {
            await section.save();
            this.clearCreateInputs();
            this.alert.showToast('success', 'Student Created');
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
}
