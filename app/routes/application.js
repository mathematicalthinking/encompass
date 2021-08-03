/**
  * # Application Route
  * @description This is the main application route. Here we expose application wide:
                 + Models &
                 + Actions
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  * @todo Manage the current user without setting on the Encompass object itself.
  */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import MtAuthMixin from '../mixins/mt_auth_mixin';

export default class Application extends Route.extend(MtAuthMixin) {
  //the application route can't require authentication since it's getting the user
  @service('user-ntfs') userNtfs;
  @service store;
  @service('workspace-permissions') workspacePermissions;
  @service('edit-permissions') editPermissions;
  @service('current-user') currentUser;
  beforeModel() {
    let that = this;
    window.addEventListener(
      'touchstart',
      function onFirstTouch() {
        that.controller.set('isTouchScreen', true);
        window.removeEventListener('touchstart', onFirstTouch, false);
      },
      false
    );
  }

  async model() {
    let user = await this.store.queryRecord('user', { alias: 'current' });
    this.workspacePermissions.setUser(user);
    this.editPermissions.setUser(user);
    this.currentUser.setUser(user);
    return user;
  }

  afterModel(user, transition) {
    //not crazy that this is duplicated here and in AuthenticatedRoute...

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
    ];
    const targetPath = transition.targetName;

    if (allowedPaths.includes(targetPath)) {
      return;
    }
    //Do we need this check for isAuthenticated here? All routes that should be authenticated
    // should be extending AuthenticatedRoute.
    if (!user.get('isAuthenticated')) {
      this.store.unloadAll();
      this.transitionTo('auth.login');
    } else if (!user.get('isEmailConfirmed') && !user.get('isStudent')) {
      this.transitionTo('unconfirmed');
    } else if (!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
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
