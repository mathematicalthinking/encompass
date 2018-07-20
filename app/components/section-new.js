Encompass.SectionNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'sections',
  className: ['sections'],
  sectionId: '',
  createdSection: null,
  createSectionError: null,
  teacher: null,
  leader: null,
  teachers: [],
  invalidTeacherUsername: null,
  isAddStudents: false,
  createdStudents: null,
  selectedOrganization: null,
  isAddingStudents: false,
  usingDefaultPassword: true,
  usernameAlreadyExists: null,
  isMissingPassword: null,
  isMissingUsername: null,
  missingFieldsError: null,


  //Non admin User creating section
  //set user as teacher
  didInsertElement: function () {
    var user = this.get('user');
    var teachers = this.get('teachers');
    console.log('user in didinsert', user);
    if (!user.get('isAdmin')) {
      this.set('leader', user);
      teachers.pushObject(user);
    }
  },

  willDestroyElement: function() {
    console.log('destroyingEl');
    this.set('createdStudents', null);
  },

  //Array containing students in a section/class
  studentsNotEmpty: Ember.computed('createdStudents.[]', function() {

    var createdStudents = this.get('createdStudents');
    if (createdStudents === null) {
      return false;
    }
    console.log('createdStudents', createdStudents);
    console.log('len', createdStudents.length);
    return createdStudents.get('length') > 0;
  }),

  actions: {
    addNewStudents: function() {
      this.set('isAddingStudents', true);
     },
    createStudent: function() {
      var that = this;
      var username = this.get('studentUsername');
      var usingDefaultPassword = this.get('usingDefaultPassword');
      var password;

      if (usingDefaultPassword) {
        password = this.get('defaultPassword');
      } else {
        password = this.get('studentPassword');
      }
      if (!password) {
        this.set('isMissingPassword', true);
        return;
      }
      if(!username) {
        this.set('isMissingUsername', true);
        return;
      }
      var createUserData = {
        username: username,
        password: password,
        isStudent: true
      };

      return Ember.$.post({
        url: '/auth/signup',
        data: createUserData
      })
      .then((res) => {
        if (res.message === 'Username already exists') {
          that.set('usernameAlreadyExists', true);
          return;
        }else {
          var userId = res._id;
          if (that.get('createdStudents') === null) {
            that.set('createdStudents', []);
          }
          var students = that.get('createdStudents');
          return that.store.findRecord('user', userId)
            .then((user) => {
              console.log('user found', user.get('username'));
              students.pushObject(user);
              that.set('studentUsername', '');
              if (!usingDefaultPassword) {
                that.set('studentPassword', '');
              }
            })
            .catch((err) => {
              console.log(err);
            });
          }
      })
      .catch((err) => {
          console.log(err);
    });
  },

  createSection: function () {
    var that = this;
    var newSectionName = this.get('newSectionName');
    if (!newSectionName) {
      this.set('missingFieldsError', true);
      return;
    }
    var organization = this.get('selectedOrganization');
    var user = this.get('user');
    var students = this.get('createdStudents');
    var teacher = this.get('teacher');
    var leader = this.get('leader');
    var teachers = this.get('teachers');
    if (user.get('isAdmin')) {
      //check if user exists
      let users = this.users.filterBy('username', teacher);
      console.log('users');
      if (!Ember.isEmpty(users)) {
        let user = users.get('firstObject');
        console.log('teacher', user)
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

    for (let student of students) {
      sectionData.get('students').addObject(student);
    }

    sectionData.save()
    .then((prob) => {
      that.set('createdSection', prob);
    })
    .catch((err) => {
      that.set('createdSectionError', err);
    });
        console.log('createdstudents', []);
        this.set('createdStudents', []);
        console.log('clear after create section 11', []);
  },

  // clearStudentsData: function() {
  //   this.set('createdStudents2', []);
  //   console.log('clear after create section 2', []);
  // },

  checkError: function() {
    if (this.invalidTeacherUsername) {
      this.set('invalidTeacherUsername', false);
    }

    if(this.usernameAlreadyExists) {
      this.set('usernameAlreadyExists', false);
    }

    if (this.isMissingPassword) {
      this.set('isMissingPassword', false);
    }
    if (this.missingFieldsError) {
      this.set('missingFieldsError', false);
    }
  }
}
});


