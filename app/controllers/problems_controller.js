/**
 * # Create a Problem Controller
 * @description This controller for creating a new problem
 * @author Philip Wisner
 * @since 1.0.0
 */

Encompass.ProblemsController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  currentUser: Encompass.currentUser
});

