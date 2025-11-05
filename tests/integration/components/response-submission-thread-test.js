import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module(
  'Integration | Component | response-submission-thread',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.owner.register(
        'service:utility-methods',
        class {
          getBelongsToId(obj, prop) {
            return obj?.[prop]?.id || null;
          }
        }
      );

      this.owner.register(
        'service:navigation',
        class extends Service {
          toResponse() {}
          toResponseSubmission() {}
        }
      );
    });

    function createThread(overrides = {}) {
      return {
        studentDisplay: 'Test Student',
        workspaceName: 'Test Workspace',
        problemTitle: 'Test Problem',
        highestPriorityStatus: 'upToDate',
        latestRevision: { createDate: new Date('2025-10-31') },
        latestReply: { createDate: new Date('2025-10-31') },
        mentors: [],
        newNtfCount: 0,
        hasUnreadReply: false,
        ...overrides,
      };
    }

    // ---------- Basic Rendering ----------

    test('it renders basic thread information', async function (assert) {
      this.set('thread', createThread());
      this.set('showStudent', true);
      this.set('showMentor', false);

      await render(hbs`
      <ResponseSubmissionThread
        @thread={{this.thread}}
        @showStudent={{this.showStudent}}
        @showMentor={{this.showMentor}}
      />
    `);

      assert.dom('.item-container').exists();
      assert.dom('.student').containsText('Test Student');
      assert.dom('.workspace').containsText('Test Workspace');
      assert.dom('.problem').containsText('Test Problem');
    });

    // ---------- Status Display ----------

    test('it displays status with correct color', async function (assert) {
      this.set('thread', createThread({ highestPriorityStatus: 'upToDate' }));

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.status svg circle').hasAttribute('fill', '#35A853');
      assert.dom('.status-text').containsText('Up To Date');
    });

    // ---------- Column Visibility ----------

    test('it shows student column when showStudent is true', async function (assert) {
      this.set('thread', createThread());
      this.set('showStudent', true);

      await render(hbs`
      <ResponseSubmissionThread
        @thread={{this.thread}}
        @showStudent={{this.showStudent}}
      />
    `);

      assert.dom('.student').exists();
    });

    test('it hides student column when showStudent is false', async function (assert) {
      this.set('thread', createThread());
      this.set('showStudent', false);

      await render(hbs`
      <ResponseSubmissionThread
        @thread={{this.thread}}
        @showStudent={{this.showStudent}}
      />
    `);

      assert.dom('.student').doesNotExist();
    });

    test('it shows mentor column when showMentor is true', async function (assert) {
      this.set(
        'thread',
        createThread({
          mentors: [{ displayName: 'Test Mentor' }],
        })
      );
      this.set('showMentor', true);

      await render(hbs`
      <ResponseSubmissionThread
        @thread={{this.thread}}
        @showMentor={{this.showMentor}}
      />
    `);

      assert.dom('.mentor').exists();
      assert.dom('.mentor').containsText('Test Mentor');
    });

    test('it hides mentor column when showMentor is false', async function (assert) {
      this.set('thread', createThread());
      this.set('showMentor', false);

      await render(hbs`
      <ResponseSubmissionThread
        @thread={{this.thread}}
        @showMentor={{this.showMentor}}
      />
    `);

      assert.dom('.mentor').doesNotExist();
    });

    // ---------- Edge Cases ----------

    test('it displays N/A when no latest reply', async function (assert) {
      this.set('thread', createThread({ latestReply: null }));

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.reply-date').containsText('N/A');
    });

    // ---------- Notification Bell ----------

    test('it displays notification bell when newNtfCount exists', async function (assert) {
      this.set('thread', createThread({ newNtfCount: 3 }));

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.status i.fa-bell').exists();
      assert
        .dom('.status i.fa-bell')
        .hasAttribute('title', '3 New Notifications');
    });

    test('it hides notification bell when newNtfCount is 0', async function (assert) {
      this.set('thread', createThread({ newNtfCount: 0 }));

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.status i.fa-bell').doesNotExist();
    });

    // ---------- Counter Badges ----------

    test('it displays counter badge for multiple items', async function (assert) {
      this.set(
        'thread',
        createThread({
          highestPriorityStatus: 'hasDraft',
          draftResponses: [{}, {}],
        })
      );

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.status-text').containsText('Unfinished Draft (2)');
    });

    test('it does not display counter for single item', async function (assert) {
      this.set(
        'thread',
        createThread({
          highestPriorityStatus: 'hasDraft',
          draftResponses: [{}],
        })
      );

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.status-text').containsText('Unfinished Draft');
      assert.dom('.status-text').doesNotContainText('(1)');
    });

    // ---------- CSS Classes ----------

    test('it adds has-unread-reply class when thread has unread reply', async function (assert) {
      this.set('thread', createThread({ hasUnreadReply: true }));

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.item-container').hasClass('has-unread-reply');
    });

    test('it does not add has-unread-reply class when no unread reply', async function (assert) {
      this.set('thread', createThread({ hasUnreadReply: false }));

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      assert.dom('.item-container').doesNotHaveClass('has-unread-reply');
    });

    // ---------- Date Formatting ----------

    test('it formats dates using format-date helper', async function (assert) {
      const testDate = new Date('2025-10-31T10:30:00');
      this.set(
        'thread',
        createThread({
          latestRevision: { createDate: testDate },
          latestReply: { createDate: testDate },
        })
      );

      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      // format-date helper with relative time (true) should show "X days/months ago"
      const submissionText = this.element
        .querySelector('.submission-date span')
        .textContent.trim();

      // If @format-date was used instead of format-date, it would show undefined or empty
      const hasRelativeTime =
        submissionText.includes('ago') || submissionText.includes('day');
      assert.ok(
        hasRelativeTime,
        `Date should be formatted with relative time using format-date helper. Got: "${submissionText}"`
      );
    });

    // ---------- Navigation ----------

    test('it calls navigation action when clicked', async function (assert) {
      let navigationCalled = false;

      this.owner.register(
        'service:navigation',
        class extends Service {
          toResponseSubmission() {
            navigationCalled = true;
          }
        }
      );

      this.set('thread', createThread());
      await render(hbs`<ResponseSubmissionThread @thread={{this.thread}} />`);

      await click('.item-container');
      assert.ok(navigationCalled, 'Navigation action was called');
    });
  }
);
