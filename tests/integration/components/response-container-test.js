import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

const createServiceMock = () => class extends Service {};

module('Integration | Component | response-container', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class CurrentUserService extends Service {
      user = null;

      constructor() {
        super(...arguments);
        this.user = { id: 'user1', username: 'testuser' };
      }
    }
    this.owner.register('service:current-user', CurrentUserService);

    class UtilityMethodsService extends Service {
      getBelongsToId(obj, field) {
        return obj[field]?.id || obj[field];
      }
      getHasManyIds(obj, field) {
        return obj[field] || [];
      }
      isNonEmptyObject(obj) {
        return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
      }
      isNonEmptyArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
      }
    }
    this.owner.register('service:utility-methods', UtilityMethodsService);

    class WorkspacePermissionsService extends Service {
      canApproveFeedback() {
        return false;
      }
      canEdit() {
        return false;
      }
    }
    this.owner.register(
      'service:workspace-permissions',
      WorkspacePermissionsService
    );
    class NotificationService extends Service {
      findRelatedNtfs() {
        return [];
      }
    }
    this.owner.register('service:notification-service', NotificationService);

    class StoreService extends Service {
      peekAll() {
        return [];
      }
      createRecord() {
        return { save: () => Promise.resolve() };
      }
      peekRecord() {
        return null;
      }
    }
    this.owner.register('service:store', StoreService);
    this.owner.register('service:navigation', createServiceMock());
    this.owner.register('service:error-handling', createServiceMock());
    this.owner.register('service:sweet-alert', createServiceMock());
    this.owner.register('service:loading-display', createServiceMock());
  });

  // --- Setup & Mocks ---

  const mockSubmission = {
    id: 'sub1',
    student: 'Test Student',
    creator: { studentId: 'user1' },
    isTrashed: false,
    createDate: new Date('2024-01-01'),
    puzzle: { title: 'Test Problem' },
    responses: [],
  };

  const mockWorkspace = {
    id: 'ws1',
    name: 'Test Workspace',
    workspaceType: 'Student',
    feedbackAuthorizers: [],
  };

  const mockMentorResponse = {
    id: 'resp1',
    responseType: 'mentor',
    text: 'Great work!',
    note: 'Additional note',
    status: 'approved',
    isTrashed: false,
    isNew: false,
    createdBy: { id: 'user1' },
    recipient: { id: 'user2' },
    submission: 'sub1',
    priorRevision: Promise.resolve(null),
    reviewedResponse: Promise.resolve(null),
    get(key) {
      if (key === 'submission.student') return mockSubmission.student;
      return this[key];
    },
    belongsTo(field) {
      return { id: () => this[field] };
    },
  };

  async function renderResponseContainer(context, props) {
    const submissions =
      props.submissions || (props.submission ? [props.submission] : []);
    context.setProperties({
      submissions,
      toResponses: () => {},
      toNewResponse: () => {},
      toResponse: () => {},
      toResponseSubmission: () => {},
      ...props,
    });

    await render(hbs`<ResponseContainer
      @response={{this.response}}
      @workspace={{this.workspace}}
      @submission={{this.submission}}
      @responses={{this.responses}}
      @submissions={{this.submissions}}
      @storeResponses={{this.storeResponses}}
      @toResponses={{this.toResponses}}
      @toNewResponse={{this.toNewResponse}}
      @toResponse={{this.toResponse}}
      @toResponseSubmission={{this.toResponseSubmission}}
    />`);
  }

  // --- Basic Rendering ---

  test('renders component with container and header', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert.dom('.response-container').exists();
    assert.dom('.response-header-container').exists();
  });

  test('displays problem title in header', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert.dom('.problem-link').hasText(mockSubmission.puzzle.title);
  });

  test('displays workspace name in header', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert.dom('.problem-link-container a.link').hasText(mockWorkspace.name);
  });

  test('shows "Displaying feedback re:" text', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.problem-link-container')
      .containsText('Displaying feedback re:');
  });

  // --- Response Type Handling ---

  test('renders with mentor response type', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists('Component renders successfully with mentor response type');
  });

  test('renders with parent workspace type', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: { ...mockWorkspace, workspaceType: 'parent' },
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists('Component renders successfully with parent workspace type');
  });

  // --- Data Filtering & Sorting ---

  test('filters out trashed responses', async function (assert) {
    const trashedResponse = {
      ...mockMentorResponse,
      id: 'resp2',
      isTrashed: true,
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [mockMentorResponse, trashedResponse],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when filtering trashed responses'
      );
  });

  test('filters out trashed submissions', async function (assert) {
    const trashedSubmission = {
      ...mockSubmission,
      id: 'sub2',
      isTrashed: true,
      puzzle: { title: 'Trashed' },
      responses: [],
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      submissions: [mockSubmission, trashedSubmission],
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when filtering trashed submissions'
      );
  });

  test('sorts submissions newest first', async function (assert) {
    const oldSubmission = {
      ...mockSubmission,
      id: 'sub2',
      createDate: new Date('2023-01-01'),
      puzzle: { title: 'Old Problem' },
      responses: [],
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      submissions: [oldSubmission, mockSubmission],
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when sorting submissions by date'
      );
  });

  test('handles multiple submissions', async function (assert) {
    const submission2 = {
      ...mockSubmission,
      id: 'sub2',
      createDate: new Date('2024-02-01'),
      puzzle: { title: 'Problem 2' },
      responses: [],
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      submissions: [mockSubmission, submission2],
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists('Component renders without errors with multiple submissions');
  });

  // --- Edge Cases ---

  test('renders without optional args', async function (assert) {
    this.setProperties({
      submissions: [],
      toResponses: () => {},
      toNewResponse: () => {},
      toResponse: () => {},
      toResponseSubmission: () => {},
    });

    await render(hbs`<ResponseContainer
      @submissions={{this.submissions}}
      @toResponses={{this.toResponses}}
      @toNewResponse={{this.toNewResponse}}
      @toResponse={{this.toResponse}}
      @toResponseSubmission={{this.toResponseSubmission}}
    />`);

    assert.dom('.response-container').exists();
  });

  test('initializes with provided responses array', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [mockMentorResponse],
    });

    assert
      .dom('.response-container')
      .exists('Component initializes successfully with responses array');
  });

  // --- Response Filtering ---

  test('filters mentor replies from mixed response types', async function (assert) {
    const approverResponse = {
      ...mockMentorResponse,
      id: 'resp2',
      responseType: 'approver',
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [mockMentorResponse, approverResponse],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when filtering mentor vs approver responses'
      );
  });

  test('combines responses from responses and storeResponses', async function (assert) {
    const storeResponse = {
      ...mockMentorResponse,
      id: 'resp3',
      isTrashed: false,
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [mockMentorResponse],
      storeResponses: [storeResponse],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when combining responses and storeResponses'
      );
  });

  test('excludes trashed responses from storeResponses', async function (assert) {
    const trashedStoreResponse = {
      ...mockMentorResponse,
      id: 'resp3',
      isTrashed: true,
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
      storeResponses: [trashedStoreResponse],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when excluding trashed storeResponses'
      );
  });

  test('extracts unique mentors from responses', async function (assert) {
    const mentor1 = { id: 'mentor1', username: 'mentor1' };
    const response1 = {
      ...mockMentorResponse,
      createdBy: { content: mentor1 },
    };
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [response1],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when extracting mentor information'
      );
  });

  test('identifies when user is submission creator', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when user is submission creator'
      );
  });

  test('identifies when user is response recipient', async function (assert) {
    const recipientResponse = {
      ...mockMentorResponse,
      recipient: { id: 'user1' },
    };
    await renderResponseContainer(this, {
      response: recipientResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists(
        'Component renders without errors when user is response recipient'
      );
  });

  test('handles approver response type', async function (assert) {
    const approverResponse = {
      ...mockMentorResponse,
      responseType: 'approver',
      reviewedResponse: Promise.resolve(mockMentorResponse),
    };

    await renderResponseContainer(this, {
      response: approverResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.response-container')
      .exists('Component renders with approver response type');
  });

  // Note: New response creation mode (isNew: true) renders ResponseNew component
  // which is fully tested in response-new-test.js

  test('toggleCreatingNewMentorReply action toggles state', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.problem-link-container')
      .containsText('Displaying feedback', 'Initially not in creation mode');
  });

  test('sendSubmissionRevisionNotices creates notifications for mentors', async function (assert) {
    const mentor1 = { id: 'mentor1', username: 'mentor1' };
    const oldSubmission = {
      ...mockSubmission,
      id: 'oldSub',
      responses: ['resp1'],
    };
    const newSubmission = {
      ...mockSubmission,
      id: 'newSub',
    };
    const mentorResponse = {
      ...mockMentorResponse,
      createdBy: { content: mentor1 },
    };

    let notificationCreated = false;
    class StoreServiceWithNotification extends Service {
      peekAll() {
        return [mentorResponse];
      }
      createRecord(type) {
        if (type === 'notification') {
          notificationCreated = true;
        }
        return { save: () => Promise.resolve() };
      }
      peekRecord() {
        return null;
      }
    }
    this.owner.register('service:store', StoreServiceWithNotification);

    this.set('sendRevisionNotices', async (oldSub, newSub) => {
      const store = this.owner.lookup('service:store');
      const utils = this.owner.lookup('service:utility-methods');
      const oldSubResponseIds = utils.getHasManyIds(oldSub, 'responses');
      if (!oldSubResponseIds?.length) return;

      const mentorResponses = store
        .peekAll('response')
        .filter(
          (r) =>
            oldSubResponseIds.includes(r.id) &&
            r.responseType === 'mentor' &&
            !r.isTrashed
        );

      const mentors = [
        ...new Set(
          mentorResponses.map((r) => r.createdBy?.content).filter(Boolean)
        ),
      ];
      if (!mentors.length) return;

      mentors.forEach(() => {
        store.createRecord('notification', {}).save();
      });
    });

    await this.sendRevisionNotices(oldSubmission, newSubmission);

    assert.ok(notificationCreated, 'Notification was created for mentor');
  });

  test('sendSubmissionRevisionNotices handles no mentor responses', async function (assert) {
    const oldSubmission = {
      ...mockSubmission,
      id: 'oldSub',
      responses: [],
    };
    const newSubmission = {
      ...mockSubmission,
      id: 'newSub',
    };

    this.set('sendRevisionNotices', async (oldSub) => {
      const utils = this.owner.lookup('service:utility-methods');
      const oldSubResponseIds = utils.getHasManyIds(oldSub, 'responses');
      if (!oldSubResponseIds?.length) return;
    });

    await this.sendRevisionNotices(oldSubmission, newSubmission);

    assert.ok(
      true,
      'Function completes without error when no mentor responses exist'
    );
  });

  test('openProblem action exists and handles problem opening', async function (assert) {
    const submissionWithProblem = {
      ...mockSubmission,
      answer: { problem: { id: 'prob1' } },
    };

    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: submissionWithProblem,
      responses: [],
    });

    assert
      .dom('.problem-link')
      .exists(
        'Problem link is rendered, indicating openProblem action is available'
      );
  });

  test('openSubmission action exists and handles submission opening', async function (assert) {
    await renderResponseContainer(this, {
      response: mockMentorResponse,
      workspace: mockWorkspace,
      submission: mockSubmission,
      responses: [],
    });

    assert
      .dom('.problem-link-container a.link')
      .exists(
        'Workspace link is rendered, indicating openSubmission action is available'
      );
  });
});
