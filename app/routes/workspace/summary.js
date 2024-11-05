// app/routes/workspace/summary.js
// There is a basic implementation of the template for this route, but it isn't working

import Route from '@ember/routing/route';

export default class WorkspaceSummaryRoute extends Route {
  isLogged() {
    return 'I am logged, in the route file';
  }
}
