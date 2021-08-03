import AuthenticatedRoute from './_authenticated_route';

export default AuthenticatedRoute.extend({
  model: function () {
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
  },
  actions: {
    toSubmissionResponse(subId) {
      this.transitionTo('responses.submission', subId);
    },
    toResponses() {
      this.refresh();
    },
    toResponse(submissionId, responseId) {
      this.transitionTo('responses.submission', submissionId, {
        queryParams: { responseId: responseId },
      });
    },
  },
});
