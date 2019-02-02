Encompass.ResponsesRoute = Encompass.AuthenticatedRoute.extend(Encompass.CurrentUserMixin, {
  model: function(){
    let currentUser = this.modelFor('application');

    return Ember.RSVP.hash({
      notifications: currentUser.get('notifications'),
      responses: this.get('store').findAll('response'),
    })
    .then((hash) => {
      let newWorkToMentorNotifications = hash.notifications.filterBy('notificationType', 'newWorkToMentor');

      return Ember.RSVP.hash({
        responses: hash.responses,
        notifications: hash.notifications,
        newSubmissions: Ember.RSVP.all(newWorkToMentorNotifications.mapBy('newSubmission')),
        responseSubmissions: Ember.RSVP.all(hash.responses.mapBy('submission'))
      });
    });

  },
  actions: {
    toSubmissionResponse(subId) {
      this.transitionTo('responses.submission', subId);
    }
  }
});


