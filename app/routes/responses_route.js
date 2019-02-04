Encompass.ResponsesRoute = Encompass.AuthenticatedRoute.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),

  model: function(){
    let currentUser = this.modelFor('application');
    return Ember.RSVP.hash({
      notifications: currentUser.get('notifications'),
      responses: this.get('store').findAll('response'),
    })
    .then((hash) => {
      let ownMentorReplies = hash.responses.filter((response) => {
        let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
        return response.get('responseType') === 'mentor' && creatorId === currentUser.get('id');
      });

      let laterReplies = Ember.RSVP.all(ownMentorReplies.map((response) => {
        let createDate = response.get('createDate');
        let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
        let workspaceId = this.get('utils').getBelongsToId(response, 'workspace');
        return this.get('store').query('submission', {
          filterBy: {
            student: recipientId,
            startDate: createDate,
            workspaces: workspaceId
          }
        });
      }));

      return Ember.RSVP.hash({
        responses: hash.responses,
        notifications: hash.notifications,
        responseSubmissions: Ember.RSVP.all(hash.responses.mapBy('submission')),
        newSubmissions: laterReplies
      })
      .then((hash) => {
        hash.newSubmissions.forEach((subArray) => {
            hash.responseSubmissions.addObjects(subArray);
          });
        let uniqueSubs = hash.responseSubmissions.uniqBy('id');
          return {
            responses: hash.responses,
            notifications: hash.notifications,
            submissions: uniqueSubs
          };
      });
    });

  },

  actions: {
    toSubmissionResponse(subId) {
      this.transitionTo('responses.submission', subId);
    },
    toResponses() {
      this.refresh();
    }
  }
});


