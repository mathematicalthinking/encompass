/* eslint-disable complexity */
Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',

  utils: Ember.inject.service('utility-methods'),
  isShowAll: Ember.computed.equal('currentFilter', 'all'),

  showAllFilter: false,

  isShowSubmitter: Ember.computed.equal('currentFilter', 'submitter'),
  isShowMentoring: Ember.computed.equal('currentFilter', 'mentoring'),
  isShowApproving: Ember.computed.equal('currentFilter', 'approving'),

  showSubmitterTab: Ember.computed.gt('submitterThreads.size', 0),
  showMentoringTab: Ember.computed.gt('mentoringThreads.size', 0),
  showApprovingTab: Ember.computed.gt('approvingThreads.size', 0),

  currentFilter: 'submitter',
  sortParam: 'newest',

  noResponsesMessage: 'No responses found',

  showStudentColumn: Ember.computed.equal('isShowMentoring', true),

  statusMap: {
    'approved': 'APPROVED',
    'pendingApproval': 'PENDING APPROVAL',
    'needsRevisions': 'NEEDS REVISIONS',
    'superceded': 'SUPERCEDED',
  },

  areThreads: Ember.computed.gt('allThreads.length', 0),

  isAdmin: function() {
    return this.get('currentUser.isAdmin') && !this.get('currentUser.isStudent');
  },

  didReceiveAttrs() {
    let list = [
      {name: 'sortedSubmitterResponses', actionCount : this.get('actionSubmitterThreads.length'), allCount: this.get('submitterThreads.size'), currentFilter: 'submitter'},
      {name: 'sortedMentoringResponses', actionCount: this.get('actionMentoringThreads.length'), allCount: this.get('mentoringThreads.size'), currentFilter: 'mentoring'},
      {name: 'sortedApprovingResponses', actionCount: this.get('actionApprovingThreads.length'), allCount: this.get('approvingThreads.size'), currentFilter: 'approving'}
    ];

    // ascending
    let sorted = list.sortBy('actionCount', 'allCount');

    this.set('currentFilter', sorted[2].currentFilter);

    this._super(...arguments);
  },
  newWorkToMentorNtfs: function() {
   let ntfs = this.get('notifications') || [];

   return ntfs.filterBy('notificationType', 'newWorkToMentor');

  }.property('notifications.@each.{wasSeen,isTrashed}'),

  showMentorHeader: function() {
    return this.get('currentFilter') !== 'mentoring';
  }.property('currentFilter'),

  showStudentHeader: function() {
    return this.get('currentFilter') !== 'submitter';
  }.property('currentFilter'),

  uniqueWorkspaceIds: function() {
    return this.get('nonTrashedResponses')
    .map((response) => {
      let workspaceId = this.get('utils').getBelongsToId(response, 'workspace');
      return workspaceId;
    })
    .compact()
    .uniq();
  }.property('nonTrashedResponses.[]'),

  uniqueStudentIdentifiers: function() {
    return this.get('submissions')
      .mapBy('uniqueIdentifier')
      .compact()
      .uniq();
  }.property('submissions.[]'),

  studentSubmissionThreads: function() {
    let threads = Ember.Map.create();
    this.get('uniqueStudentIdentifiers').forEach((studentId) => {

      this.get('workspaceSubmissionThreads').forEach((wsSubs, wsId, map) => {

        let studentWork = wsSubs.filterBy('uniqueIdentifier', studentId);
        if (studentWork.get('length') > 0) {
          let combinedUniqueId = wsId + studentId;

          threads.set(combinedUniqueId, Ember.Map.create());

          let subMap = threads.get(combinedUniqueId);

          subMap.set('studentIdentifier', studentId);
          subMap.set('submissions', studentWork);
          subMap.set('workspaceId', wsId);

        }
      });
    });

    threads.forEach((thread, combinedId, map) => {
      let subs = thread.get('submissions');
      map.get(combinedId).set('submissions', subs.sortBy('createDate'));
    });
    return threads;
  }.property('workspaceSubmissionThreads', 'uniqueStudentIds.[]'),

  isMentoringResponse(response) {
    if (!response) {
      return false;
    }
    let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
    let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');

    let responseType = response.get('responseType');

    let isToYou = recipientId === this.get('currentUser.id');
    let isByYou = creatorId === this.get('currentUser.id');

    let isYourMentorReply = isByYou && responseType === 'mentor';
    let isApproverNote = isToYou && response.get('isApproverNoteOnly');

    return isYourMentorReply || isApproverNote;
  },

  isSubmitterResponse(response) {
    if (!response) {
      return false;
    }
    let recipientId = this.get('utils').getBelongsToId(response, 'recipient');

    let isToYou = recipientId === this.get('currentUser.id');
    let status = response.get('status');
    let responseType = response.get('responseType');

    return isToYou && responseType === 'mentor' && status === 'approved';

  },

  isApprovingResponse(response) {
    if (!response) {
      return false;
    }
    let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
    let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
    let approvedById = this.get('utils').getBelongsToId(response, 'approvedBy');

    let responseType = response.get('responseType');
    let status = response.get('status');

    let isToYou = recipientId === this.get('currentUser.id');
    let isByYou = creatorId === this.get('currentUser.id');

    let wasApprovedByYou = approvedById === this.get('currentUser.id');
    let isYourApproverReply = isByYou && responseType === 'approver';
    let needsApproval = status === 'pendingApproval';

    let isReplyToApprove = (!isToYou && !isByYou) && needsApproval;

    return isReplyToApprove || isYourApproverReply || wasApprovedByYou;
  },

  isNewRevision(submission) {
    let ntfs = this.get('newWorkToMentorNtfs');

    let subNtf = ntfs.find((ntf) => {
      let subId = this.get('utils').getBelongsToId(ntf, 'newSubmission');
      return subId === submission.get('id');
    });

    if (!subNtf) {
      return false;
    }
    return !subNtf.get('isTrashed') && !subNtf.get('wasSeen');
  },

  hasNewRevision(submissions) {
    let newSub = submissions.find((sub) => {
      return this.isNewRevision(sub);
    });
    return !this.get('utils').isNullOrUndefined(newSub);
  },
  doesThreadRequireAction(thread) {
    let actionProps = ['hasNewRevision', 'doesHaveDraft', 'doesHaveUnreadReply', 'doesNeedRevisions', 'isWaitingForApproval', 'doesHaveUnmentoredRevision'];

    for (let prop of actionProps) {
      if (thread.get(prop) === true) {
        return true;
      }
    }
    return false;
  },

  mentoringThreads: function() {
    let mentoringThreads = Ember.Map.create();

    this.get('studentSubmissionThreads').forEach((thread, combinedId, map) => {
      // just exclude your own Id
      //each thread has studentId prop and submissions prop
      // combinedId is wsId +studentId

      let studentId = thread.get('studentIdentifier');
      let workspaceId = thread.get('workspaceId');

      if (studentId !== this.get('currentUser.id')) {

        let subs = thread.get('submissions');
        let subIds = subs.mapBy('id');

        let subResponses = this.get('nonTrashedResponses')
          .filter((response) => {
            let subId = this.get('utils').getBelongsToId(response, 'submission');
            return this.isMentoringResponse(response) && subIds.includes(subId);
          })
          .sortBy('createDate');

        if (subResponses.get('length') > 0) {
          mentoringThreads.set(combinedId, Ember.Map.create());
          let studentMap = mentoringThreads.get(combinedId);
          studentMap.set('submissions', subs);
          studentMap.set('studentId', studentId);
          studentMap.set('responses', subResponses);
          studentMap.set('workspaceId', workspaceId);

          studentMap.set('hasNewRevision', this.hasNewRevision(subs));

          studentMap.set('doesHaveDraft', this.doesHaveDraft(subResponses));
          studentMap.set('latestRevision', subs.get('lastObject'));
          studentMap.set('latestReply', subResponses.get('lastObject'));
          studentMap.set('doesHaveUnreadReply', this.doesHaveUnreadReply(subResponses));
          studentMap.set('doesNeedRevisions', this.doesNeedRevisions(subResponses));
          studentMap.set('isWaitingForApproval', this.isWaitingForApproval(subResponses));

          let doesHaveUnmentoredRevision = false;

          let latestRevision = studentMap.get('latestRevision');
          let relatedResponse;

          if (latestRevision) {
           relatedResponse = subResponses.find((response) => {
             let subId = this.get('utils').getBelongsToId(response, 'submission');
             return subId === latestRevision.get('id');
           });
           if (!relatedResponse) {
             doesHaveUnmentoredRevision = true;
           }
          }

          studentMap.set('doesHaveUnmentoredRevision', doesHaveUnmentoredRevision);

         studentMap.set('doesRequireAction', this.doesThreadRequireAction(studentMap));

        }
      }
    });
    return mentoringThreads;
  }.property('studentSubmissionThreads', 'nonTrashedResponses.@each.{status,wasReadByRecipient}', 'newWorkToMentorNtfs.@each.{wasSeen,isTrashed}'),

  submitterThreads: function() {
    let submitterThreads = Ember.Map.create();

    this.get('studentSubmissionThreads').forEach((thread, combinedId, map) => {
      // just exclude your own Id
      let studentId = thread.get('studentIdentifier');
      let subs = thread.get('submissions');
      let workspaceId = thread.get('workspaceId');

      // only want user's own submitter threads
      if (studentId === this.get('currentUser.id')) {
        submitterThreads.set(combinedId, Ember.Map.create());

        let studentMap = submitterThreads.get(combinedId);
        studentMap.set('studentId', studentId);

       studentMap.set('submissions', subs);

        let subIds = subs.mapBy('id');

        let subResponses = this.get('nonTrashedResponses')
          .filter((response) => {
            let subId = this.get('utils').getBelongsToId(response, 'submission');
            return this.isSubmitterResponse(response) && subIds.includes(subId);
          })
          .sortBy('createDate');

       studentMap.set('responses', subResponses);
       studentMap.set('latestRevision', subs.get('lastObject'));
       studentMap.set('latestReply', subResponses.get('lastObject'));
       studentMap.set('workspaceId', workspaceId);

       studentMap.set('doesHaveUnreadReply', this.doesHaveUnreadReply(subResponses));

       studentMap.set('doesRequireAction', this.doesThreadRequireAction(studentMap));
      }
    });
    return submitterThreads;
  }.property('studentSubmissionThreads', 'nonTrashedResponses.@each.{status,wasReadByRecipient}'),

  approvingThreads: function() {
    let approvingThreads = Ember.Map.create();

    this.get('studentSubmissionThreads').forEach((thread, combinedId, map) => {
      // just exclude your own Id
      //each thread has studentId prop and submissions prop
      // combinedId is wsId +studentId

      let studentId = thread.get('studentIdentifier');
      let workspaceId = thread.get('workspaceId');

      if (studentId !== this.get('currentUser.id')) {

        let subs = thread.get('submissions');
        let subIds = subs.mapBy('id');

        let subResponses = this.get('nonTrashedResponses').filter((response) => {
          let subId = this.get('utils').getBelongsToId(response, 'submission');
         return this.isApprovingResponse(response) && subIds.includes(subId);
        });

        if (subResponses.get('length') > 0) {
          approvingThreads.set(combinedId, Ember.Map.create());
          let studentMap = approvingThreads.get(combinedId);
          studentMap.set('submissions', subs);
          studentMap.set('studentId', studentId);
          studentMap.set('responses', subResponses.sortBy('createDate'));
          studentMap.set('workspaceId', workspaceId);

         //  studentMap.set('hasNewRevision', this.hasNewRevision(subs));

          studentMap.set('doesHaveDraft', this.doesHaveDraft(subResponses));
          studentMap.set('latestRevision', subs.get('lastObject'));
          studentMap.set('latestReply', subResponses.get('lastObject'));

          studentMap.set('doesHaveUnreadReply', this.doesHaveUnreadReply(subResponses));
          studentMap.set('isWaitingForApproval', this.isWaitingForApproval(subResponses));

          studentMap.set('doesRequireAction', this.doesThreadRequireAction(studentMap));

        }
      }
    });
    return approvingThreads;
  }.property('studentSubmissionThreads', 'nonTrashedResponses.@each.{status,wasReadByRecipient}'),

  workspaceSubmissionThreads: function() {
    let threads = Ember.Map.create();

    this.get('uniqueWorkspaceIds').forEach((wsId) => {
      let relatedSubs = this.get('submissions').filter((submission) => {
        let workspaceIds = this.get('utils').getHasManyIds(submission, 'workspaces');
        return workspaceIds && workspaceIds.includes(wsId);
      });
      if (relatedSubs.get('length') > 0) {
        threads.set(wsId, relatedSubs);
      }
    });
    return threads;
  }.property('uniqueWorkspaceIds', 'submissions.[]'),

  // submissionThreads: function() {
  //   let hash = {};

  //   let threads = Ember.Map.create();
  //   // need a thread for each workspaceId, and for each workspace each student

  //   let uniqueWorkspaceIds = this.get('uniqueWorkspaceIds');
  //   uniqueWorkspaceIds.forEach((wsId) => {
  //     threads.set(wsId, Ember.Map.create());
  //   });

  //   // each studentId has own thread per workspace

  //   this.get('submissions').forEach((submission) => {
  //     let ntfs = this.get('newWorkToMentorNtfs');

  //     let subNtf = ntfs.find((ntf) => {
  //       let subId = this.get('utils').getBelongsToId(ntf, 'newSubmission');
  //       return subId === submission.get('id');
  //     });

  //     let isNew = true;

  //     if (!subNtf || subNtf.get('isTrashed') || subNtf.get('wasSeen')) {
  //       isNew = false;
  //     }

  //     if (submission && !hash[submission.get('id')]) {
  //       hash[submission.get('id')] = {
  //         isNew,
  //         notifications: [],
  //         responses: [],
  //         mentoringResponses: [],
  //         submitterResponses: [],
  //         approvingResponses: [],
  //         submission
  //       };
  //     }
  //   });

  //   this.get('nonTrashedResponses').forEach((response) => {
  //     let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
  //     let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
  //     let submissionId = this.get('utils').getBelongsToId(response, 'submission');
  //     let approvedById = this.get('utils').getBelongsToId(response, 'approvedBy');

  //     let responseType = response.get('responseType');
  //     let status = response.get('status');

  //     let isToYou = recipientId === this.get('currentUser.id');
  //     let isByYou = creatorId === this.get('currentUser.id');

  //     let isYourMentorReply = isByYou && responseType === 'mentor';
  //     let isApproverNote = isToYou && response.get('isApproverNoteOnly');

  //     let wasApprovedByYou = approvedById === this.get('currentUser.id');
  //     let isYourApproverReply = isByYou && responseType === 'approver';
  //     let needsApproval = status === 'pendingApproval';
  //     let isReplyToApprove = (!isToYou && !isByYou) && needsApproval;

  //     if (hash[submissionId]) {
  //       hash[submissionId].responses.addObject(response);

  //       if (isToYou && responseType === 'mentor' && status === 'approved') {
  //         hash[submissionId].submitterResponses.addObject(response);
  //       }

  //       if (isYourMentorReply || isApproverNote) {
  //         hash[submissionId].mentoringResponses.addObject(response);
  //       }

  //       if ( isReplyToApprove || isYourApproverReply || wasApprovedByYou ) {
  //         hash[submissionId].approvingResponses.addObject(response);
  //       }

  //     }
  //   });

  //   return hash;

  // }.property('nonTrashedResponses.[]', 'submissions.[]', 'newWorkToMentorNtfs.@each.{wasSeen,isTrashed}'),

  // allThreads: function() {
  //   return Object.values(this.get('submissionThreads'));
  // }.property('submissionThreads'),

  // sortedAllThreads: function() {
  //   return this.get('allThreads').sort((a, b) => {
  //     let aResponses = a.responses;
  //     let bResponses = b.responses;

  //     if (aResponses.get('length') === 0 && bResponses.get('length') === 0) {
  //       // both are new, use submission create date
  //       return b.submission.get('createDate') - a.submission.get('createDate');
  //     }

  //     let doesAHaveUnreadReply = this.doesHaveUnreadReply(aResponses);
  //     let doesBHaveUnreadReply = this.doesHaveUnreadReply(bResponses);

  //     let isANew = a.isNew;
  //     let isBNew = b.isNew;

  //     let doesANeedRevisions = this.doesNeedRevisions(aResponses);
  //     let doesBNeedRevisions = this.doesNeedRevisions(bResponses);

  //     let isAWaitingForApproval = this.isWaitingForApproval(aResponses);
  //     let isBWaitingForApproval = this.isWaitingForApproval(bResponses);

  //     let isADraft = this.doesHaveDraft(aResponses);
  //     let isBDraft = this.doesHaveDraft(bResponses);

  //     let areANotesOnly = this.areUnreadNotesOnly(aResponses);
  //     let areBNotesOnly = this.areUnreadNotesOnly(bResponses);

  //     if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
  //       // sort action items before unread notes
  //       if (areANotesOnly && (isBWaitingForApproval || doesBNeedRevisions || isBDraft || isBNew)) {
  //         return 1;
  //       }
  //       return -1;
  //     }

  //     if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
  //       if (areBNotesOnly && (isAWaitingForApproval || doesANeedRevisions || isADraft || isANew)) {
  //         return -1;
  //       }
  //       return 1;
  //     }

  //     // both unread or both read , sort needsRevisiosn first
  //     if (isAWaitingForApproval && !isBWaitingForApproval) {
  //       return -1;
  //     }

  //     if (isBWaitingForApproval && !isAWaitingForApproval) {
  //       return 1;
  //     }

  //     if (doesANeedRevisions && !doesBNeedRevisions) {
  //       return -1;
  //     }

  //     if (doesBNeedRevisions && !doesANeedRevisions) {
  //       return 1;
  //     }

  //     if (isANew && !isBNew) {
  //       return -1;
  //     }

  //     if (isBNew && !isANew) {
  //       return 1;
  //     }

  //     let newestA = aResponses.sortBy('createDate').get('lastObject');
  //     let newestB = bResponses.sortBy('createDate').get('lastObject');

  //     // both need revisions or both dont need revisions, sort by newest first

  //     if (newestA && !newestB) {
  //       return 1;
  //     }

  //     if (!newestA && newestB) {
  //       return -1;
  //     }

  //     let momentA = moment(newestA.get('createDate'));
  //     let momentB = moment(newestB.get('createDate'));

  //     let diff = momentA.diff(momentB);

  //     if (diff > 0) {
  //       return -1;
  //     }
  //     if (diff < 0) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }.property('allThreads'),

  // mentoringThreads: function() {
  //   return this.get('allThreads').filter((thread) => {
  //     let subCreatorId = thread.submission.get('creator.studentId');
  //     return subCreatorId !== this.get('currentUser.id');
  //   });
  // }.property('allThreads'),

  sortedMentoringThreads: function() {
    let threads = [];
    this.get('mentoringThreads').forEach((thread) => {
      threads.addObject(thread);
    });
    return threads.sort((a, b) => {
      let aResponses = a.get('responses');
      let bResponses = b.get('responses');

      // prioritize drafts
      let isADraft = a.get('doesHaveDraft');
      let isBDraft = b.get('doesHaveDraft');

      if (isADraft && !isBDraft) {
        return -1;
      }
      if (!isADraft && isBDraft) {
        return 1;
      }

      // 2nd needs revisions

      let doesANeedRevisions = a.get('doesNeedRevisions');
      let doesBNeedRevisions = b.get('doesNeedRevisions');

      if (doesANeedRevisions && !doesBNeedRevisions) {
        return -1;
      }

      if (doesBNeedRevisions && !doesANeedRevisions) {
        return 1;
      }

      // 3rd new revisions
      let isANew = a.get('hasNewRevision');
      let isBNew = b.get('hasNewRevision');

      if (isANew && !isBNew) {
        return -1;
      }

      if (isBNew && !isANew) {
        return 1;
      }

      // 4th unmentored

      let isAUnmentored = a.get('doesHaveUnmentoredRevision');
      let isBUnmentored = b.get('doesHaveUnmentoredRevision');

      if (isAUnmentored && !isBUnmentored) {
        return -1;
      }

      if (!isAUnmentored && isBUnmentored) {
        return 1;
      }

      let doesAHaveUnreadReply = a.get('doesHaveUnreadReply');
      let doesBHaveUnreadReply = b.get('doesHaveUnreadReply');

      let areANotesOnly = this.areUnreadNotesOnly(aResponses);
      let areBNotesOnly = this.areUnreadNotesOnly(bResponses);

      if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
        // sort action items before unread notes
        if (areANotesOnly && (doesBNeedRevisions || isBDraft || isBNew)) {
          return 1;
        }
        return -1;
      }

      if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
        if (areBNotesOnly && (doesANeedRevisions || isADraft || isANew)) {
          return -1;
        }
        return 1;
      }

      if (aResponses.get('length') === 0 && bResponses.get('length') === 0) {

        return b.get('latestRevision.createDate') - a.get('latestRevision.createDate');
      }

      let newestA = a.get('latestReply');
      let newestB = b.get('latestReply');

      // both need revisions or both dont need revisions, sort by newest first

      if (newestA && !newestB) {
        return 1;
      }

      if (!newestA && newestB) {
        return -1;
      }

      let momentA = moment(newestA.get('createDate'));
      let momentB = moment(newestB.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;

    });
  }.property('mentoringThreads'),

  mentoringResponses: function() {
    let responses = [];
    this.get('mentoringThreads').forEach((thread) => {
      responses.addObjects(thread.get('responses'));
    });
    return responses.uniqBy('id');
  }.property('mentoringThreads'),

  actionMentoringThreads: function() {
    let results = [];
    this.get('mentoringThreads').forEach((thread) => {
      if (thread.get('doesRequireAction')) {
        results.pushObject(thread);
      }
    });
    return results;
  }.property('mentoringThreads'),

  // submitterThreads: function() {
  //   return this.get('allThreads').filter((thread) => {
  //     return thread.submitterResponses.length > 0;
  //   });
  // }.property('allThreads'),

  sortedSubmitterThreads: function() {
    let threads = [];

    this.get('submitterThreads').forEach((thread) => {
      threads.addObject(thread);
    });

    return threads.sort((a, b) => {
      let doesAHaveUnreadReply = a.get('doesHaveUnreadReply');
      let doesBHaveUnreadReply = b.get('doesHaveUnreadReply');

      if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
        return -1;
      }

      if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
        return 1;
      }

      let newestA = a.get('latestReply');
      let newestB = b.get('latestReply');

      // both need revisions or both dont need revisions, sort by newest first

      if (newestA && !newestB) {
        return 1;
      }
      if (!newestA && newestB) {
        return -1;
      }

      if (!newestA && !newestB) {
        return b.get('latestRevision.createDate' - a.get('latestRevision.createDate'));
      }

      // should always be at least one response

      let momentA = moment(newestA.get('createDate'));
      let momentB = moment(newestB.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;
    });
  }.property('submitterThreads'),

  submitterResponses: function() {
    let responses = [];
    this.get('submitterThreads').forEach((thread) => {
      responses.addObjects(thread.get('responses'));
    });
    return responses;
  }.property('submitterThreads'),

  actionSubmitterThreads: function() {
    let results = [];
    this.get('submitterThreads').forEach((thread) => {
      if (thread.get('doesRequireAction')) {
        results.pushObject(thread);
      }
    });
    return results;
  }.property('submitterThreads'),

  // approvingThreads: function() {
  //   return this.get('allThreads').filter((thread) => {
  //     return thread.approvingResponses.length > 0;
  //   });
  // }.property('allThreads'),

  sortedApprovingThreads: function() {
    let threads = [];

    this.get('approvingThreads').forEach((thread) => {
      threads.addObject(thread);
    });

    return threads.sort((a, b) => {
      let aResponses = a.get('responses');
      let bResponses = b.get('responses');

      let isADraft = a.get('doesHaveDraft');
      let isBDraft = b.get('doesHaveDraft');

      if (isADraft && !isBDraft) {
        return -1;
      }
      if (isBDraft && !isADraft) {
        return 1;
      }

      if (aResponses.get('length') === 0 && bResponses.get('length') === 0) {
        // both are new, use submission create date
        return b.get('latestRevision.createDate') - a.get('latestRevision.createDate');
      }

      let doesANeedApproval = a.get('isWaitingForApproval');
      let doesBNeedApproval = b.get('isWaitingForApproval');

      if (doesANeedApproval && !doesBNeedApproval) {
        return -1;
      }

      if (doesBNeedApproval && !doesANeedApproval) {
        return 1;
      }

      let doesAHaveUnreadReply = a.get('doesHaveUnreadReply');
      let doesBHaveUnreadReply = b.get('doesHaveUnreadReply');

      if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
        return -1;
      }

      if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
        return 1;
      }

      let newestA = a.get('latestReply');
      let newestB = b.get('latestReply');

      // both need revisions or both dont need revisions, sort by newest first
      if (newestA && !newestB) {
        return -1;
      }

      if (!newestA && newestB) {
        return 1;
      }

      let momentA = moment(newestA.get('createDate'));
      let momentB = moment(newestB.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;

    });
  }.property('approvingThreads'),

  approvingResponses: function() {
    let responses = [];
    this.get('approvingThreads').forEach((thread) => {
      responses.addObjects(thread.get('responses'));
    });
    return responses;
  }.property('approvingThreads'),

  actionApprovingThreads: function() {
    let results = [];

    this.get('approvingThreads').forEach((thread) => {
      if (thread.get('doesRequireAction')) {
        results.pushObject(thread);
      }
    });

    return results;
  }.property('approvingThreads'),

  areAnyActionItems: function() {
    return this.get('actionSubmitterThreads.length') > 0 || this.get('actionMentoringThreads.length') > 0 || this.get('actionApprovingThreads.length') > 0;
  }.property('actionSubmitterThreads.[]', 'actionMentoringThreads.[]', 'actionApprovingThreads.[]'),

  displayThreads: function() {
    let val = this.get('currentFilter');
    if (val === 'submitter') {
      // return this.get('sortedSubmitterThreads');
      return this.get('sortedSubmitterThreads');
    }
    if (val === 'mentoring') {
      // return this.get('sortedMentoringThreads');
      return this.get('sortedMentoringThreads');

    }

    if (val === 'approving') {
      return this.get('sortedApprovingThreads');
      // return this.get('sortedApprovingThreads');
    }

    if (val === 'all') {
      return this.get('sortedAllThreads');
    }
  }.property('currentFilter'),

  submitterActionItems: function() {
    return this.get('submitterResponses').rejectBy('wasReadByRecipient');
  }.property('submitterResponses.@each.wasReadByRecipient'),

  mentoringActionItems: function() {
    return this.get('mentoringResponses').filter((response) => {
      return !response.get('wasReadByRecipient') && response.get('status') === 'needsRevisions';
    });
  }.property('mentoringResponses.@each.{wasReadByRecipient,status}'),

  approvingActionItems: function() {
    return this.get('approvingResponses').filter((response) => {
      return !response.get('wasReadByRecipient') && response.get('status') === 'pendingApproval';
    });
  }.property('approvingResponses.@each.{wasReadByRecipient,status}'),

  submitterCounter: function() {
    let count = this.get('actionSubmitterThreads.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('actionSubmitterThreads.[]'),

  mentoringCounter: function() {
    let count = this.get('actionMentoringThreads.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('actionMentoringThreads.[]'),

  approvingCounter: function() {
    let count = this.get('actionApprovingThreads.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('actionApprovingThreads.[]'),

  showStatusColumn: function() {
    return this.get('currentFilter') === 'mentoring' || this.get('currentFilter') === 'approving' || this.get('currentFilter') === 'all';
  }.property('currentFilter'),

  nonTrashedResponses: function() {
    return this.get('responses').rejectBy('isTrashed');
  }.property('responses.@each.isTrashed'),

  doesHaveUnreadReply(responses) {
      if (!responses) {
        return false;
      }
      let unreadReply = responses.find((response) => {
        let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
        return !response.get('wasReadByRecipient') && recipientId === this.get('currentUser.id');
      });
      return !this.get('utils').isNullOrUndefined(unreadReply);
  },

  areUnreadNotesOnly(responses) {
    if (!responses) {
      return false;
    }
    let unreadReplies = responses.filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      return !response.get('wasReadByRecipient') && creatorId === this.get('currentUser.id');
    });

    if (unreadReplies.get('length') === 0) {
      return false;
    }

    let nonNotes = unreadReplies.rejectBy('isApproverNoteOnly');
    return unreadReplies.length === nonNotes.get('length');
  },

  doesNeedRevisions(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'needsRevisions';
    });
    return !this.get('utils').isNullOrUndefined(reply);
},

  isWaitingForApproval(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'pendingApproval';
    });
    return !this.get('utils').isNullOrUndefined(reply);
  },

  doesHaveDraft(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'draft';
    });
    return !this.get('utils').isNullOrUndefined(reply);
  },

  actions: {
    showSubmitterResponses() {
      this.set('currentFilter', 'submitter');
    },
    showApprovingResponses() {
      this.set('currentFilter', 'approving');
    },
    showMentoringResponses() {
      this.set('currentFilter', 'mentoring');
    },
    showAllResponses() {
      this.set('currentFilter', 'all');

    },
    toSubmissionResponse(sub) {
      this.sendAction('toSubmissionResponse', sub.get('id'));
    },
    toResponse(submissionId, responseId) {
      this.sendAction('toResponse', submissionId, responseId);
    },
    refreshList() {
      this.sendAction('toResponses');
    },
  }
});
