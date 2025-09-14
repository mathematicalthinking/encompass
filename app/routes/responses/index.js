// app/routes/responses.js
import AuthenticatedRoute from '../_authenticated_route';
import { service } from '@ember/service';

export default class ResponsesRoute extends AuthenticatedRoute {
  @service store;

  async model() {
    const results = await this.store.query('response-thread', {
      threadType: 'all',
      page: 1,
      limit: 50,
    });

    return {
      threads: [...results],
      meta: results.meta ?? null,
    };
  }
}