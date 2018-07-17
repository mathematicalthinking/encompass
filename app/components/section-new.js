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
  createdStudents: [],
  selectedOrganization: null,
  isAddingStudents: false,
  usingDefaultPassword: true,
  usernameAlreadyExists: null,
  isMissingPassword: null,
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
    this.set('createdStudents', []);
  },

  studentsNotEmpty: Ember.computed('createdStudents.[]', function() {
    var createdStudents = this.get('createdStudents');
    console.log('createdStudents', createdStudents);
    console.log('len', createdStudents.length);
    return createdStudents.get('length') > 0;
  }),

  actions: {
    // radioSelect: function (value) {
    //   console.log('value', value);
    //   this.set('isAddStudents', value);
    // },

    addNewStudents: function() {
      //var addNewStudent = this.get('isAddStudent');
      this.set('isAddingStudents', true);


    //   Ember.run(function() {
    //     if(addNewStudent) { addStudent.send('addStudent'); }
    //   });
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
          var students = that.get('createdStudents');
          var user = that.store.findRecord('user', userId)
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
    //var isAddStudents = that.get('isAddStudents');
    var newSectionName = this.get('newSectionName');
    if (!newSectionName) {
      this.set('missingFieldsError', true);
      return;
    }
    //var sectionId = this.get('sectionId');
    //var schoolName = this.get('schoolName');
    var organization = this.get('selectedOrganization');
    var user = this.get('user');
    //var username = that.get('students');
    var students = this.get('createdStudents');
    //console.log('students', students);
    //var password = that.get('studentpassword');
    //console.log('password', password);
    var leader = this.get('leader');
    var teachers = this.get('teachers');
    if (user.get('isAdmin')) {
      //check if user exists
      let users = this.users.filterBy('username', leader);
      if (!Ember.isEmpty(users)) {
        let user = users.get('firstObject');
        teachers.pushObject(user);
      } else {
        this.set('invalidTeacherUsername', true);
        return;
      }
    }

    // this.set('newSectionName', '');
    // console.debug('creating new section ' + newSectionName);
    // if (!newSectionName) {
    //   return;
    // }

    // this.set('students', '');
    // console.debug('adding students ' + students);

    // if (!students) {
    //   return;
    // }

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

    // var createUserData = {
    //   username: username,
    //   password: password,
    //   isStudent: true
    // };
    // Ember.$.post({
    //   url: '/auth/signup',
    //   data: createUserData
    // }).
    // then((res) => {
    //     if (res.message === 'Username already exists') {
    //       that.set('usernameExists', true);
    //     } else {
    //       var userId = res._id;
    //       var students = this.get('studentsToAdd');
    //       var user= this.store.findRecord('user', userId)
    //         .then((user) => {
    //           students.push(user);
    //           var sectionData = this.store.createRecord('section', {
    //             name: newSectionName,
    //             schoolId: schoolName
    //           });

    //           for (let teacher of teachers) {
    //             sectionData.get('teachers').addObject(teacher);
    //           }

    //           for (let student of students) {
    //             sectionData.get('students').addObject(student);
    //           }

    //           sectionData.save()
    //           .then((prob) => {
    //             that.set('createdSection', prob);
    //           })
    //           .catch((err) => {
    //             that.set('createdSectionError', err);
    //           });
    //         });
    //     }
    //   })
    //   .catch(console.log);


  },
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


