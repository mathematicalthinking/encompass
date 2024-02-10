// app/routes/workspace/summary.js

import Route from '@ember/routing/route';

export default class WorkspaceSummaryRoute extends Route {
  isLogged() {
    return 'I am logged, in the route file';
  }
}
