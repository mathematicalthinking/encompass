/**
  * # Workspace Folder Route
  * @description This is a convenience route that bypasses the folders heirarchy
                 allowing us to render the edit template for a workspace folder
                 directly.
  * @author Damola Mabogunje <damola@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
  * @since 1.0.3
  * @see folders_edit_route
  */
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class FoldersFolderRoute extends Route {
  renderTemplate(_controller, model) {
    const appController = this.owner.lookup('controller:application');
    const editFolderController = this.owner.lookup('controller:folders.edit');

    appController.isHidden = true;
    editFolderController.model = model;

    this.render('folders/edit', {
      controller: editFolderController,
    });
  }

  @action
  willTransition(/* transition */) {
    const appController = this.owner.lookup('controller:application');
    appController.isHidden = false;
  }
}
