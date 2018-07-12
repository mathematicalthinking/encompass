Encompass.SectionNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'sections',
  className: ['sections'],
  sectionId: '',
  createdSection: null,
  createSectionError: null,
  teacher: null,
  teachers: [],
  invalidTeacherUsername: null,

  isAddStudents: 0,
  isAddStudent: Ember.computed.equal('isAddStudents', 0),
  isNotAddStudent: Ember.computed.equal('isAddStudents', 1)

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
    radioSelect: function (value) {
      console.log('value', value);
      this.set('isAddStudents', value);
    },

    addNewStudents: function() {
      var addNewStudent = this.get('isAddStudent');

      Ember.run(function() {
        if(addNewStudent) { addStudent.send('addStudent'); }
      });
    },

  createSection: function () {
    var that = this;
    var isAddStudents = that.get('isAddStudents');
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
      schoolId: schoolName,
      isAddStudents: isAddStudents
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

  addStudent: function() {

  }


}
});

