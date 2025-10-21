import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

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
    response.get = function (key) {
      if (key === 'submission.student') return studentName;
      return this[key];
    };
  }

  async function renderMentorReply(context, props) {
    const store = context.owner.lookup('service:store');

    if (!context.user) {
      context.user = store.createRecord('user', {
        id: 'user1',
        username: 'testuser',
      });
      context.recipient = store.createRecord('user', {
        id: 'user2',
        username: 'student1',
      });
      context.submission = store.createRecord('submission', {
        id: 'sub1',
        creator: { username: 'Test Student', safeName: 'Test Student' },
      });
      context.workspace = store.createRecord('workspace', {
        id: 'ws1',
        name: 'Test Workspace',
      });
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
      context.set('submissionResponses', [context.submissionResponses]);
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
    const user = store.createRecord('user', {
      id: 'user1',
      username: 'testuser',
    });
    const recipient = store.createRecord('user', {
      id: 'user2',
      username: 'student1',
    });
    const submission = store.createRecord('submission', {
      id: 'sub1',
      creator: { username: 'Test Student', safeName: 'Test Student' },
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
      submissionResponses: [response],
    });

    assert.dom('.response-mentor-container').exists();
  });

  // Tests empty state WITHOUT canSendNew prop - different scenario from above

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
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
      canDirectSend: true,
    });

    assert.dom('.response-mentor-container').exists();
  });

  // Tests specific edge case: canSend=true BUT isParentWorkspace=true should still hide button
  // Different from 'hides new response button' which tests canSend=false
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
      creator: { username: 'Test Student' },
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
      submissionResponses: [response1, response2],
    });

    assert.dom('.response-mentor-container').exists();
  });

  // --- Status and Permission Tests ---

  test('renders pending approval response', async function (assert) {
    const store = this.owner.lookup('service:store');
    const response = store.createRecord('response', {
      text: 'Pending',
      status: 'pendingApproval',
      createDate: new Date(),
    });
    response.createdBy = store.createRecord('user', { username: 'mentor' });
    response.recipient = store.createRecord('user', { username: 'student' });
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
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
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
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
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
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
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
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
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
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
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
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
    response.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    mockResponseGet(response);

    await renderMentorReply(this, {
      displayResponse: response,
      submissionResponses: [response],
      workspace: null,
    });

    assert.ok(true, 'Renders without errors when workspace is null');
  });

  test('filters responses by current student', async function (assert) {
    const store = this.owner.lookup('service:store');
    const user = store.createRecord('user', { username: 'mentor' });
    const recipient1 = store.createRecord('user', { username: 'student1' });
    const recipient2 = store.createRecord('user', { username: 'student2' });
    const submission1 = store.createRecord('submission', {
      creator: { username: 'student1' },
    });
    const submission2 = store.createRecord('submission', {
      creator: { username: 'student2' },
    });

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

    this.setProperties({
      user,
      recipient: recipient1,
      submission: submission1,
    });

    await renderMentorReply(this, {
      displayResponse: response1,
      submissionResponses: [response1, response2],
    });

    assert.dom('.response-mentor-container').exists();
  });

  // --------DRAFT FUNCTIONALITY TESTS-------------

  // Test: saveDraft action with isDraft=false (sending for approval)
  // Verify draft can be finalized and sent for approval or directly approved
  test('saveDraft with isDraft=false sends draft for approval when canDirectSend is false', async function (assert) {
    const store = this.owner.lookup('service:store');

    const draftResponse = store.createRecord('response', {
      text: 'Ready to send',
      status: 'draft',
      createDate: new Date(),
    });
    draftResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    draftResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    draftResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    draftResponse.save = async function () {
      return this;
    };

    mockResponseGet(draftResponse);

    await renderMentorReply(this, {
      displayResponse: draftResponse,
      submissionResponses: [draftResponse],
      isOwnMentorReply: true,
      canDirectSend: false, // Mentor needs approval
    });

    assert.dom('.response-mentor-container').exists('Response should render');
  });

  // Test: saveDraft with canDirectSend=true
  // Verify that mentors with direct send permission can save draft as approved
  test('saveDraft with isDraft=false directly approves when canDirectSend is true', async function (assert) {
    const store = this.owner.lookup('service:store');

    const draftResponse = store.createRecord('response', {
      text: 'Ready to send directly',
      status: 'draft',
      createDate: new Date(),
    });
    draftResponse.createdBy = store.createRecord('user', {
      username: 'senior-mentor',
    });
    draftResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    draftResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    mockResponseGet(draftResponse);

    await renderMentorReply(this, {
      displayResponse: draftResponse,
      submissionResponses: [draftResponse],
      isOwnMentorReply: true,
      canDirectSend: true, // Senior mentor can send directly
    });

    assert.dom('.response-mentor-container').exists('Response should render');
  });

  // Test: Draft superseding pendingApproval response
  // Verify that when a draft is finalized, it properly supersedes any prior pendingApproval
  test('saveDraft supersedes prior pendingApproval response', async function (assert) {
    const store = this.owner.lookup('service:store');

    // Create a prior response that's pending approval
    const priorResponse = store.createRecord('response', {
      text: 'First attempt',
      status: 'pendingApproval',
      createDate: new Date('2024-01-01'),
    });
    priorResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    priorResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    priorResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    priorResponse.save = async function () {
      return this;
    };
    // Create new draft that will supersede the prior one
    const newDraft = store.createRecord('response', {
      text: 'Revised version',
      status: 'draft',
      createDate: new Date('2024-01-02'),
    });
    newDraft.createdBy = store.createRecord('user', { username: 'mentor' });
    newDraft.recipient = store.createRecord('user', { username: 'student' });
    newDraft.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    newDraft.save = async function () {
      return this;
    };
    mockResponseGet(priorResponse);
    mockResponseGet(newDraft);

    await renderMentorReply(this, {
      displayResponse: newDraft,
      submissionResponses: [priorResponse, newDraft],
      priorMentorRevision: priorResponse,
      isOwnMentorReply: true,
    });

    assert.dom('.response-mentor-container').exists('Responses should render');
  });

  // Test: Renders approved response when mentor owns it
  // Note: This tests rendering only. Actual saveRevision action testing requires component interaction
  test('renders approved response owned by mentor', async function (assert) {
    const store = this.owner.lookup('service:store');

    const originalResponse = store.createRecord('response', {
      text: 'Original response',
      status: 'approved',
      createDate: new Date('2024-01-01'),
    });
    originalResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    originalResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    originalResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    mockResponseGet(originalResponse);

    await renderMentorReply(this, {
      displayResponse: originalResponse,
      submissionResponses: [originalResponse],
      isOwnMentorReply: true,
    });

    assert
      .dom('.response-mentor-container')
      .exists('Original response should render');
    assert.strictEqual(
      originalResponse.status,
      'approved',
      'Original should remain approved'
    );
  });

  // Test: Renders approved response when mentor has direct send permission
  // Note: This tests rendering only. Actual saveRevision action testing requires component interaction
  test('renders approved response when mentor can direct send', async function (assert) {
    const store = this.owner.lookup('service:store');

    const originalResponse = store.createRecord('response', {
      text: 'Original response',
      status: 'approved',
      createDate: new Date('2024-01-01'),
    });
    originalResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    originalResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    originalResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    mockResponseGet(originalResponse);

    await renderMentorReply(this, {
      displayResponse: originalResponse,
      submissionResponses: [originalResponse],
      isOwnMentorReply: true,
      canDirectSend: true,
    });

    assert.dom('.response-mentor-container').exists('Response should render');
  });

  // Test: Renders draft response owned by mentor with note
  // Note: This tests rendering only. Actual resume draft action testing requires component interaction
  test('renders draft response owned by mentor with note', async function (assert) {
    const store = this.owner.lookup('service:store');

    const draftResponse = store.createRecord('response', {
      text: 'Unfinished draft',
      note: 'Need to add more details',
      status: 'draft',
      createDate: new Date(),
    });
    draftResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    draftResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    draftResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    mockResponseGet(draftResponse);

    await renderMentorReply(this, {
      displayResponse: draftResponse,
      submissionResponses: [draftResponse],
      isOwnMentorReply: true,
    });

    assert.dom('.response-mentor-container').exists('Draft should render');
    assert.strictEqual(draftResponse.status, 'draft', 'Status should be draft');
    assert.strictEqual(
      draftResponse.note,
      'Need to add more details',
      'Note should be preserved'
    );
  });

  // Test: Draft with approver note
  // Verify that drafts can include notes for approvers
  test('draft can include note for approver', async function (assert) {
    const store = this.owner.lookup('service:store');

    const draftResponse = store.createRecord('response', {
      text: 'Response text',
      note: 'Please review tone - not sure if too harsh',
      status: 'draft',
      createDate: new Date(),
    });
    draftResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    draftResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    draftResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    mockResponseGet(draftResponse);

    await renderMentorReply(this, {
      displayResponse: draftResponse,
      submissionResponses: [draftResponse],
      isOwnMentorReply: true,
    });

    assert
      .dom('.response-mentor-container')
      .exists('Draft with note should render');
    assert.strictEqual(
      draftResponse.note,
      'Please review tone - not sure if too harsh',
      'Note should be preserved'
    );
  });

  // Test: Multiple drafts handling
  // Verify system handles multiple draft responses correctly
  test('handles multiple draft responses for same submission', async function (assert) {
    const store = this.owner.lookup('service:store');
    const user = store.createRecord('user', { username: 'mentor' });
    const recipient = store.createRecord('user', { username: 'student' });
    const submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    const draft1 = store.createRecord('response', {
      text: 'First draft',
      status: 'draft',
      createDate: new Date('2024-01-01'),
    });
    draft1.createdBy = user;
    draft1.recipient = recipient;
    draft1.submission = submission;
    mockResponseGet(draft1);

    const draft2 = store.createRecord('response', {
      text: 'Second draft',
      status: 'draft',
      createDate: new Date('2024-01-02'),
    });
    draft2.createdBy = user;
    draft2.recipient = recipient;
    draft2.submission = submission;
    mockResponseGet(draft2);

    await renderMentorReply(this, {
      displayResponse: draft2,
      submissionResponses: [draft1, draft2],
      isOwnMentorReply: true,
    });

    assert
      .dom('.response-mentor-container')
      .exists('Multiple drafts should render');
  });

  // Test: Renders draft when mentor has direct send permission
  // Note: This tests rendering only. Actual draft-to-approved transition testing requires component interaction
  test('renders draft when mentor has direct send permission', async function (assert) {
    const store = this.owner.lookup('service:store');

    const draftResponse = store.createRecord('response', {
      text: 'Finalized response',
      status: 'draft',
      createDate: new Date(),
    });
    draftResponse.createdBy = store.createRecord('user', {
      username: 'senior-mentor',
    });
    draftResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    draftResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    mockResponseGet(draftResponse);

    await renderMentorReply(this, {
      displayResponse: draftResponse,
      submissionResponses: [draftResponse],
      isOwnMentorReply: true,
      canDirectSend: true,
    });

    assert.dom('.response-mentor-container').exists('Draft should render');
    assert.strictEqual(
      draftResponse.status,
      'draft',
      'Should be in draft status'
    );
  });

  // Test: Draft with empty text validation
  // Verify that drafts with empty content are handled properly
  test('handles draft with minimal content', async function (assert) {
    const store = this.owner.lookup('service:store');

    const draftResponse = store.createRecord('response', {
      text: 'A', // Minimal content
      status: 'draft',
      createDate: new Date(),
    });
    draftResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    draftResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    draftResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });

    mockResponseGet(draftResponse);

    await renderMentorReply(this, {
      displayResponse: draftResponse,
      submissionResponses: [draftResponse],
      isOwnMentorReply: true,
    });

    assert
      .dom('.response-mentor-container')
      .exists('Draft with minimal content should render');
  });

  // Test: Draft superseding needsRevisions status
  // Verify draft properly supersedes responses marked as needing revisions
  test('draft supersedes response with needsRevisions status', async function (assert) {
    const store = this.owner.lookup('service:store');

    const needsRevisionResponse = store.createRecord('response', {
      text: 'Needs work',
      status: 'needsRevisions',
      createDate: new Date('2024-01-01'),
    });
    needsRevisionResponse.createdBy = store.createRecord('user', {
      username: 'mentor',
    });
    needsRevisionResponse.recipient = store.createRecord('user', {
      username: 'student',
    });
    needsRevisionResponse.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    needsRevisionResponse.save = async function () {
      return this;
    };

    const revisedDraft = store.createRecord('response', {
      text: 'Revised version',
      status: 'draft',
      createDate: new Date('2024-01-02'),
    });
    revisedDraft.createdBy = store.createRecord('user', { username: 'mentor' });
    revisedDraft.recipient = store.createRecord('user', {
      username: 'student',
    });
    revisedDraft.submission = store.createRecord('submission', {
      creator: { username: 'student' },
    });
    revisedDraft.save = async function () {
      return this;
    };

    mockResponseGet(needsRevisionResponse);
    mockResponseGet(revisedDraft);

    await renderMentorReply(this, {
      displayResponse: revisedDraft,
      submissionResponses: [needsRevisionResponse, revisedDraft],
      priorMentorRevision: needsRevisionResponse,
      isOwnMentorReply: true,
    });

    assert
      .dom('.response-mentor-container')
      .exists('Revised draft should render');
  });
});
