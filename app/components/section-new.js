import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'section-new',
  className: ['sections'],
  alert: service('sweet-alert'),
  createdSection: null,
  createRecordErrors: [],
  teacher: null,
  leader: null,
  teachers: [],
  invalidTeacherUsername: null,
  selectedOrganization: null,
  missingFieldsError: null,
  userOrg: null,

  constraints: {
    name: {
      presence: { allowEmpty: false },
    },
    teacher: {
      presence: { allowEmpty: false },
    },
    organization: {
      presence: { allowEmpty: false },
    },
  },

  init: function () {
    this._super(...arguments);
    let tooltips = {
      name: 'Please give your class a name',
      leader: 'The main owner of this class',
      organization:
        "The organization of this class is the same as the leader's",
    };
    this.set('tooltips', tooltips);
  },

  didReceiveAttrs: function () {
    let users = this.users;
    let userList = this.userList;

    if (!isEqual(users, userList)) {
      this.set('userList', users);
      //filter out students for adding teachers;
      let addableTeachers = users.rejectBy('accountType', 'S');
      this.set('addableTeachers', addableTeachers);
    }
  },

  //Non admin User creating section
  //set user as teacher
  didInsertElement: function () {
    var user = this.user;
    if (!user.get('isAdmin')) {
      this.set('teacher', user);
    }
  },

  setTeacher: observer('teacher', function () {
    let teacher = this.teacher;
    if (!teacher) {
      if (this.organization) {
        this.set('organization', null);
      }
      return;
    }

    if (typeof teacher === 'string') {
      let users = this.users;
      let user = users.findBy('username', teacher);
      if (!user) {
        this.set('invalidTeacherUsername', true);
        this.set('organization', null);
        return;
      }
      teacher = user;
    }

    let organization = teacher.get('organization');

    if (organization) {
      this.set('organization', organization);
    } else {
      this.set('organization', this.currentUser.organization);
    }
    if (this.invalidTeacherUsername) {
      this.set('invalidTeacherUsername', null);
    }
  }),

  validTeacher: computed('teacher', 'invalidTeacherUsername', function () {
    return this.teacher && !this.invalidTeacherUsername;
  }),

  actions: {
    createSection: function () {
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
          this.set(errorProp, validation[key]);
          $('#create-class').addClass('animated shake slow');
        }
        return;
      }

      if (typeof teacher === 'string') {
        let users = this.users;
        let user = users.findBy('username', teacher);
        if (!user) {
          this.set('invalidTeacherUsername', true);
          return;
        }
        teacher = user;
      }

      var sectionData = this.store.createRecord('section', {
        name: newSectionName,
        organization: this.organization,
        createdBy: this.user,
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
          this.set('createdSection', section);
          this.sendAction('toSectionInfo', section);
        })
        .catch((err) => {
          this.handleErrors(err, 'createRecordErrors', sectionData);
        });
    },

    closeError: function (error) {
      $('.error-box').addClass('fadeOutRight');
      later(() => {
        $('.error-box').remove();
      }, 500);
    },

    checkError: function () {
      if (this.missingFieldsError) {
        this.set('missingFieldsError', false);
      }
    },

    cancel: function () {
      this.sendAction('toSectionsHome');
    },
  },
});
