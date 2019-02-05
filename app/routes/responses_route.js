Encompass.ResponsesRoute = Encompass.AuthenticatedRoute.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),

  model: function(){
    let currentUser = this.modelFor('application');
    return Ember.RSVP.hash({
      notifications: currentUser.get('notifications'),
      responses: this.get('store').findAll('response'),
    })
    .then((hash) => {
      let areResponses = hash.responses.get('length') > 0;
      let newSubmissions = [];
      let responseSubmissions = [];

      if (areResponses) {
        let subIds = hash.responses.map((response) => {
          return this.get('utils').getBelongsToId(response, 'submission');
        })
        .compact()
        .uniq();

        responseSubmissions = this.get('store').query('submission', {
          ids: subIds
        });

      let ownMentorReplies = hash.responses.filter((response) => {
        let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
        return response.get('responseType') === 'mentor' && creatorId === currentUser.get('id');
      });

      if (ownMentorReplies.get('length') > 0) {
        newSubmissions = Ember.RSVP.all(ownMentorReplies.map((response) => {
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
      }
    }

      return Ember.RSVP.hash({
        responses: hash.responses,
        notifications: hash.notifications,
        responseSubmissions,
        newSubmissions,
      })
      .then((hash) => {
        let submissions = [];

          hash.newSubmissions.forEach((subArray) => {
            submissions.addObjects(subArray);
          });

          submissions.addObjects(hash.responseSubmissions);

        let uniqueSubs = submissions.uniqBy('id');

          return {
            responses: hash.responses,
            notifications: hash.notifications,
            submissions: uniqueSubs
          };
      })
      .catch((err) => {
        console.log('err', err);
      });
    });

  },

  actions: {
    toSubmissionResponse(subId) {
      this.transitionTo('responses.submission', subId);
    },
    toResponses() {
      this.refresh();
    },
  }
});


