import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';

// The component reads records both by dotted-path .get('a.b') (async
// relationships) and by native access (the template). These mocks support both:
// native nested objects, plus a get() that resolves a dotted path over them.
function getPath(path) {
  return path
    .split('.')
    .reduce((obj, key) => (obj == null ? obj : obj[key]), this);
}

const makeResponse = (o = {}) => ({
  createDate: o.createDate ?? new Date('2024-01-01'),
  isTrashed: o.isTrashed ?? false,
  createdBy: { username: o.mentor ?? 'mentor1' },
  get: getPath,
});

const makeSubmission = (o = {}) => ({
  id: o.id ?? 'sub-1',
  createDate: o.createDate ?? new Date('2024-01-01'),
  createdBy: { username: o.username },
  creator: o.creator ? { username: o.creator } : undefined,
  responses: A(o.responses ?? []),
  get: getPath,
});

const makeWorkspace = (o = {}) => ({
  name: o.name ?? 'My Workspace',
  linkedAssignment: { name: o.assignment, problem: { title: o.problem } },
  createdBy: { username: o.owner },
  submissions: o.submissions ?? [{ id: 'sub-1' }],
  get: getPath,
});

function studentRows() {
  return [
    ...document.querySelectorAll(
      '.summary-container .summary-row:not(.summary-header)'
    ),
  ];
}

module('Integration | Component | summary-list', function (hooks) {
  setupRenderingTest(hooks);

  test('renders the workspace owner, assignment, and problem', async function (assert) {
    this.set('submissions', [makeSubmission({ id: 's1', username: 'alice' })]);
    this.set(
      'workspaces',
      makeWorkspace({ owner: 'prof', assignment: 'HW 1', problem: 'Fractions' })
    );

    await render(
      hbs`<SummaryList @submissions={{this.submissions}} @workspaces={{this.workspaces}} />`
    );

    assert.dom('.summary-header-container').includesText('Workspace Owner: prof');
    assert.dom('.summary-header-container').includesText('HW 1');
    assert.dom('.summary-header-container').includesText('Fractions');
  });

  test('renders one row per student with revision and non-trashed response counts', async function (assert) {
    const alice1 = makeSubmission({
      id: 'a1',
      username: 'alice',
      createDate: new Date('2024-01-01'),
      responses: [
        makeResponse({ createDate: new Date('2024-02-01') }),
        makeResponse({ isTrashed: true }), // must be excluded from the count
      ],
    });
    const alice2 = makeSubmission({
      id: 'a2',
      username: 'alice',
      createDate: new Date('2024-03-01'),
      responses: [],
    });
    const bob = makeSubmission({
      id: 'b1',
      username: 'bob',
      responses: [makeResponse({})],
    });

    this.set('submissions', [alice1, alice2, bob]);
    this.set('workspaces', makeWorkspace({}));

    await render(
      hbs`<SummaryList @submissions={{this.submissions}} @workspaces={{this.workspaces}} />`
    );

    assert.dom('.value.submitter').exists({ count: 2 }, 'one row per student');

    const rows = studentRows();
    // alphabetical: alice first
    assert.dom(rows[0].querySelector('.submitter')).hasText('alice');
    assert
      .dom(rows[0].querySelector('.revisions'))
      .hasText('2', 'alice has two submissions grouped as revisions');
    assert
      .dom(rows[0].querySelector('.mentor-replies'))
      .hasText('1', 'only the non-trashed response is counted');
  });

  test('sorts the student rows alphabetically by username', async function (assert) {
    this.set('submissions', [
      makeSubmission({ id: 'c', username: 'charlie' }),
      makeSubmission({ id: 'a', username: 'alice' }),
      makeSubmission({ id: 'b', username: 'bob' }),
    ]);
    this.set('workspaces', makeWorkspace({}));

    await render(
      hbs`<SummaryList @submissions={{this.submissions}} @workspaces={{this.workspaces}} />`
    );

    const names = studentRows().map((row) =>
      row.querySelector('.submitter').textContent.trim()
    );
    assert.deepEqual(names, ['alice', 'bob', 'charlie']);
  });
});
