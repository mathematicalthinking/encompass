Encompass.SectionNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'section-new',
  className: ['sections'],
  createdSection: null,
  createRecordErrors: [],
  teacher: null,
  leader: null,
  teachers: [],
  invalidTeacherUsername: null,
  selectedOrganization: null,
  missingFieldsError: null,
  userOrg: null,

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

      if (!newSectionName || !teacher || !organization) {
        this.set('missingFieldsError', true);
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
        that.set('createdSection', section);
        that.sendAction('toSectionInfo', section);
      })
      .catch((err) => {
        that.handleErrors(err, 'createRecordErrors', sectionData);
      });
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
      this.sendAction('toSectionsHome');
    }
  }
});




