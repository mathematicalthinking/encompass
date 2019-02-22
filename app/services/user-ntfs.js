Encompass.UserNtfsService = Ember.Service.extend({
  store: Ember.inject.service(),
  utils: Ember.inject.service('utility-methods'),

  init() {
    this._super(...arguments);
  },

  setupProperties(user) {
    this.set('user', user);
    this.set('responses', this.get('store').peekAll('response'));

    this.get('user.notifications')
      .then((ntfs) => {
        this.set('notifications', ntfs);
        this.set('areNtfsLoaded', true);
      });
  },

  doesArrayContainObjectById(arr, id) {
    if (!arr || !id) {
      return false;
    }
    let foundObject = arr.find((obj) => {
      return obj.get('id') === id;
    });
    return foundObject !== undefined;
  },

  trashedResponses: function() {
   let responses = this.get('responses').filterBy('isTrashed');
   let relatedNtfs = this.findRelatedNtfs('response', 'response');

   relatedNtfs.forEach((ntf) => {
    let responseId = this.get('utils').getBelongsToId(ntf, 'response');

    if (this.doesArrayContainObjectById(responses, responseId)) {
      // clear ntf
      ntf.set('isTrashed', true);
      ntf.set('wasSeen', true);
      ntf.save();
    }
   });
   return responses;
  }.property('responses.@each.isTrashed'),

  nonTrashedResponses: function() {
    return this.get('responses').rejectBy('isTrashed');
  }.property('responses.@each.isTrashed'),

  mentorResponses: function() {
    return this.get('nonTrashedResponses').filterBy('responseType', 'mentor');
  }.property('nonTrashedResponses.@each.responseType'),

  supercededReponses: function() {
    let responses = this.get('nonTrashedResponses').filterBy('status', 'superceded');
    let relatedNtfs = this.findRelatedNtfs('response', 'response');

    relatedNtfs.forEach((ntf) => {
      let responseId = this.get('utils').getBelongsToId(ntf, 'response');

      if (this.doesArrayContainObjectById(responses, responseId)) {
        // clear ntf
        ntf.set('isTrashed', true);
        ntf.set('wasSeen', true);
        ntf.save();
      }
     });
    return responses;
  }.property('responses.@each.status'),

  readByRecipientResponses: function() {
    let responses = this.get('nonTrashedResponses').filterBy('wasReadByRecipient');

    let relatedNtfs = this.findRelatedNtfs('response', 'response', null, null, 'newReplyNotifications');

    // clear any new reply ntfs for responses that have been read

    relatedNtfs.forEach((ntf) => {
      let responseId = this.get('utils').getBelongsToId(ntf, 'response');

      if (this.doesArrayContainObjectById(responses, responseId)) {
        // clear ntf
        ntf.set('isTrashed', true);
        ntf.set('wasSeen', true);
        ntf.save();
      }
     });
     return responses;
  }.property('responses.@each.wasReadByRecipient'),

  approvedMentorReponses: function() {
    let responses = this.get('mentorResponses').filterBy('status', 'approved');

    let relatedNtfs = this.findRelatedNtfs('response', 'response', 'mentorReplyRequiresApproval', 'response', 'requiresApprovalNotifications');

    // if a response is approved now, clear any old ntfs relating to the response being pending
    relatedNtfs.forEach((ntf) => {
      let responseId = this.get('utils').getBelongsToId(ntf, 'response');

      if (this.doesArrayContainObjectById(responses, responseId)) {
        // clear ntf
        ntf.set('isTrashed', true);
        ntf.set('wasSeen', true);
        ntf.save();
      }
     });
    return responses;
  }.property('responses.@each.status'),

  responseNotifications: function() {
    return this.get('notifications').filterBy('primaryRecordType', 'response');
  }.property('newNotifications.[]'),

  findRelatedNtfs(primaryRecordType, relatedRecord, ntfType, belongsToType, propertyName) {
    if (!primaryRecordType || !relatedRecord) {
      return [];
    }
    let propName = propertyName || `${primaryRecordType}Notifications`;
    let baseNtfs = this.get(propName);

    if (!baseNtfs) {
      return [];
    }

    let relationshipType = belongsToType || primaryRecordType;
    return baseNtfs.filter((ntf) => {
      let belongsToId = this.get('utils').getBelongsToId(ntf, relationshipType);

      if (ntfType) {
        return ntf.get('notificationType') === ntfType && belongsToId === relatedRecord.get('id');
      }
      return belongsToId === relatedRecord.get('id');
    });
  },

  newNotifications: function() {
    let base = this.get('notifications') || [];
    return base.filter((ntf) => {
      return !ntf.get('wasSeen') && !ntf.get('isTrashed');
    });
  }.property('notifications.@each.{isTrashed,wasSeen}'),

  newReplyNotifications: function() {
    return this.get('responseNotifications').filter((ntf) => {
      let ntfType = ntf.get('notificationType');
      let isNewReply = ntfType === 'newMentorReply' || ntfType === 'newApproverReply' || 'newlyApprovedReply';
      return isNewReply;
    });
  }.property('responseNotifications.@each.notificationType'),

  requiresApprovalNotifications: function() {
    return this.get('responseNotifications').filterBy('notificationType', 'mentorReplyRequiresApproval');
  }.property('responseNotifications.@each.notificationType'),

  needsRevisionNotifications: function() {
    return this.get('responseNotifications').filterBy('notificationType', 'mentorReplyNeedsRevisions');
  }.property('responseNotifications.@each.notificationType'),

  updatedResponseNotifications: function() {
    let updatedNtfs = Ember.RSVP.map(this.get('responseNotifications'), (ntf) => {
      let ntfType = ntf.get('notificationType');
      if (ntfType === 'newWorkToMentor') {
        return ntf;
      }

      let responseId = this.get('utils').getBelongsToId(ntf, 'response');
      if (!responseId) {
        // should not happen, but if does clear ntf
        ntf.set('wasSeen', true);
        return ntf.save();
      }

      return ntf.get('response')
        .then((response) => {
          let status = response.get('status');

          if (response.get('isTrashed') || status === 'superceded') {
            ntf.set('wasSeen', true);
            return ntf.save();
          }
        });
    });

    return window.DS.PromiseArray.create({
      promise: updatedNtfs
    });
  }.property('responseNotifications.[]'),

  // observeNtfResponses: function() {
  //   console.log('observing ntf responses');
  //   this.get('ntfResponses').forEach((response))
  // }.observes('ntfResponses')

  // updateResponseNtfs: function() {
  //   console.log('observed change to responses');
  //   let ntfsToClear = [];

  //   this.get('trashedResponses').forEach((response) => {
  //     let relatedNtfs = this.findRelatedNtfs('response', response);
  //     relatedNtfs.forEach((ntf) => {
  //       ntfsToClear.addObject(ntf);
  //     });
  //   });

  //   this.get('supercededResponses').forEach((response) => {
  //     let relatedNtfs = this.findRelatedNtfs('response', response);
  //     relatedNtfs.forEach((ntf) => {
  //       ntfsToClear.addObject(ntf);
  //     });
  //   });

  //   this.get('readByRecipientResponses').forEach((response) => {
  //     let relatedNtfs = this.findRelatedNtfs('response', response);
  //     relatedNtfs.forEach((ntf) => {
  //       ntfsToClear.addObject(ntf);
  //     });
  //   });

  //   console.log('ntfsToClear!', ntfsToClear);


  // }.observes('responses.@each.{isTrashed,status,wasReadByRecipient}'),

});