import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

// Mock SweetAlert service
class MockSweetAlertService extends Service {
  showToast(type, message, position, duration, showConfirmButton, callback) {
    // Mock implementation of showToast
    console.log(
      `MockSweetAlertService: showToast called with type=${type}, message=${message}`
    );
  }
}

module('Integration | Component | problem-list-container', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Register mock SweetAlert service
    this.owner.register('service:sweet-alert', MockSweetAlertService);

    // Set any required properties for the component
    this.setProperties({
      model: { recommendedProblems: [] },
    });
  });

  test('it displays error messages from the error-handling service', async function (assert) {
    const errorHandling = this.owner.lookup('service:error-handling');

    // Inject errors into the service
    errorHandling.handleErrors(
      {
        errors: [{ detail: 'An error occurred' }, { detail: 'Another error' }],
      },
      'problemLoadErrors'
    );

    await render(hbs`<ProblemListContainer @model={{this.model}} />`);
    // Verify the error messages are displayed
    const errors = findAll('.error-message');
    assert.strictEqual(errors.length, 2, 'Displays two error messages');
    assert
      .dom(errors[0])
      .hasText('An error occurred', 'Displays the first error message');
    assert
      .dom(errors[1])
      .hasText('Another error', 'Displays the second error message');
  });

  test('it correctly calls error-handling service to remove errors', async function (assert) {
    const errorHandling = this.owner.lookup('service:error-handling');

    // Inject errors into the service
    errorHandling.handleErrors(
      { errors: [{ detail: 'An error occurred' }] },
      'problemLoadErrors'
    );

    // Render the component
    await render(hbs`<ProblemListContainer @model={{this.model}} />`);

    // Verify the error exists
    assert
      .dom('.error-message')
      .hasText('An error occurred', 'Error is displayed initially');

    // Remove errors
    errorHandling.removeMessages('problemLoadErrors');

    // Trigger a full re-render of the component
    await settled();

    // Verify the error is removed
    assert.dom('.error-message').doesNotExist('Error message is removed');
  });

  test('it creates filters using the input-state service appropriate to not an admin', async function (assert) {
    const inputState = this.owner.lookup('service:input-state');

    await render(hbs`<ProblemListContainer @model={{this.model}} />`);

    // Verify states created for filters
    const filterStates = inputState.states['problem-filter'];
    assert.ok(filterStates, 'Filter states are created');
    assert.strictEqual(
      filterStates.options.length,
      2,
      'Three filter options are created'
    );

    const selectedOption = filterStates.selectedOption;
    assert.strictEqual(
      selectedOption.value,
      'mine',
      'The default selected filter is "mine"'
    );
  });

  test('it applies filters using the input-state service', async function (assert) {
    const inputState = this.owner.lookup('service:input-state');
    const currentUserService = this.owner.lookup('service:current-user');

    // Set the current user in the current-user service
    currentUserService.setUser({
      organization: { id: 'myOrg', get: () => [] },
    });

    // Render the component
    await render(hbs`<ProblemListContainer @model={{this.model}} />`);

    // Update the selection in input-state using setSelection
    inputState.setSelection('problem-filter', 'myOrg');

    // Trigger the fetch to apply the new filter
    await settled();

    const filterBy = inputState.getFilter('problem-filter');

    // Ensure that the filter is applied correctly
    assert.deepEqual(
      filterBy,
      {
        organization: currentUserService.user.organization.id,
        $or: [{ organization: 'myOrg' }],
      },
      'The filter is applied correctly'
    );
  });

  test('it displays the correct results message based on filters', async function (assert) {
    const inputState = this.owner.lookup('service:input-state');
    const errorHandling = this.owner.lookup('service:error-handling');

    // Inject an error into the service
    errorHandling.handleErrors(
      { errors: [{ detail: 'An error occurred' }] },
      'problemLoadErrors'
    );

    // Render the component
    await render(hbs`<ProblemListContainer @model={{this.model}} />`);

    // Verify initial message
    assert
      .dom('.results-message')
      .hasText('0 problems found', 'Displays the correct initial message');

    // Set a valid filter
    inputState.states['problem-filter'].selectedOption = inputState.states[
      'problem-filter'
    ].options.find((option) => option.value === 'myOrg');

    await click('.refresh-icon');

    // Check the updated results message
    assert
      .dom('.results-message')
      .doesNotIncludeText(
        'No results found. Please try expanding your filter criteria.',
        'The error message is no longer displayed after applying a valid filter'
      );
  });
});
