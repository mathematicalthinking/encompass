Encompass.VmtImportRoute = Encompass.AuthenticatedRoute.extend({
  model() {
    console.log('import vmt model');
  },

  renderTemplate() {
    this.render('vmt/import');
  }
});