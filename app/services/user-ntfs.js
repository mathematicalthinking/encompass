import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { map } from 'rsvp';

export default Service.extend({
  store: service(),
  utils: service('utility-methods'),

  init() {
    this._super(...arguments);
  },

  setupProperties(user) {
    this.set('user', user);
    this.set('responses', this.store.peekAll('response'));

    this.user.notifications.then((ntfs) => {
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

  trashedResponses: computed('responses.@each.isTrashed', function () {
    let responses = this.responses.filterBy('isTrashed');
    let relatedNtfs = this.findRelatedNtfs('response', 'response');

    relatedNtfs.forEach((ntf) => {
      let responseId = this.utils.getBelongsToId(ntf, 'response');

      if (this.doesArrayContainObjectById(responses, responseId)) {
        // clear ntf
        ntf.set('isTrashed', true);
        ntf.set('wasSeen', true);
        ntf.save();
      }
    });
    return responses;
  }),

  nonTrashedResponses: computed('responses.@each.isTrashed', function () {
    return this.responses.rejectBy('isTrashed');
  }),

  mentorResponses: computed.filterBy(
    'nonTrashedResponses',
    'responseType',
    'mentor'
  ),

  supercededReponses: computed(
    'nonTrashedResponses',
    'responses.@each.status',
    function () {
      let responses = this.nonTrashedResponses.filterBy('status', 'superceded');
      let relatedNtfs = this.findRelatedNtfs('response', 'response');

      relatedNtfs.forEach((ntf) => {
        let responseId = this.utils.getBelongsToId(ntf, 'response');

        if (this.doesArrayContainObjectById(responses, responseId)) {
          // clear ntf
          ntf.set('isTrashed', true);
          ntf.set('wasSeen', true);
          ntf.save();
        }
      });
      return responses;
    }
  ),

  readByRecipientResponses: computed(
    'nonTrashedResponses',
    'responses.@each.wasReadByRecipient',
    function () {
      let responses = this.nonTrashedResponses.filterBy('wasReadByRecipient');

      let relatedNtfs = this.findRelatedNtfs(
        'response',
        'response',
        null,
        null,
        'newReplyNotifications'
      );

      // clear any new reply ntfs for responses that have been read

      relatedNtfs.forEach((ntf) => {
        let responseId = this.utils.getBelongsToId(ntf, 'response');

        if (this.doesArrayContainObjectById(responses, responseId)) {
          // clear ntf
          ntf.set('isTrashed', true);
          ntf.set('wasSeen', true);
          ntf.save();
        }
      });
      return responses;
    }
  ),

  approvedMentorReponses: computed(
    'mentorResponses',
    'responses.@each.status',
    function () {
      let responses = this.mentorResponses.filterBy('status', 'approved');

      let relatedNtfs = this.findRelatedNtfs(
        'response',
        'response',
        'mentorReplyRequiresApproval',
        'response',
        'requiresApprovalNotifications'
      );

      // if a response is approved now, clear any old ntfs relating to the response being pending
      relatedNtfs.forEach((ntf) => {
        let responseId = this.utils.getBelongsToId(ntf, 'response');

        if (this.doesArrayContainObjectById(responses, responseId)) {
          // clear ntf
          ntf.set('isTrashed', true);
          ntf.set('wasSeen', true);
          ntf.save();
        }
      });
      return responses;
    }
  ),

  responseNotifications: computed.filterBy(
    'notifications',
    'primaryRecordType',
    'response'
  ),

  findRelatedNtfs(
    primaryRecordType,
    relatedRecord,
    ntfType,
    belongsToType,
    propertyName
  ) {
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
      let belongsToId = this.utils.getBelongsToId(ntf, relationshipType);

      if (ntfType) {
        return (
          ntf.get('notificationType') === ntfType &&
          belongsToId === relatedRecord.get('id')
        );
      }
      return belongsToId === relatedRecord.get('id');
    });
  },

  newNotifications: computed(
    'notifications.@each.{isTrashed,wasSeen}',
    function () {
      let base = this.notifications || [];
      return base.filter((ntf) => {
        return !ntf.get('wasSeen') && !ntf.get('isTrashed');
      });
    }
  ),

  newReplyNotifications: computed(
    'responseNotifications.@each.notificationType',
    function () {
      return this.responseNotifications.filter((ntf) => {
        let ntfType = ntf.get('notificationType');
        let isNewReply =
          ntfType === 'newMentorReply' ||
          ntfType === 'newApproverReply' ||
          'newlyApprovedReply';
        return isNewReply;
      });
    }
  ),

  requiresApprovalNotifications: computed.filterBy(
    'responseNotifications',
    'notificationType',
    'mentorReplyRequiresApproval'
  ),

  needsRevisionNotifications: computed.filterBy(
    'responseNotifications',
    'notificationType',
    'mentorReplyNeedsRevisions'
  ),

  updatedResponseNotifications: computed(
    'responseNotifications.[]',
    function () {
      let updatedNtfs = map(this.responseNotifications, (ntf) => {
        let ntfType = ntf.get('notificationType');
        if (ntfType === 'newWorkToMentor') {
          return ntf;
        }

        let responseId = this.utils.getBelongsToId(ntf, 'response');
        if (!responseId) {
          // should not happen, but if does clear ntf
          ntf.set('wasSeen', true);
          return ntf.save();
        }

        return ntf.get('response').then((response) => {
          let status = response.get('status');

          if (response.get('isTrashed') || status === 'superceded') {
            ntf.set('wasSeen', true);
            return ntf.save();
          }
        });
      });

      return window.DS.PromiseArray.create({
        promise: updatedNtfs,
      });
    }
  ),

  // observeNtfResponses: function() {
  //   console.log('observing ntf responses');
  //   this.ntfResponses.forEach((response))
  // }.observes('ntfResponses')

  // updateResponseNtfs: function() {
  //   console.log('observed change to responses');
  //   let ntfsToClear = [];

  //   this.trashedResponses.forEach((response) => {
  //     let relatedNtfs = this.findRelatedNtfs('response', response);
  //     relatedNtfs.forEach((ntf) => {
  //       ntfsToClear.addObject(ntf);
  //     });
  //   });

  //   this.supercededResponses.forEach((response) => {
  //     let relatedNtfs = this.findRelatedNtfs('response', response);
  //     relatedNtfs.forEach((ntf) => {
  //       ntfsToClear.addObject(ntf);
  //     });
  //   });

  //   this.readByRecipientResponses.forEach((response) => {
  //     let relatedNtfs = this.findRelatedNtfs('response', response);
  //     relatedNtfs.forEach((ntf) => {
  //       ntfsToClear.addObject(ntf);
  //     });
  //   });

  //   console.log('ntfsToClear!', ntfsToClear);

  // }.observes('responses.@each.{isTrashed,status,wasReadByRecipient}'),
});
