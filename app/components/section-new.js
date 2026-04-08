import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import validate from 'validate.js';

export default class SectionNewComponent extends Component {
  @service store;
  @service router;
  @service('sweet-alert') alert;
  @service errorHandling;
  @service currentUser;

  @tracked newSectionName = '';
  @tracked teacher = null;
  @tracked organization = null;
  @tracked invalidTeacherUsername = false;

  tooltips = {
    name: 'Please give your class a name',
    leader: 'The main owner of this class',
    organization: "The organization of this class is the same as the leader's",
  };

  constraints = {
    name: {
      presence: { allowEmpty: false },
    },
    teacher: {
      presence: { allowEmpty: false },
    },
    organization: {
      presence: { allowEmpty: false },
    },
  };

  constructor() {
    super(...arguments);
    // Non-admin user creating section: set user as teacher
    if (this.currentUser.isTeacher) {
      this.teacher = this.currentUser.user;
      this.organization = this.args.organization;
    }
    // PD Admin creating section
    if (this.currentUser.isPdAdmin) {
      this.organization = this.args.organization;
    }
  }

  get validTeacher() {
    return this.teacher && !this.invalidTeacherUsername;
  }

  get createRecordErrors() {
    return this.errorHandling.getErrors('createRecordErrors');
  }

  get nameFormErrors() {
    return this.errorHandling.getErrors('nameFormErrors');
  }

  get teacherFormErrors() {
    return this.errorHandling.getErrors('teacherFormErrors');
  }

  get organizationFormErrors() {
    return this.errorHandling.getErrors('organizationFormErrors');
  }

  @action async createSection() {
    const newSectionName = this.newSectionName;
    let teacher = this.teacher;

    if (typeof teacher === 'string') {
      const foundTeacher = this.args.users.find(
        (user) => user.username === teacher
      );
      if (!foundTeacher) {
        this.invalidTeacherUsername = true;
        return;
      }
      teacher = foundTeacher;
    }

    const organization =
      teacher && teacher.organization
        ? teacher.organization
        : this.organization ?? this.args.organization;

    const values = {
      name: newSectionName,
      teacher: teacher,
      organization,
    };

    const validation = validate(values, this.constraints);
    if (validation) {
      // Set error messages via error-handling service
      for (const key of Object.keys(validation)) {
        const errorProp = `${key}FormErrors`;
        this.errorHandling.errors[errorProp] = validation[key];
      }
      return;
    }

    // Clear any previous form errors
    this.errorHandling.removeMessages(
      'nameFormErrors',
      'teacherFormErrors',
      'organizationFormErrors'
    );

    const sectionData = this.store.createRecord('section', values);
    sectionData.teachers.addObject(teacher);

    try {
      const section = await sectionData.save();
      const name = section.name;
      this.alert.showToast(
        'success',
        `${name} created`,
        'bottom-end',
        3000,
        false,
        null
      );
      this.router.transitionTo('sections.section', section.id);
    } catch (err) {
      this.errorHandling.handleErrors(err, 'createRecordErrors', sectionData);
    }
  }

  @action
  handleNameChange(value) {
    this.newSectionName = value;
    this.errorHandling.removeMessages('nameFormErrors');
  }

  @action
  handleTeacherSelect(selectedTeacher) {
    this.teacher = selectedTeacher;
    this.invalidTeacherUsername = false;
    this.errorHandling.removeMessages('teacherFormErrors');
  }

  @action
  cancel() {
    this.router.transitionTo('sections');
  }
}
