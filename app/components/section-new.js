Encompass.SectionNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'sections',
  className: ['sections'],
  sectionId: '',
  createdSection: null,
  createSectionError: null,
  teacher: null,
  teachers: [],
  invalidTeacherUsername: null,
  isAddStudents: false,
  studentsToAdd: [],


  //Non admin User creating section
  //set user as teacher
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

    //   Ember.run(function() {
    //     if(addNewStudent) { addStudent.send('addStudent'); }
    //   });
     },

  createSection: function () {
    var that = this;
    var isAddStudents = that.get('isAddStudents');
    var newSectionName = this.get('newSectionName');
    var sectionId = this.get('sectionId');
    var schoolName = this.get('schoolName');
    var user = this.get('user');
    var username = that.get('students');
    var students = this.get('students');
    console.log('students', students);
    var password = that.get('studentpassword');
    console.log('password', password);
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

    this.set('students', '');
    console.debug('adding students ' + students);

    if (!students) {
      return;
    }

    var createUserData = {
      username: username,
      password: password,
      isStudent: true
    };
    Ember.$.post({
      url: '/auth/signup',
      data: createUserData
    }).
    then((res) => {
        if (res.message === 'Username already exists') {
          that.set('usernameExists', true);
        } else {
          var userId = res._id;
          var students = this.get('studentsToAdd');
          var user= this.store.findRecord('user', userId)
            .then((user) => {
              students.push(user);
              var sectionData = this.store.createRecord('section', {
                name: newSectionName,
                schoolId: schoolName
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
            });
        }
      })
      .catch(console.log);


  },
  checkError() {
    if (this.invalidTeacherUsername) {
      this.set('invalidTeacherUsername', false);
    }
  }

}
});


