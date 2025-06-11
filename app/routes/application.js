/**
  * # Application Route
  * @description This is the main application route. Here we expose application wide:
                 + Models &
                 + Actions
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
  * @since 1.0.0
  * @todo Manage the current user without setting on the Encompass object itself.
  */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class Application extends Route {
  //the application route can't require authentication since it's getting the user
  @service userNtfs;
  @service store;
  @service router;
  @service currentUser;

  async model() {
    let user = await this.store.queryRecord('user', { alias: 'current' });
    this.currentUser.setUser(user);
    return user;
  }

  afterModel(user, transition) {
    // Need this check so that the user isn't auto-redirected to home after
    // clicking on reset password link

    if (user.get('isAuthenticated')) {
      this.userNtfs.setupProperties(user);
    }
    const allowedPaths = [
      'auth.reset',
      'auth.confirm',
      'auth.forgot',
      'auth.login',
      'auth.signup',
      'terms',
    ];
    const targetPath = transition.targetName;

    if (allowedPaths.includes(targetPath)) {
      return;
    }
    //Do we need this check for isAuthenticated here? All routes that should be authenticated
    // should be extending AuthenticatedRoute.
    if (!user.get('isAuthenticated')) {
      this.store.unloadAll();
      this.router.transitionTo('welcome');
    } else if (!user.get('isEmailConfirmed') && !user.get('isStudent')) {
      this.router.transitionTo('unconfirmed');
    } else if (!user.get('isAuthz')) {
      this.router.transitionTo('unauthorized');
    }
  }

  // TODO: Remove all the modal stuff
  @action
  openModal(modalName, model) {
    if (model) {
      this.controllerFor(modalName).set('model', model);
    }
    return this.render(modalName, {
      into: 'application',
      outlet: 'modal',
    });
  }
  @action
  closeModal() {
    return this.disconnectOutlet({
      outlet: 'modal',
      parentView: 'application',
    });
  }
  @action
  openPanel(panelName, model) {
    if (model) {
      this.controllerFor(panelName).set('model', model);
    }
    return this.render(panelName, {
      into: 'application',
      outlet: 'modal',
    });
  }

  @action
  closePanel() {
    return this.disconnectOutlet({
      outlet: 'modal',
      parentView: 'application',
    });
  }
  @action
  doneTour() {
    var user = this.model;
    user.set('seenTour', new Date());
    user.save();
    window.guiders.hideAll();
  }
  @action
  reloadPage() {
    window.location.reload();
  }
}
