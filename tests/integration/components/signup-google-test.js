import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module('Integration | Component | signup-google', function (hooks) {
  setupRenderingTest(hooks);

  function findButtonByText(text) {
    return Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent.trim() === text
    );
  }

  hooks.beforeEach(function () {
    this.user = {
      displayName: 'Test User',
      saveCalled: false,
      save() {
        this.saveCalled = true;
        return Promise.resolve();
      },
    };
    const user = this.user;

    this.owner.register(
      'service:current-user',
      class extends Service {
        user = user;
      }
    );
    this.owner.register(
      'service:error-handling',
      class extends Service {
        getErrors() {
          return [];
        }
        handleErrors() {}
      }
    );

    // Stub the typeahead — buttons that report an org back through @onSelect.
    this.owner.register(
      'template:components/ui/twitter-typeahead',
      hbs`<div class='typeahead-stub'>
        <button type='button' class='pick-new' {{on 'click' (fn @onSelect 'Brand New Org')}}>new</button>
        <button type='button' class='pick-existing' {{on 'click' (fn @onSelect 'Existing Org')}}>existing</button>
      </div>`
    );
    this.owner.register('component:ui/twitter-typeahead', templateOnly());

    this.existingOrg = { name: 'Existing Org' };
    this.set('organizations', A([this.existingOrg]));
  });

  async function renderComponent(context) {
    return render(
      hbs`<SignupGoogle @organizations={{this.organizations}} />`
    );
  }

  test('renders the form with the org typeahead, inputs, terms, and Submit', async function (assert) {
    await renderComponent(this);

    assert.dom('#signup-google').exists();
    assert.dom('.typeahead-stub').exists('org typeahead');
    assert.dom('#location').exists();
    assert.dom('#requestReason').exists();
    assert.dom('#terms').exists();
    assert.ok(findButtonByText('Submit'), 'has a Submit button');
    assert.dom('.info').includesText('Test User', 'greets the current user');
  });

  test('submitting with missing fields shows the missing-credentials error and does not save', async function (assert) {
    await renderComponent(this);

    await click(findButtonByText('Submit'));

    assert.dom('.error-message').includesText('complete all of the fields');
    assert.false(this.user.saveCalled, 'user was not saved');
  });

  test('submitting without agreeing to terms shows the terms error', async function (assert) {
    await renderComponent(this);

    await fillIn('#location', 'NYC, NY');
    await fillIn('#requestReason', 'teaching');
    await click('.pick-new');
    await click(findButtonByText('Submit'));

    assert.dom('.error-message').includesText('accept our Terms and Conditions');
    assert.false(this.user.saveCalled);
  });

  test('submitting a new org name saves it as an organization request', async function (assert) {
    await renderComponent(this);

    await fillIn('#location', 'NYC, NY');
    await fillIn('#requestReason', 'teaching');
    await click('#terms');
    await click('.pick-new');
    await click(findButtonByText('Submit'));

    assert.true(this.user.saveCalled, 'user was saved');
    assert.strictEqual(
      this.user.organizationRequest,
      'Brand New Org',
      'a typed-in org becomes an organizationRequest'
    );
    assert.strictEqual(this.user.location, 'NYC, NY');
    assert.strictEqual(this.user.requestReason, 'teaching');
  });

  test('submitting an existing org name resolves it to the matching record', async function (assert) {
    await renderComponent(this);

    await fillIn('#location', 'NYC, NY');
    await fillIn('#requestReason', 'teaching');
    await click('#terms');
    await click('.pick-existing');
    await click(findButtonByText('Submit'));

    assert.true(this.user.saveCalled);
    assert.strictEqual(
      this.user.organization,
      this.existingOrg,
      'a matching name resolves to the org record'
    );
    assert.strictEqual(
      this.user.organizationRequest,
      undefined,
      'no org request when it matches an existing org'
    );
  });
});
