Encompass.SectionNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'section-new',
  className: ['sections'],
  createdSection: null,
  createSectionError: null,
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
    var teachers = this.get('teachers');
    if (!user.get('isAdmin')) {
      this.set('teacher', user);
      // this.set('leader', user);
      // teachers.pushObject(user);
    }
  },

  setTeacher: function() {
    let teacher = this.get('teacher');
    if (!teacher) {
      return;
    }

    let organization = teacher.get('organization');

    if (organization) {
      this.set('organization', organization);
    } else {
      this.set('organization', this.get('currentUser.organization'));
    }
  }.observes('teacher'),

  actions: {
    createSection: function () {
      var that = this;
      var newSectionName = this.get('newSectionName');
      var organization = this.get('organization');
      var teacher = this.get('teacher');

      if (!newSectionName || !teacher || !organization) {
        this.set('missingFieldsError', true);
        return;
      }
      var currentUser = this.get('currentUser');
      //var leader = this.get('leader');
      // var teachers = this.get('teachers');
      // if (user.get('isAdmin')) {
      //   //check if user exists
      //   let users = this.users.filterBy('username', teacher);
      //   if (!Ember.isEmpty(users)) {
      //     let user = users.get('firstObject');
      //     teachers.pushObject(user);
      //     let userOrg = user.get('organization');
      //     this.set('userOrg', userOrg);
      //   } else {
      //     this.set('invalidTeacherUsername', true);
      //     return;
      //   }
      // }

      var sectionData = this.store.createRecord('section', {
        name: newSectionName,
        organization: this.get('organization'),
        createdBy: currentUser,
      });

      sectionData.get('teachers').addObject(teacher);

      // for (let teacher of teachers) {
      //   sectionData.get('teachers').addObject(teacher);
      // }

      sectionData.save()
      .then((section) => {
        that.set('createdSection', section);
        that.sendAction('toSectionInfo', section);
      })
      .catch((err) => {
        that.set('createdSectionError', err);
      });
  },

    checkError: function() {
      if (this.invalidTeacherUsername) {
        this.set('invalidTeacherUsername', false);
      }

      if (this.missingFieldsError) {
        this.set('missingFieldsError', false);
      }
    }
  }
});




