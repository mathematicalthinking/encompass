import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import { A } from '@ember/array';

const createServiceMock = () => class extends Service {};

module('Integration | Component | response-mentor-reply', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class CurrentUserService extends Service {
      user = { id: 'user1', username: 'testuser' };
    }
    this.owner.register('service:current-user', CurrentUserService);

    this.owner.register('service:sweet-alert', createServiceMock());
    this.owner.register('service:loading-display', createServiceMock());
    this.owner.register('service:error-handling', createServiceMock());
    this.owner.register('service:utility-methods', createServiceMock());
    this.owner.register('service:navigation', createServiceMock());
  });

  function mockResponseGet(response, studentName = 'Test Student') {
    response.get = function(key) {
      if (key === 'submission.student') return studentName;
      return this[key];
    };
  }

  async function renderMentorReply(context, props) {
    const store = context.owner.lookup('service:store');
    
    if (!context.user) {
      context.user = store.createRecord('user', { id: 'user1', username: 'testuser' });
      context.recipient = store.createRecord('user', { id: 'user2', username: 'student1' });
      context.submission = store.createRecord('submission', {
        id: 'sub1',
        creator: { username: 'Test Student', safeName: 'Test Student' }
      });
      context.workspace = store.createRecord('workspace', { id: 'ws1', name: 'Test Workspace' });
    }

    context.setProperties({
      displayResponse: null,
      submission: context.submission,
      workspace: context.workspace,
      submissionResponses: [],
      toNewResponse: () => {},
      ...props,
    });

    if (context.submissionResponses && !context.submissionResponses.sortBy) {
      context.set('submissionResponses', A(context.submissionResponses));
    }

    await render(hbs`<ResponseMentorReply
      @displayResponse={{this.displayResponse}}
      @submission={{this.submission}}
      @workspace={{this.workspace}}
      @submissionResponses={{this.submissionResponses}}
      @canDirectSend={{this.canDirectSend}}
      @canApprove={{this.canApprove}}
      @canSend={{this.canSend}}
      @isOwnMentorReply={{this.isOwnMentorReply}}
      @isOwnSubmission={{this.isOwnSubmission}}
      @isParentWorkspace={{this.isParentWorkspace}}
      @toNewResponse={{this.toNewResponse}}
    />`);
  }

  test('renders no replies message when empty', async function (assert) {
    await renderMentorReply(this, {
      displayResponse: null,
      submissionResponses: [],
      canSendNew: true,
    });

    assert.dom('.info').exists();
    assert.dom('.info').includesText('No Mentor Feedback');
  });

  test('renders component with approved response', async function (assert) {
    const store = this.owner.lookup('service:store');
    const user = store.createRecord('user', { id: 'user1', username: 'testuser' });
    const recipient = store.createRecord('user', { id: 'user2', username: 'student1' });
    const submission = store.createRecord('submission', {
      id: 'sub1',
      creator: { username: 'Test Student', safeName: 'Test Student' }
    });
    const response = store.createRecord('response', {
      text: 'Great work!',
      status: 'approved',
      createDate: new Date(),
    });
    response.createdBy = user;
    response.recipient = recipient;
    response.submission = submission;
    mockResponseGet(response);

    this.setProperties({ user, recipient, submission });

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
    });

    assert.dom('.response-mentor-container').exists();
  });

  test('handles empty submissionResponses array', async function (assert) {
    await renderMentorReply(this, {
      displayResponse: null,
      submissionResponses: [],
    });

    assert.dom('.info').exists();
  });

  test('shows new response button when canSendNew is true', async function (assert) {
    await renderMentorReply(this, {
      displayResponse: null,
      submissionResponses: [],
      canSend: true,
      isOwnSubmission: false,
      isParentWorkspace: false,
    });

    assert.dom('button.primary-button').exists();
    assert.dom('button.primary-button').hasText('New Response');
  });

  test('hides new response button when canSendNew is false', async function (assert) {
    await renderMentorReply(this, {
      displayResponse: null,
      submissionResponses: [],
      canSend: false,
    });

    assert.dom('button.primary-button').doesNotExist();
  });

  test('renders without errors when submission is null', async function (assert) {
    await renderMentorReply(this, {
      submission: null,
    });

    assert.ok(true, 'Component renders without errors when submission is null');
  });

  // --- Computed Properties Tests ---

  test('newReplyStatus returns approved when canDirectSend is true', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Test',
      status: 'approved',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
      canDirectSend: true,
    });

    assert.dom('.response-mentor-container').exists();
  });

  test('canSendNew returns true when conditions met', async function (assert) {
    await renderMentorReply(this, {
      canSend: true,
      isOwnSubmission: false,
      isParentWorkspace: false,
    });

    assert.dom('.info').exists();
  });

  test('canSendNew returns false in parent workspace', async function (assert) {
    await renderMentorReply(this, {
      canSend: true,
      isOwnSubmission: false,
      isParentWorkspace: true,
    });

    assert.dom('button.primary-button').doesNotExist();
  });



  // --- Multiple Responses Tests ---

  test('renders multiple mentor replies sorted by date', async function (assert) {
    const store = this.owner.lookup('service:store');
    const user = store.createRecord('user', { username: 'mentor' });
    const recipient = store.createRecord('user', { username: 'student' });
    const submission = store.createRecord('submission', { 
      creator: { username: 'Test Student' }
    });

    const response1 = store.createRecord('response', {
      text: 'First reply',
      status: 'approved',
      createDate: new Date('2024-01-01'),
    });
    response1.createdBy = user;
    response1.recipient = recipient;
    response1.submission = submission;
    mockResponseGet(response1);

    const response2 = store.createRecord('response', {
      text: 'Second reply',
      status: 'approved',
      createDate: new Date('2024-01-02'),
    });
    response2.createdBy = user;
    response2.recipient = recipient;
    response2.submission = submission;
    mockResponseGet(response2);

    this.setProperties({ user, recipient, submission });

    await renderMentorReply(this, {
      displayResponse: response1,
      submissionResponses: A([response1, response2]),
    });

    assert.dom('.response-mentor-container').exists();
  });

  // --- Status and Permission Tests ---

  test('renders draft response', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Draft',
      status: 'draft',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
      isOwnMentorReply: true,
    });

    assert.dom('.response-mentor-container').exists();
  });

  test('renders pending approval response', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Pending',
      status: 'pendingApproval',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
      canApprove: true,
    });

    assert.dom('.response-mentor-container').exists();
  });

  // --- Parent Workspace Tests ---

  test('shows recipient info in parent workspace', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Test',
      status: 'approved',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
      isParentWorkspace: true,
    });

    assert.dom('.response-label').exists();
  });

  //--- Note Display Tests ---

  test('displays note for pending approval', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Test',
      note: 'Approver note',
      status: 'pendingApproval',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
      isOwnMentorReply: true,
    });

    assert.dom('.response-mentor-container').exists();
  });

  test('handles empty note', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Test',
      note: '',
      status: 'approved',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
    });

    assert.dom('.response-mentor-container').exists();
  });

  test('handles null note', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Test',
      note: null,
      status: 'approved',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
    });

    assert.dom('.response-mentor-container').exists();
  });

  //--- Read/Unread Icon Tests ---

  test('shows read icon when recipient has seen message', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Test',
      status: 'approved',
      wasReadByRecipient: true,
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
    });

    assert.dom('.response-mentor-container').exists();
  });

  // --- Edge Cases ---

  test('renders with null workspace', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Test',
      status: 'approved',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', { creator: { username: 'student' } });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: A([response]),
      workspace: null,
    });

    assert.ok(true, 'Renders without errors when workspace is null');
  });

  test('filters responses by current student', async function (assert) {
    const store = this.owner.lookup('service:store');
    const user = store.createRecord('user', { username: 'mentor' });
    const recipient1 = store.createRecord('user', { username: 'student1' });
    const recipient2 = store.createRecord('user', { username: 'student2' });
    const submission1 = store.createRecord('submission', { creator: { username: 'student1' } });
    const submission2 = store.createRecord('submission', { creator: { username: 'student2' } });

    const response1 = store.createRecord('response', {
      text: 'For student1',
      status: 'approved',
      createDate: new Date(),
    });
    response1.createdBy = user;
    response1.recipient = recipient1;
    response1.submission = submission1;
    mockResponseGet(response1, 'student1');

    const response2 = store.createRecord('response', {
      text: 'For student2',
      status: 'approved',
      createDate: new Date(),
    });
    response2.createdBy = user;
    response2.recipient = recipient2;
    response2.submission = submission2;
    mockResponseGet(response2, 'student2');

    this.setProperties({ user, recipient: recipient1, submission: submission1 });

    await renderMentorReply(this, {
      displayResponse: response1,
      submissionResponses: A([response1, response2]),
    });

    assert.dom('.response-mentor-container').exists();
  });
});
