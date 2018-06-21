'use strict';

/**
  * # Workspace Folder Route
  * @description This is a convenience route that bypasses the folders heirarchy
                 allowing us to render the edit template for a workspace folder
                 directly.
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.3
  * @see folders_edit_route
  */
Encompass.WorkspaceFolderRoute = Ember.Route.extend({

  renderTemplate: function renderTemplate(controller, model) {
    var appController = this.controllerFor('application');
    appController.set('isHidden', true);

    var editFolder = this.controllerFor('folders.edit');
    editFolder.set('model', model);

    this.render('folders/edit', {
      controller: editFolder
    });
  },

  actions: {
    willTransition: function willTransition(transition) {
      var appController = this.controllerFor('application');
      appController.set('isHidden', false);
    }
  }
});
//# sourceMappingURL=workspace_folder_route.js.map
