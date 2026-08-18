import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module('Integration | Component | home-page', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Capture router navigation.
    this.transitions = [];
    const transitions = this.transitions;
    this.owner.register(
      'service:router',
      class extends Service {
        transitionTo(...args) {
          transitions.push(args);
        }
      }
    );
    this.owner.register(
      'service:utility-methods',
      class extends Service {
        getBelongsToId(record, key) {
          return record ? record[`${key}Id`] : null;
        }
      }
    );

    // Stub Ember Table's yielded block API just enough to render one feedback
    // cell (so the toResponse link is reachable). Yields:
    //   t -> { head, body } ; body(as |b|) -> { row } per row ;
    //   row(as |r|) -> { cell } ; cell -> (cellValue, columnValue, rowValue).
    const reg = (name, tmpl) => {
      this.owner.register(`template:components/${name}`, tmpl);
      this.owner.register(`component:${name}`, templateOnly());
    };
    reg(
      'ember-table',
      hbs`{{yield (hash head=(component 'et-head') body=(component 'et-body'))}}`
    );
    reg('et-head', hbs``);
    reg(
      'et-body',
      hbs`{{#each @rows as |row|}}{{yield (hash row=(component 'et-row' row=row))}}{{/each}}`
    );
    reg('et-row', hbs`{{yield (hash cell=(component 'et-cell' row=@row))}}`);
    reg(
      'et-cell',
      hbs`{{yield @row.label (hash name='Student Submission') @row}}`
    );

    this.set('tableColumns', []);
    this.set('type', 'feedback');
  });

  async function renderComponent(context) {
    return render(hbs`
      <HomePage
        @tableColumns={{this.tableColumns}}
        @details={{this.details}}
        @type={{this.type}}
      />
    `);
  }

  test('renders the dashboard table with a feedback link per row', async function (assert) {
    this.set('details', A([{ label: 'Student A' }]));
    await renderComponent(this);

    assert.dom('.home--container').exists();
    assert.dom('.home--container a').hasText('Student A');
  });

  test('clicking a feedback row with a response navigates to the response', async function (assert) {
    this.set(
      'details',
      A([
        {
          label: 'Student A',
          highestPriorityResponse: { id: 'resp-1', submissionId: 'sub-1' },
        },
      ])
    );
    await renderComponent(this);

    await click('.home--container a');

    assert.deepEqual(this.transitions, [
      ['responses.submission', 'sub-1', { queryParams: { responseId: 'resp-1' } }],
    ]);
  });

  test('clicking a feedback row with no response navigates to the submission', async function (assert) {
    const submission = { id: 'sub-2' };
    this.set(
      'details',
      A([
        {
          label: 'Student B',
          highestPriorityResponse: null,
          highestPrioritySubmission: submission,
        },
      ])
    );
    await renderComponent(this);

    await click('.home--container a');

    assert.deepEqual(this.transitions, [
      ['responses.submission', submission],
    ]);
  });
});
