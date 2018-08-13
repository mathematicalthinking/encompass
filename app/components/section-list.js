Encompass.SectionListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'section-list',

  // This sorts all the sections in the database and returns only the ones you created
  yourSections: function () {
    var sections = this.sections;
    var currentUser = this.get('currentUser');
    var yourSections = sections.filterBy('createdBy.content', currentUser);
    console.log('your Sections', yourSections);
    return yourSections.sortBy('createDate').reverse();
  }.property('sections.@each.isTrashed'),

  // This displays the sections if you are inside the teachers array
  // This works but by default if you create it you are in the teacher's array
  collabSections: function () {
    var sections = this.sections;
    console.log('sections =', sections);
    var currentUser = this.get('currentUser');
    var collabSections = sections.filterBy('teachers');
    console.log('your collab sections =', collabSections);
    return collabSections.sortBy('createDate').reverse();
  }.property('sections.@each.isTrashed'),

});