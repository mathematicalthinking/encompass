Encompass.SectionListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'section-list',

  // This sorts all the sections in the database and returns only the ones you created
  yourSections: function () {
    var sections = this.sections.rejectBy('isTrashed');
    var currentUser = this.get('currentUser');
    var yourSections = sections.filterBy('createdBy.content', currentUser);
    return yourSections.sortBy('createDate').reverse();
  }.property('sections.@each.isTrashed', 'currentUser.isStudent'),

  // This displays the sections if you are inside the teachers array
  // This works but by default if you create it you are in the teacher's array
  collabSections: function () {
    var sections = this.sections.rejectBy('isTrashed');
    var currentUser = this.get('currentUser');
    var collabSections = sections.filterBy('teachers');
    var yourCollabSections = collabSections.filter((section) => {
      let teachers = section.get('teachers');
      if (teachers.includes(currentUser)) {
       return section;
     }
    });

    var yourSections = yourCollabSections.filter((section) => {
      let content = section.get('createdBy.content');
      if (content) {
        return content.id !== currentUser.id;
      }
    });

    return yourSections.sortBy('createDate').reverse();
  }.property('sections.@each.isTrashed', 'currentUser.isStudent'),

  orgSections: function () {
    var sections = this.sections.rejectBy('isTrashed');
    var studentSections = sections.filterBy('organization');
    return studentSections.sortBy('createDate').reverse();
  }.property('sections.@each.isTrashed', 'currentUser.isStudent'),

  studentSections: function () {
    var sections = this.sections.rejectBy('isTrashed');
    var studentSections = sections.filterBy('students');
    var currentUser = this.get('currentUser');

    var yourSections = studentSections.filter((section) => {
      let students = section.get('students');
      if (students.includes(currentUser)) {
        return section;
      }
    });
    return yourSections.sortBy('createDate').reverse();
  }.property('sections.@each.isTrashed', 'currentUser.isStudent'),

  allSections: function () {
    var sections = this.sections.rejectBy('isTrashed');
    var currentUser = this.get('currentUser');
    var allSections = sections.filter((section) => {
      let content = section.get('createdBy.content');
      if (content) {
        return content.id !== currentUser.id;
      }
    });
    return allSections.sortBy('createDate').reverse();
  }.property('sections.@each.isTrashed', 'currentUser.isStudent'),

});

// we want to get all the sections that you are in the teachers array but not createdBy

// Your sections should be the ones you created or you are the first teacher
// Collab sections should be the ones where you are in the teachers array