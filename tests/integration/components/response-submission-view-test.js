import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

const createServiceMock = () => class extends Service {};

module('Integration | Component | response-submission-view', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class CurrentUserService extends Service {
      id = 'user1';
      user = { id: 'user1', username: 'testuser' };
    }
    class StoreService extends Service {
      queryRecord() {
        return Promise.resolve(null);
      }
    }
    this.owner.register('service:current-user', CurrentUserService);
    this.owner.register('service:utility-methods', createServiceMock());
    this.owner.register('service:store', StoreService);
  });

  // --- Setup & Mocks ---
  async function renderSubmissionView(context, props = {}) {
    const submission = {
      createDate: new Date('2025-10-27'),
      shortAnswer: 'Brief answer',
      longAnswer: 'Detailed explanation',
      answer: {
        answer: 'Answer text',
        explanation: 'Explanation text',
      },
      creator: { safeName: 'Test Student' },
      student: 'Test Student',
    };

    const workspace = { name: 'Test Workspace' };

    context.setProperties({
      submission,
      workspace,
      response: null,
      wsResponses: [],
      studentSubmissions: [],
      onSubChange: () => {},
      sendRevisionNotices: () => {},
      isParentWorkspace: false,
      ...props,
    });

    await render(hbs`<ResponseSubmissionView
      @submission={{this.submission}}
      @workspace={{this.workspace}}
      @response={{this.response}}
      @wsResponses={{this.wsResponses}}
      @studentSubmissions={{this.studentSubmissions}}
      @onSubChange={{this.onSubChange}}
      @sendRevisionNotices={{this.sendRevisionNotices}}
      @isParentWorkspace={{this.isParentWorkspace}}
    />`);
  }

  // --- Basic Rendering ---
  test('renders submission with student name and date', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-container').exists();
    assert.dom('.subimission-header-info p').hasText('Test Student');
    assert.dom('.submission-date').exists();
  });

  test('displays brief summary section', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-content-container.short').exists();
    assert.dom('.submission-content-header').includesText('Brief Summary');
  });

  test('displays explanation section', async function (assert) {
    await renderSubmissionView(this, {});

    assert
      .dom('.submission-content-container .submission-header')
      .includesText('Explanation');
  });

  // --- Content Display ---
  test('displays answer.answer when available', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-content-short').includesText('Answer text');
  });

  test('falls back to shortAnswer when answer.answer is not available', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      shortAnswer: 'Brief answer',
      answer: { answer: null },
      creator: { safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, { submission });

    assert.dom('.submission-content-short').includesText('Brief answer');
  });

  test('displays answer.explanation when available', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-content-long').includesText('Explanation text');
  });

  test('displays longAnswer when available', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-content-long').includesText('Detailed explanation');
  });

  // --- Toggle Functionality ---
  test('toggles brief summary expansion', async function (assert) {
    await renderSubmissionView(this, {});

    assert
      .dom('.submission-content-short')
      .exists('Brief summary should be expanded by default');
    await click('.submission-content-header');

    assert
      .dom('.submission-content-short')
      .doesNotExist('Brief summary should collapse');
  });

  test('toggles explanation expansion', async function (assert) {
    await renderSubmissionView(this, {});

    assert
      .dom('.submission-content-long')
      .exists('Explanation should be expanded by default');

    const headers = this.element.querySelectorAll('.submission-header');
    await click(headers[0]);

    assert
      .dom('.submission-content-long')
      .doesNotExist('Explanation should collapse');
  });

  // --- Image Handling ---
  test('displays additional image when explanationImage exists', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      answer: {
        answer: 'Answer text',
        explanation: 'Explanation text',
        explanationImage: { imageData: 'data:image/png;base64,test' },
      },
      creator: { safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, { submission });

    assert.dom('.submission-content-container.images').exists();
    assert
      .dom('.submission-content-container.images .submission-header')
      .includesText('Additional Image');
  });

  test('toggles additional image expansion', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      answer: {
        answer: 'Answer text',
        explanation: 'Explanation text',
        explanationImage: { imageData: 'data:image/png;base64,test' },
      },
      creator: { safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, { submission });

    assert
      .dom('.response-submission-images')
      .doesNotExist('Image should be collapsed by default');

    await click('.submission-content-container.images .submission-header');

    assert.dom('.response-submission-images').exists('Image should expand');
  });

  test('displays uploaded image when uploadedFile exists', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      uploadedFile: { savedFileName: 'test.png' },
      creator: { safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, { submission });

    assert.dom('.submission-content-container.images').exists();
    assert
      .dom('.submission-content-container.images .submission-header')
      .includesText('Uploaded Image');
  });

  test('toggles uploaded image expansion', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      uploadedFile: { savedFileName: 'test.png' },
      creator: { safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, { submission });

    assert
      .dom('#submission_images')
      .doesNotExist('Uploaded image should be collapsed by default');

    await click('.submission-content-container.images .submission-header');

    assert.dom('#submission_images').exists('Uploaded image should expand');
  });

  // --- Permission/Authorization ---
  test('shows revise button when user can revise', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      creator: { studentId: 'user1', safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, {
      submission,
      isParentWorkspace: false,
    });

    assert.dom('[data-test="submitter-revise"]').exists();
    assert.dom('[data-test="submitter-revise"]').includesText('Revise');
  });

  test('hides revise button in parent workspace', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      creator: { studentId: 'user1', safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, {
      submission,
      isParentWorkspace: true,
    });

    assert.dom('[data-test="submitter-revise"]').doesNotExist();
  });

  test('hides revise button when not own submission', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      creator: {
        studentId: 'different-user',
        safeName: 'Other Student',
      },
      student: 'Other Student',
    };

    await renderSubmissionView(this, {
      submission,
      isParentWorkspace: false,
    });

    assert.dom('[data-test="submitter-revise"]').doesNotExist();
  });

  // --- Edge Cases ---
  test('renders without errors when submission is null', async function (assert) {
    this.set('submission', null);

    await render(hbs`<ResponseSubmissionView
      @submission={{this.submission}}
      @workspace={{this.workspace}}
    />`);

    assert.dom('.submission-container').doesNotExist();
  });

  test('renders without errors when workspace is null', async function (assert) {
    await renderSubmissionView(this, {
      workspace: null,
    });

    assert.dom('.submission-container').exists();
  });

  test('handles submission without answer object', async function (assert) {
    const submission = {
      createDate: new Date('2025-10-27'),
      shortAnswer: 'Brief answer',
      answer: null,
      creator: { safeName: 'Test Student' },
      student: 'Test Student',
    };

    await renderSubmissionView(this, { submission });

    assert.dom('.submission-container').exists();
    assert.dom('.submission-content-short').includesText('Brief answer');
  });

  test('handles submission without uploadedFile', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-container').exists();
    assert.dom('#submission_images').doesNotExist();
  });

  test('handles submission without explanationImage', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-container').exists();
    assert.dom('.response-submission-images').doesNotExist();
  });

  test('formats date correctly', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-date').includesText('October');
    assert.dom('.submission-date').includesText('2025');
  });

  test('chevron icon changes on expansion', async function (assert) {
    await renderSubmissionView(this, {});

    assert.dom('.submission-content-header i').hasClass('fa-chevron-down');

    await click('.submission-content-header');

    assert.dom('.submission-content-header i').hasClass('fa-chevron-left');
  });

  test('all sections collapsed independently', async function (assert) {
    await renderSubmissionView(this, {});

    await click('.submission-content-header');
    const headers = this.element.querySelectorAll('.submission-header');
    await click(headers[0]);

    assert.dom('.submission-content-short').doesNotExist();
    assert.dom('.submission-content-long').doesNotExist();
  });
});
