/**
  * # Sections Route
  * @description Route for dealing with all section objects
  * @todo This is really the sections_index route and should be named as such by convention
  */
Encompass.SectionsRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    let sections = this.get('store').findAll('section');
    return sections;
  },

  renderTemplate: function(){
    this.render('sections/sections');
  }
});
