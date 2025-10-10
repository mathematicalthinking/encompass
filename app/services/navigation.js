import Service from '@ember/service';
import { service } from '@ember/service';

export default class NavigationService extends Service {
  @service router;
  @service currentUser; // optional: if home differs by role

  /**
   * Centralized home navigation.
   * @param {Object} opts
   * @param {boolean} opts.replace - use replaceWith instead of transitionTo
   * @param {boolean} opts.fullReload - force hard reload to /
   */
  goHome(opts = {}) {
    // decide destination (role-aware or from config)
    const route = this.homeRoute();

    if (opts.fullReload) {
      window.location.assign('/'); // rare fallback
      return;
    }
    if (opts.replace) {
      this.router.replaceWith(route.name, ...(route.models ?? []), {
        queryParams: route.qp,
      });
    } else {
      this.router.transitionTo(route.name, ...(route.models ?? []), {
        queryParams: route.qp,
      });
    }
  }

  /**
   * Compute the home target. Centralize the logic here.
   * Return shape: { name: 'route.name', models?: [], qp?: {} }
   */
  homeRoute() {
    // for now, just return a default

    return { name: 'index' };

    // In the future, this might change based on user role
    // const user = this.currentUser?.user;
    // if (!user) return { name: 'index' };

    // if (this.currentUser.isStudent) {
    //   return { name: 'workspaces' };
    // }
    // if (this.currentUser.isTeacher || this.currentUser.isAdmin || this.currentUser.isPdAdmin) {
    //   return { name: 'workspaces' }; // or 'dashboard'
    // }

    // return { name: 'index' };
  }

  toResponses() {
    this.router.transitionTo('responses');
  }

  toResponseSubmission(submissionId) {
    this.router.transitionTo('responses.submission', submissionId);
  }

  toResponse(submissionId, responseId) {
    this.router.transitionTo('responses.submission', submissionId, {
      queryParams: { responseId },
    });
  }

  toNewResponse(submissionId, workspaceId) {
    this.router.transitionTo('responses.new.submission', submissionId, {
      queryParams: { workspaceId },
    });
  }
}
