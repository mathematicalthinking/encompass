import { resolve, hash } from 'rsvp';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from '../routes/_authenticated_route';


export default AuthenticatedRoute.extend({
  utils: service('utility-methods'),
  queryParams: {
    responseId: {
      refreshModel: true
    }
  },

  beforeModel(transition) {
    let responseId = transition.queryParams.responseId;
    let allResponses = this.store.peekAll('response');

    if (this.utils.isValidMongoId(responseId)) {
      let response = allResponses.findBy('id', responseId);

      this.set('response', response);
    } else {
      this.set('response', null);
    }
  },
  resolveSubmission(submissionId) {
    let peeked = this.store.peekRecord('submission', submissionId);
    if (peeked) {
      return resolve(peeked);
    }
    return this.store.findRecord('submission', submissionId);
  },

  resolveWorkspace(workspaceId) {
    let peeked = this.store.peekRecord('workspace', workspaceId);
    if (peeked) {
      return resolve(peeked);
    }
    return this.store.findRecord('workspace', workspaceId);

  },

  async model(params) {
    if (!params.submission_id) {
      return null;
    }

    let allResponses = await this.store.peekAll('response');

    return this.resolveSubmission(params.submission_id)
      .then((submission) => {
        let wsIds = submission.hasMany('workspaces').ids();
        let wsId = wsIds.get('firstObject');
        return hash({
          submission,
          workspace: this.resolveWorkspace(wsId),
        });
      })
      .then((hash) => {
        return hash({
          submission: hash.submission,
          workspace: hash.workspace,
          submissions: hash.workspace.get('submissions'),
        });
      })
      .then((hash) => {
        let studentSubmissions = hash.submissions.filterBy('student', hash.submission.get('student'));

        let associatedResponses = allResponses.filter((response) => {
          let subId = response.belongsTo('submission').id();
          return response.get('id') && !response.get('isTrashed') && subId === hash.submission.get('id');
        });

        let response = this.response;
        if (!this.response) {
          response = associatedResponses
            .filterBy('responseType', 'mentor')
            .sortBy('createDate').get('lastObject');
        }

        return {
          submission: hash.submission,
          workspace: hash.workspace,
          submissions: studentSubmissions,
          responses: associatedResponses,
          response: response,
          allResponses,
        };
      });
  },

  redirect(model, transition) {
    if (!model) {
      this.transitionTo('responses');
    }
  },
  actions: {
    toResponseSubmission(subId) {
      this.transitionTo('responses.submission', subId);
    },
    toResponse(submissionId, responseId) {
      this.transitionTo('responses.submission', submissionId, { queryParams: { responseId: responseId } });
    },
    toResponses() {
      this.transitionTo('responses');
    },
    toNewResponse: function (submissionId, workspaceId) {
      this.transitionTo('responses.new.submission', submissionId, { queryParams: { workspaceId: workspaceId } });
    }
  },

  renderTemplate() {
    this.render('responses/response');
  }
});