Encompass.ResponseContainerComponent = Ember.Component.extend({
  elementId: 'response-container',
  wsPermission: Ember.inject.service('workspace-permissions'),
  submission: null,
  subResponses: [],

  isCreatingNewMentorReply: false,



  // isCreatingNewMentorReply
  //

  didReceiveAttrs() {
    console.log('dra rc model', this.get('model'));
    console.log('dra rc response', this.get('response'));
    let isNew = this.get('response.isNew');
    console.log('isNew', isNew);
    if (isNew) {
      this.set('isCreatingNewMentorReply', true);
    }
    // console.log('sub', this.get('response.submission'));
    this.set('isFetching', true);
    this.fetchWorkspace().then((ws) => {
      this.set('responseWorkspace', ws);
      this.set('isFetching', false);
    })
    .catch((err) => {
      this.set('isFetching', false);

      console.log('err', err);
    });
    // if (this.get('model.currentState'))
    this._super(...arguments);
  },
  fetchWorkspace() {
    return this.get('response.workspace');
  }
});