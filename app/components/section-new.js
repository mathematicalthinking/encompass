import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class SectionNewComponent extends ErrorHandlingComponent {
  @service store;
  @service router;
  @service('sweet-alert') alert;
  @tracked createRecordErrors = [];
  @tracked teacher = null;
  @tracked leader = null;
  @tracked teachers = [];
  @tracked selectedOrganization = null;
  @tracked missingFieldsError = false;
  @tracked userOrg = null;
  @tracked newSectionName = '';
  @tracked teacher = null;
  @tracked teacherFormErrors = null;
  @tracked organization = null;
  @tracked organizationFormErrors = null;
  @tracked nameFormErrors = null;

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
  tooltips = {
    name: 'Please give your class a name',
    leader: 'The main owner of this class',
    organization: "The organization of this class is the same as the leader's",
  };

  //Non admin User creating section
  //set user as teacher
  constructor() {
    super(...arguments);
    if (this.args.user.isTeacher) {
      this.teacher = this.args.user;
      this.organization = this.teacher.get('organization');
    }
    if (this.args.user.isPdAdmin) {
      this.organization = this.args.user.get('organization');
    }
  }

  // get invalidTeacherUsername() {
  //   return !this.teacher;
  // }

  // setTeacher: observer('teacher', function () {
  //   let teacher = this.teacher;
  //   if (!teacher) {
  //     if (this.organization) {
  //       this.set('organization', null);
  //     }
  //     return;
  //   }

  //   if (typeof teacher === 'string') {
  //     let users = this.users;
  //     let user = users.findBy('username', teacher);
  //     if (!user) {
  //       this.set('invalidTeacherUsername', true);
  //       this.set('organization', null);
  //       return;
  //     }
  //     teacher = user;
  //   }

  //   let organization = teacher.get('organization');

  //   if (organization) {
  //     this.set('organization', organization);
  //   } else {
  //     this.set('organization', this.get('currentUser.organization'));
  //   }
  //   if (this.invalidTeacherUsername) {
  //     this.set('invalidTeacherUsername', null);
  //   }
  // }),

  get validTeacher() {
    return this.teacher && !this.invalidTeacherUsername;
  }

  @action async createSection() {
    let newSectionName = this.newSectionName;
    let teacher = this.teacher;
    if (typeof teacher === 'string') {
      teacher = await this.args.users.findBy('username', teacher);
    }
    let organization =
      teacher && teacher.get('organization')
        ? teacher.get('organization')
        : this.args.user.get('organization');

    let constraints = this.constraints;
    let values = {
      name: newSectionName,
      teacher: teacher,
      organization: organization,
    };
    let validation = window.validate(values, constraints);
    if (validation) {
      // errors
      for (let key of Object.keys(validation)) {
        let errorProp = `${key}FormErrors`;
        this[errorProp] = validation[key];
        $('#create-class').addClass('animated shake slow');
      }
      return;
    }

    if (typeof teacher === 'string') {
      let users = this.args.users;
      let user = users.findBy('username', teacher);
      if (!user) {
        this.invalidTeacherUsername = true;
        return;
      }
      teacher = user;
    }

    var sectionData = this.store.createRecord('section', values);

    sectionData.get('teachers').addObject(teacher);

    sectionData
      .save()
      .then((section) => {
        let name = section.get('name');
        this.alert.showToast(
          'success',
          `${name} created`,
          'bottom-end',
          3000,
          false,
          null
        );
        this.router.transitionTo('sections.section', section.id);
      })
      .catch((err) => {
        this.handleErrors(err, 'createRecordErrors', sectionData);
      });
  }

  @action closeError(error) {
    $('.error-box').addClass('fadeOutRight');
    later(() => {
      $('.error-box').remove();
    }, 500);
  }

  @action checkError() {
    if (this.missingFieldsError) {
      this.missingFieldsError = false;
    }
    const errorsList = [
      'teacherFormErrors',
      'nameFormErrors',
      'organizationFormErrors',
    ];
    errorsList.forEach((err) => (this[err] = null));
  }

  @action cancel() {
    this.router.transitionTo('sections');
  }
}
