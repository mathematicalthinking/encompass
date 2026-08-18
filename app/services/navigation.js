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
  toHome(opts = {}) {
    // decide destination (role-aware or from config)
    const route = this.homeRoute();

    if (opts.fullReload) {
      window.location.assign('/');
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

  toSubmission(submissionId, workspaceId, queryParams) {
    if (!submissionId) return;
    const options = queryParams ? { queryParams } : undefined;
    const resolvedWorkspaceId =
      workspaceId || this.router.currentRoute?.params?.workspace_id;
    const models = resolvedWorkspaceId
      ? [resolvedWorkspaceId, submissionId]
      : [submissionId];

    const transition = this.router.transitionTo(
      'workspace.submissions.submission',
      ...models,
      ...(options ? [options] : [])
    );
    transition?.catch?.((error) => {
      console.error('toSubmission transition failed:', error);
    });
  }

  toNewResponse(submissionId, workspaceId) {
    this.router.transitionTo('responses.new.submission', submissionId, {
      queryParams: { workspaceId },
    });
  }

  toWorkspaces(id) {
    this.router.transitionTo('workspace.work', id);
  }

  toWorkspace(id) {
    this.router.transitionTo('workspace.work', id);
  }

  /** Opens a problem in a new window */
  openProblem(problemId) {
    if (!problemId) return;
    const problemPath = this.router.urlFor('problems.problem', problemId);
    const problemUrl = new URL(problemPath, window.location.origin).toString();
    window.open(problemUrl, 'newwindow', 'width=1200, height=700');
  }

  /** Opens a workspace submission in a new window */
  openSubmission(workspaceId, submissionId) {
    if (!workspaceId || !submissionId) return;
    const submissionPath = this.router.urlFor(
      'workspace.submissions.submission',
      workspaceId,
      submissionId
    );
    const submissionUrl = new URL(
      submissionPath,
      window.location.origin
    ).toString();
    window.open(submissionUrl, 'newwindow', 'width=1200, height=700');
  }
}
