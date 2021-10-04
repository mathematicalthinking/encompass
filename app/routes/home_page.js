import AuthenticatedRoute from './_authenticated_route';

export default AuthenticatedRoute.extend({
  model: function () {
    let assignments = this.store.findAll('assignment');
    return assignments;
  },
});
