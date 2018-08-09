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

  //Non admin User creating section
  //set user as teacher
  didInsertElement: function () {
    var user = this.get('user');
    var teachers = this.get('teachers');
    if (!user.get('isAdmin')) {
      this.set('leader', user);
      teachers.pushObject(user);
    }
  },

  actions: {
    createSection: function () {
      var that = this;
      var newSectionName = this.get('newSectionName');
      if (!newSectionName) {
        this.set('missingFieldsError', true);
        return;
      }
      //var organization = this.get('selectedOrganization');
      var user = this.get('user');
      var organization = user.get('organization');
      var teacher = this.get('teacher');
      //var leader = this.get('leader');
      var teachers = this.get('teachers');
      if (user.get('isAdmin')) {
        //check if user exists
        let users = this.users.filterBy('username', teacher);
        if (!Ember.isEmpty(users)) {
          let user = users.get('firstObject');
          teachers.pushObject(user);
        } else {
          this.set('invalidTeacherUsername', true);
          return;
        }
      }

      var sectionData = this.store.createRecord('section', {
        name: newSectionName,
        organization: organization
      });

      for (let teacher of teachers) {
        sectionData.get('teachers').addObject(teacher);
      }

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




