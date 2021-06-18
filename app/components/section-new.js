Encompass.SectionNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'section-new',
  className: ['sections'],
  alert: Ember.inject.service('sweet-alert'),
  routing: Ember.inject.service('-routing'),
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
      presence: { allowEmpty: false }
    },
    teacher: {
      presence: { allowEmpty: false }
    },
    organization: {
      presence: { allowEmpty: false }
    }
  },

  init: function () {
    this._super(...arguments);
    let tooltips = {
      name: 'Please give your class a name',
      leader: 'The main owner of this class',
      organization: 'The organization of this class is the same as the leader\'s',
    };
    this.set('tooltips', tooltips);
  },

  didReceiveAttrs: function() {
    let users = this.users;
    let userList = this.get('userList');

    if (!Ember.isEqual(users, userList)) {
      this.set('userList', users);
      //filter out students for adding teachers;
      let addableTeachers = users.rejectBy('accountType', 'S');
      this.set('addableTeachers', addableTeachers);
    }
  },

  //Non admin User creating section
  //set user as teacher
  didInsertElement: function () {
    var user = this.get('user');
    if (!user.get('isAdmin')) {
      this.set('teacher', user);
    }
  },

  setTeacher: function() {
    let teacher = this.get('teacher');
    if (!teacher) {
      if (this.get('organization')) {
        this.set('organization', null);
      }
      return;
    }

    if (typeof teacher === 'string') {
      let users = this.get('users');
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
      this.set('organization', this.get('currentUser.organization'));
    }
    if (this.get('invalidTeacherUsername')) {
      this.set('invalidTeacherUsername', null);
    }
  }.observes('teacher'),

  validTeacher: function() {
    return this.get('teacher') && !this.get('invalidTeacherUsername');
  }.property('teacher', 'invalidTeacherUsername'),

  actions: {
    createSection: function () {
      var that = this;

      if (this.get('invalidTeacherUsername')) {
        return;
      }
      var newSectionName = this.get('newSectionName');
      var organization = this.get('organization');
      var teacher = this.get('teacher');

      let constraints = this.get('constraints');
      let values = {
        name: newSectionName,
        teacher: teacher,
        organization: organization
      };
      let validation = window.validate(values, constraints);
      if (validation) { // errors
        for (let key of Object.keys(validation)) {
          let errorProp = `${key}FormErrors`;
          this.set(errorProp, validation[key]);
          $('#create-class').addClass('animated shake slow');
        }
        return;
      }

      var currentUser = this.get('currentUser');

      if (typeof teacher === 'string') {
        let users = this.get('users');
        let user = users.findBy('username', teacher);
        if (!user) {
          this.set('invalidTeacherUsername', true);
          return;
        }
        teacher = user;
      }

      var sectionData = this.store.createRecord('section', {
        name: newSectionName,
        organization: this.get('organization'),
        createdBy: currentUser,
      });

      sectionData.get('teachers').addObject(teacher);


      sectionData.save()
      .then((section) => {
        let name = section.get('name');
        this.get('alert').showToast('success', `${name} created`, 'bottom-end', 3000, false, null);
        that.set('createdSection', section);
        this.get('routing').router.transitionTo("sections.section", section.id);
      })
      .catch((err) => {
        that.handleErrors(err, 'createRecordErrors', sectionData);
      });
  },

    closeError: function(error) {
      $('.error-box').addClass('fadeOutRight');
      Ember.run.later(() => {
        $('.error-box').remove();
      }, 500);
    },

    checkError: function() {
      // if (this.invalidTeacherUsername) {
      //   this.set('invalidTeacherUsername', false);
      // }

      if (this.missingFieldsError) {
        this.set('missingFieldsError', false);
      }
    },

    cancel: function() {
      this.get('routing').router.transitionTo("sections");
    }
  }
});




