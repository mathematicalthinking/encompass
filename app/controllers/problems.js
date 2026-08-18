import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ProblemsController extends Controller {
  @service router;

  // This is the situation where there's a need for a controller. It provides the route template with
  // information about the current route, which is needed to determine whether to show or hide the detail pane.
  // This is needed because we want to show/hide the detail pane without accessing the DOM directly.
  // Instead we are basing the decision on the current route.

  get isDetailActive() {
    return (
      this.router.currentRouteName.startsWith('problems.problem') ||
      this.router.currentRouteName === 'problems.new' ||
      this.router.currentRouteName === 'problems.edit'
    );
  }
}
