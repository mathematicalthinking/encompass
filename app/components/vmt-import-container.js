Encompass.VmtImportContainerComponent = Ember.Component.extend({

  vmtUsername: null,
  vmtToken: null,

  actions: {
    handleLoginResults(results) {
      // what format?
      if (!results) {
        return;
      }
      this.set('vmtToken', results.vmtToken);
    }
  }

});