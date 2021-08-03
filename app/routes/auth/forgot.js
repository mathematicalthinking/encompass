import LoggedOutRoute from './_logged_out_route';
export default LoggedOutRoute.extend({
  beforeModel() {
    this._super(...arguments);
  },
});
