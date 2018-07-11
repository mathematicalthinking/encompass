Encompass.SectionNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'sections',
  className: ['sections'],
  sectionId: '',
  createdSection: null,
  createSectionError: null,
  teacher: null,
  teachers: [],
  invalidTeacherUsername: null,

  //Non admin User creating section
  didInsertElement: function () {
    var user = this.get('user');
    var teachers = this.get('teachers');
    console.log('user in didinsert', user);
    if (!user.get('isAdmin')) {
      this.set('teacher', user);
      teachers.push(user);
    }
  },

  actions: {
  createSection: function () {
    var that = this;
    var newSectionName = this.get('newSectionName');
    var sectionId = this.get('sectionId');
    var schoolName = this.get('schoolName');
    var user = this.get('user');
    var teacher = this.get('teacher');
    var teachers = this.get('teachers');
    if (user.get('isAdmin')) {
      //check if user exists
      let users = this.users.filterBy('username', teacher);
      if (!Ember.isEmpty(users)) {
        let user = users.get('firstObject');
        teachers.push(user);
      } else {
        this.set('invalidTeacherUsername', true);
        return;
      }
    }
    this.set('newSectionName', '');
    console.debug('creating new section ' + newSectionName);

    if (!newSectionName) {
      return;
    }
    var sectionData = this.store.createRecord('section', {
      name: newSectionName,
      sectionId: sectionId,
      schoolId: schoolName
    });

    for (let teacher of teachers) {
      sectionData.get('teachers').addObject(teacher);
    }

    sectionData.save()
    .then((prob) => {
      that.set('createdSection', prob);
    })
    .catch((err) => {
      that.set('createdSectionError', err);
    });
  },
  checkError() {
    if (this.invalidTeacherUsername) {
      this.set('invalidTeacherUsername', false);
    }
  }
}
});