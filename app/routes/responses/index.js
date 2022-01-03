import AuthenticatedRoute from '../_authenticated_route';
import { inject as service } from '@ember/service';

export default class ResponsesRoute extends AuthenticatedRoute {
  @service store;
  model() {
    return this.store
      .query('responseThread', {
        threadType: 'all',
        page: 1,
        limit: 50,
      })
      .then((results) => {
        let meta = results.get('meta.meta');
        return {
          threads: results.toArray(),
          meta,
        };
      });
  }
}
