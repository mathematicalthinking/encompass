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
  @tracked invalidTeacherUsername = null;
  @tracked selectedOrganization = null;
  @tracked missingFieldsError = false;
  @tracked userOrg = null;
  @tracked newSectionName = '';
  @tracked teacher = null;
  @tracked teacherFormErrors = [];
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
    if (!this.args.user.isAdmin) {
      this.teacher = this.args.user;
      this.organization = this.teacher.get('organization');
    }
  }

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

  @action createSection() {
    if (this.invalidTeacherUsername) {
      return;
    }
    var newSectionName = this.newSectionName;
    var organization = this.organization;
    var teacher = this.teacher;

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

    var sectionData = this.store.createRecord('section', {
      name: newSectionName,
      organization: this.organization,
      createdBy: this.args.user,
    });

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
  }

  @action cancel() {
    this.router.transitionTo('sections');
  }
}
