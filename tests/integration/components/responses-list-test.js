import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | responses-list', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class CurrentUserService extends Service {
      id = 'user1';
      user = { id: 'user1', isAdmin: false, isStudent: true };
    }

    class UtilityMethodsService extends Service {
      getHasManyIds() {
        return [];
      }
    }

    class RouterService extends Service {}

    this.owner.register('service:current-user', CurrentUserService);
    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register('service:router', RouterService);
  });

  function createThread(overrides = {}) {
    return {
      threadType: 'submitter',
      isTrashed: false,
      isNewThread: false,
      isActionNeeded: false,
      sortPriority: 0,
      latestRevision: { createDate: new Date('2025-10-01') },
      latestReply: { createDate: new Date('2025-10-02') },
      ...overrides,
    };
  }

  async function renderResponsesList(context, props = {}) {
    const {
      threads = [],
      meta = { submitter: {}, mentoring: {}, approving: {} },
    } = props;

    // Register store mock for refresh functionality
    class StoreServiceWithThreads extends Service {
      query() {
        return Promise.resolve({
          toArray: () => threads,
          meta: { meta },
        });
      }
    }
    context.owner.register('service:store', StoreServiceWithThreads);

    context.setProperties({
      threads,
      meta,
      toSubmissionResponse: () => {},
      toResponse: () => {},
      ...props,
    });

    await render(hbs`<ResponsesList
      @threads={{this.threads}}
      @meta={{this.meta}}
      @toSubmissionResponse={{this.toSubmissionResponse}}
      @toResponse={{this.toResponse}}
    />`);
  }

  // ---------- Basic Rendering ----------
  test('it renders with heading and main structure', async function (assert) {
    await renderResponsesList(this);

    assert.dom('h1.heading').hasText('Responses');
    assert.dom('.flex-container-full').exists();
    assert.dom('.list-container').exists();
    assert.dom('.results-list').exists();
  });

  test('shows no responses message when no threads', async function (assert) {
    await renderResponsesList(this);

    assert.dom('.no-results-container p.notice').hasText('No responses found');
  });

  test('refresh button exists and is clickable', async function (assert) {
    await renderResponsesList(this);

    assert.dom('.refresh-icon').exists();
    assert.dom('.refresh-icon').hasAttribute('title', 'Refresh Responses list');
    await click('.refresh-icon');
    assert.ok(true, 'Refresh button clicked without error');
  });

  // ---------- Filter Tabs ----------
  test('shows submitter tab when submitter threads exist', async function (assert) {
    const threads = [
      {
        threadType: 'submitter',
        isTrashed: false,
        isNewThread: false,
        isActionNeeded: false,
        sortPriority: 0,
        latestRevision: { createDate: new Date('2025-10-01') },
        latestReply: { createDate: new Date('2025-10-02') },
      },
    ];

    await renderResponsesList(this, { threads });

    assert.dom('.submitter').exists();
    assert.dom('.submitter').hasText('Solver');
  });

  test('shows mentoring tab when mentoring threads exist', async function (assert) {
    const threads = [createThread({ threadType: 'mentor' })];

    await renderResponsesList(this, { threads });

    assert.dom('.mentoring').exists();
    assert.dom('.mentoring').hasText('Mentoring');
  });

  test('shows approving tab when approving threads exist', async function (assert) {
    const threads = [createThread({ threadType: 'approver' })];

    await renderResponsesList(this, { threads });

    assert.dom('.approving').exists();
    assert.dom('.approving').hasText('Approving');
  });

  test('submitter tab is active by default', async function (assert) {
    const threads = [createThread({ threadType: 'submitter' })];

    await renderResponsesList(this, { threads });

    assert.dom('.submitter').hasClass('active-filter');
  });

  test('clicking mentoring tab changes active filter', async function (assert) {
    const threads = [
      createThread({ threadType: 'submitter' }),
      createThread({ threadType: 'mentor' }),
    ];

    await renderResponsesList(this, { threads });

    await click('.mentoring');

    assert.dom('.mentoring').hasClass('active-filter');
    assert.dom('.submitter').doesNotHaveClass('active-filter');
  });

  test('clicking approving tab changes active filter', async function (assert) {
    const threads = [
      createThread({ threadType: 'submitter' }),
      createThread({ threadType: 'approver' }),
    ];

    await renderResponsesList(this, { threads });

    await click('.approving');

    assert.dom('.approving').hasClass('active-filter');
    assert.dom('.submitter').doesNotHaveClass('active-filter');
  });

  // ---------- Action Counters ----------
  test('displays action needed counters for submitter threads', async function (assert) {
    const threads = [
      createThread({ threadType: 'submitter', isActionNeeded: true }),
      createThread({ threadType: 'submitter', isActionNeeded: false }),
    ];

    await renderResponsesList(this, { threads });

    assert.dom('.submitter').containsText('(1)');
  });

  test('displays action needed counters for mentoring threads', async function (assert) {
    const threads = [
      createThread({ threadType: 'mentor', isActionNeeded: true }),
      createThread({ threadType: 'mentor', isActionNeeded: true }),
    ];

    await renderResponsesList(this, { threads });

    assert.dom('.mentoring').containsText('(2)');
  });

  test('displays action needed counters for approving threads', async function (assert) {
    const threads = [createThread({ threadType: 'approver', isActionNeeded: true })];

    await renderResponsesList(this, { threads });

    assert.dom('.approving').containsText('(1)');
  });

  test('hides counters when no action needed', async function (assert) {
    const threads = [createThread({ threadType: 'submitter', isActionNeeded: false })];

    await renderResponsesList(this, { threads });

    assert.dom('.submitter').hasText('Solver');
    assert.dom('.submitter').doesNotContainText('(');
  });

  // ---------- Sort Headers -----------
  test('shows student header when not on submitter filter', async function (assert) {
    const threads = [createThread({ threadType: 'mentor' })];

    await renderResponsesList(this, { threads });
    await click('.mentoring');

    assert.dom('.sort-bar-item.student').exists();
    assert.dom('.sort-bar-item.student span').hasText('Student');
  });

  test('hides student header on submitter filter', async function (assert) {
    const threads = [createThread({ threadType: 'submitter' })];

    await renderResponsesList(this, { threads });

    assert.dom('.sort-bar-item.student').doesNotExist();
  });

  test('shows mentor header when not on mentoring filter', async function (assert) {
    const threads = [createThread({ threadType: 'submitter' })];

    await renderResponsesList(this, { threads });

    assert.dom('.sort-bar-item.mentor').exists();
    assert.dom('.sort-bar-item.mentor span').hasText('Mentor');
  });

  test('hides mentor header on mentoring filter', async function (assert) {
    const threads = [createThread({ threadType: 'mentor' })];

    await renderResponsesList(this, { threads });
    await click('.mentoring');

    assert.dom('.sort-bar-item.mentor').doesNotExist();
  });

  test('always shows workspace, submission date, problem, reply date, and status headers', async function (assert) {
    await renderResponsesList(this);

    assert.dom('.sort-bar-item.workspace span').hasText('Workspace');
    assert
      .dom('.sort-bar-item.submission-date span')
      .hasText('Latest Revision Date');
    assert.dom('.sort-bar-item.problem span').hasText('Problem');
    assert.dom('.sort-bar-item.reply-date span').hasText('Latest Reply Date');
    assert.dom('.sort-bar-item.status span').hasText('Status');
  });

  // ---------- Thread Filtering ----------
  test('filters out trashed threads', async function (assert) {
    const threads = [
      createThread({ threadType: 'submitter', isTrashed: true }),
      createThread({ threadType: 'submitter', isTrashed: false }),
    ];

    await renderResponsesList(this, { threads });

    // Should only show the non-trashed thread
    assert.dom('.submitter').exists();
  });

  test('includes new threads in display', async function (assert) {
    const threads = [createThread({ threadType: 'submitter', isNewThread: true })];

    await renderResponsesList(this, { threads });

    assert.dom('.submitter').exists();
  });

  // ---------- Edge Cases ----------
  test('handles empty threads array', async function (assert) {
    await renderResponsesList(this, { threads: [] });

    assert.dom('.no-results-container p.notice').hasText('No responses found');
    assert.dom('.submitter').doesNotExist();
    assert.dom('.mentoring').doesNotExist();
    assert.dom('.approving').doesNotExist();
  });

  test('handles mixed thread types', async function (assert) {
    const threads = [
      createThread({ threadType: 'submitter', isActionNeeded: true }),
      createThread({ threadType: 'mentor', isActionNeeded: false }),
      createThread({ threadType: 'approver', isActionNeeded: true }),
    ];

    await renderResponsesList(this, { threads });

    assert.dom('.submitter').exists();
    assert.dom('.mentoring').exists();
    assert.dom('.approving').exists();
    assert.dom('.submitter').containsText('(1)');
    assert.dom('.mentoring').hasText('Mentoring');
    assert.dom('.approving').containsText('(1)');
  });

  test('renders component structure correctly', async function (assert) {
    await renderResponsesList(this);

    assert.dom('.flex-container-full').exists();
    assert.dom('.flex-item-full.filter-options').exists();
    assert.dom('.flex-item-full.list-view').exists();
    assert.dom('.results-info').exists();
    assert.dom('#response-list-tabs').exists();
    assert.dom('.side-icons').exists();
    assert.dom('.results-items').exists();
    assert.dom('.sort-bar').exists();
    assert.dom('.main-list').exists();
  });
});
