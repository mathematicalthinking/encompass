Encompass.SectionAddStudentsComponent = Ember.Component.extend({
     tagName: 'addStudents',
     className: ['students'],
     newStudent: '',

     actions: {
       createStudents: function () {
         var newStudent = this.get('newStudent');
         this.set('newStudent', '');
         console.debug('create new student' + newStudent);

         if (!newStudent) {
          return;
        }

        var student = this.store.createRecord('user', {
          student: newStudent,

        });

        student.save().then((res) => {
          this.sendAction('toStudentList');
        });
       }
     }
  });

  //is student true?  backend schema
  //sign-up.js
//   var createUserData = {
//     username: username,
//     password: password,
//     requestReason: requestReason
//   };
//   Ember.$.post({
//     url: '/auth/signup',
//     data: createUserData
//   }).
//   then((res) => {
//       if (res.message === 'Username already exists') {
//         that.set('usernameExists', true);
//       } else {
//         that.sendAction('toHome');
//       }
//     })
//     .catch(console.log);
// },