import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | user-list', function (hooks) {
  setupRenderingTest(hooks);

  // Instead of repeating long objects in each test we use buildUser with overrides.
  const buildUser = (overrides = {}) => {
    const base = {
      id: 'u',
      username: 'user',
      isTrashed: false,
      isAuthorized: true,
      accountType: 'S',
      organization: { id: 'org1', name: '21PSTEM' },
      createDate: '2025-01-01T00:00:00Z',
      sections: [],
      createdBy: { id: 'u' },
    };
    return { ...base, ...overrides };
  };

  const buildCurrentUser = (overrides = {}) => {
    const base = {
      id: 'current',
      username: 'current-user',
      isTeacher: false,
      isAdmin: false,
      isPdAdmin: false,
      organization: { id: 'org1', name: '21PSTEM' },
      sections: [],
    };
    return { ...base, ...overrides };
  };

  // Shorthand helpers for common account types
  const adminUser = (overrides = {}) => buildUser({ accountType: 'A', ...overrides });
  const pdUser = (overrides = {}) => buildUser({ accountType: 'P', ...overrides });
  const teacherUser = (overrides = {}) => buildUser({ accountType: 'T', ...overrides });
  const studentUser = (overrides = {}) => buildUser({ accountType: 'S', ...overrides });
  const trashedUser = (overrides = {}) => buildUser({ isTrashed: true, isAuthorized: false, ...overrides });

  // Render helper
  // Accepts the small bits of test data and mounts the component. Tests
  // should call this instead of manually setting 'this.set(...)'
  async function renderUserList(context, { users = [], currentUser = {}, trashedUsers } = {}) {
    context.set('users', users);
    context.set('currentUser', currentUser);
    if (trashedUsers !== undefined) {
      context.set('trashedUsers', trashedUsers);
    }
    await render(hbs`<UserList @users={{this.users}} @currentUser={{this.currentUser}} @trashedUsers={{this.trashedUsers}} />`);
  }

  // --- Tests ---

  // This verifies the component renders and that the primary heading and
  // Create New link are present.
  test('renders header and create link', async function (assert) {
    await renderUserList(this, { users: [], currentUser: buildCurrentUser() });
    assert.dom('h1').hasText('Users');
    assert.dom('#new-user-link').exists('Create New User link is present');
  });

  test('admin view shows admin and pd lists and excludes trashed admins', async function (assert) {
    const users = [
      adminUser({ id: 'a1', username: 'admin-1' }),
      pdUser({ id: 'p1', username: 'pd-1' }),
      trashedUser({ id: 'a2', username: 'trashed-admin' }),
    ];
    await renderUserList(this, {
      users,
      currentUser: buildCurrentUser({ id: 'me', username: 'admin-me', isAdmin: true }),
    });
    // headings and visible users
    assert.dom(this.element).includesText('Administrators');
    assert.dom(this.element).includesText('Pd Admins');
    assert.dom(this.element).includesText('admin-1');
    assert.dom(this.element).includesText('pd-1');

    // trashed admin should not appear
    assert.notOk(this.element.textContent.includes('trashed-admin'), 'trashed admins excluded from admin lists');
  });

 // pd admin sees only users from their organization in unauth list
  test('waiting for authorization list shows unauth users and pd admins', async function (assert) {
    const users = [
      buildUser({ id: 'u1', username: 'unauth-same-org', isAuthorized: false, isTrashed: false, organization: { id: 'org1', name: 'Acme' } }),
      buildUser({ id: 'u2', username: 'unauth-other-org', isAuthorized: false, isTrashed: false, organization: { id: 'org2', name: 'OtherCo' } }),
    ];
    await renderUserList(this, {
      users,
      currentUser: buildCurrentUser({ id: 'me', username: 'pd-admin', isPdAdmin: true, organization: { id: 'org1', name: 'Acme' } }),
    });
    assert.dom(this.element).includesText('Waiting for Authorization');
    assert.dom(this.element).includesText('unauth-same-org');
    assert.notOk(this.element.textContent.includes('unauth-other-org'), 'pd admin should not see unauth users from other orgs');
  });

  // Teacher's view

  // When the current user is a teacher we expect several groups to show up
  // (their own account, students they teach, users they created, and org peers)
  test('teacher sees your account, students in your classes, users you have created, and org users', async function (assert) {
    const users = [
      teacherUser({ id: 'u1', username: 'teacher1', sections: [{ role: 'teacher', sectionId: 'sec-1' }], createdBy: { id: 'u1' } }),
      studentUser({ id: 'u2', username: 'student1', sections: [{ role: 'student', sectionId: 'sec-1' }], createdBy: { id: 'other' } }),
      teacherUser({ id: 'u3', username: 'created-user', sections: [], createdBy: { id: 'u1' } }),
      pdUser({ id: 'u4', username: 'org-colleague', accountType: 'P', organization: { id: 'org1', name: '21PSTEM' } }),
    ];

    await renderUserList(this, {
      users,
      currentUser: buildCurrentUser({ id: 'u1', username: 'teacher1', isTeacher: true, sections: [{ role: 'teacher', sectionId: 'sec-1' }] }),
    });

    // Titles
    assert.dom(this.element).includesText('Your account');
    assert.dom(this.element).includesText('Students in your Classes');
    assert.dom(this.element).includesText('Users you have created');
    assert.dom(this.element).includesText('Users in 21PSTEM');

    // Content
    assert.dom(this.element).includesText('student1');
    assert.dom(this.element).includesText('created-user');
    assert.dom(this.element).includesText('org-colleague');
  });

  // PD admins should only see users that belong to their organization. We
  // assert that same-org users are visible and cross-org users are hidden.
  test('pd admin sees only users from their organization', async function (assert) {
    const users = [
      teacherUser({ id: 'a1', username: 'same-org-user', organization: { id: 'org1', name: 'Acme' } }),
      teacherUser({ id: 'b1', username: 'other-org-user', organization: { id: 'org2', name: 'OtherCo' } }),
      pdUser({ id: 'me', username: 'pd-admin', organization: { id: 'org1', name: 'Acme' } }),
    ];
    await renderUserList(this, {
      users,
      currentUser: buildCurrentUser({ id: 'me', username: 'pd-admin', isPdAdmin: true, organization: { id: 'org1', name: 'Acme' } }),
    });
    assert.dom(this.element).includesText('same-org-user');
    assert.notOk(this.element.textContent.includes('other-org-user'));
  });

  // sorting by create date, test checkes the actual DOM order
  test('sortByCreateDateDesc renders newer users before older users', async function (assert) {
    const users = [
      buildUser({ id: 'old', username: 'older', createDate: '2025-01-01T00:00:00Z' }),
      buildUser({ id: 'new', username: 'newer', createDate: '2025-12-01T00:00:00Z' }),
      buildUser({ id: 'mid', username: 'mid',   createDate: '2025-06-01T00:00:00Z' }),
    ];

    await renderUserList(this, {
      users,
      currentUser: buildCurrentUser({ id: 'viewer', username: 'viewer' }),
    });

    let listItems = this.element.querySelectorAll('nav.list-box li');
    let usernames = [];

    for (let el of listItems) {
      let name = el.textContent.trim();
      if (['newer', 'mid', 'older'].includes(name)) {
        usernames.push(name);
      }
    }

    // We use deepEqual here because 'equal' would only check object identity.
    // deepEqual compares the contents of the two arrays, so it passes if the
    // DOM-produced list has the same values in the same order as expected.
    assert.deepEqual(usernames, ['newer', 'mid', 'older'], 'users are rendered newest to oldest');
  });

  // Defensive: rendering with an empty users array should not crash and shows the main UI.
  test('renders safely with empty users array', async function (assert) {
    await renderUserList(this, { users: [], currentUser: buildCurrentUser() });
    assert.dom('h1').hasText('Users', 'renders main heading when users is empty');
  });

  // Defensive: rendering when currentUser is missing optional fields should not throw
  test('renders safely when currentUser is missing optional fields', async function (assert) {
    await renderUserList(this, { users: [buildUser({ id: 'u1', username: 'user1' })], currentUser: {} });
    assert.dom('h1').hasText('Users', 'component renders even if currentUser lacks expected fields');
  });

  // Admins can toggle visibility of trashed/deleted users.
  test('admin can toggle deleted users visibility', async function (assert) {
    const users = [adminUser({ id: 'u1', username: 'admin1' })];
    const trashedUsers = [trashedUser({ id: 't1', username: 'trashed-user' })];

    await renderUserList(this, {
      users,
      currentUser: buildCurrentUser({ id: 'u1', username: 'admin1', isAdmin: true }),
      trashedUsers,
    });

    // closed by default
    assert.dom('.toggle-button').hasText('Show Deleted Users');
    assert.dom(this.element).doesNotIncludeText('trashed-user');

    // open
    await click('.toggle-button');
    assert.dom('.toggle-button').hasText('Hide Deleted Users');
    assert.dom(this.element).includesText('trashed-user');

    // closed again
    await click('.toggle-button');
    assert.dom('.toggle-button').hasText('Show Deleted Users');
    assert.dom(this.element).doesNotIncludeText('trashed-user');
  });

});