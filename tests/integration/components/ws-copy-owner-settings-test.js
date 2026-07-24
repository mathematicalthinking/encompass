import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module('Integration | Component | ws-copy-owner-settings', function (hooks) {
  setupRenderingTest(hooks);

  const MODE_INPUTS = {
    groupName: 'mode',
    required: true,
    inputs: [
      { value: 'private', label: 'Private' },
      { value: 'org', label: 'My Org' },
      { value: 'public', label: 'Public' },
    ],
  };

  hooks.beforeEach(function () {
    // current user, seeded as the default owner
    const currentUserRecord = {
      id: 'me',
      get: (key) => (key === 'username' ? 'currentuser' : undefined),
    };
    this.owner.register(
      'service:current-user',
      class extends Service {
        user = currentUserRecord;
      }
    );

    // string-similarity: returns 1 (identical) only for exact-name matches
    this.owner.register(
      'service:string-similarity',
      class extends Service {
        compareTwoStrings(a, b) {
          return a === b ? 1 : 0;
        }
      }
    );

    // RadioGroup stub: a button per option calling @updateValue(value)
    this.owner.register(
      'template:components/ui/radio-group',
      hbs`
        <div class='stub-radio {{@options.groupName}}' data-selected='{{@selectedValue}}'>
          {{#each @options.inputs as |input|}}
            <button type='button' class='opt' data-value='{{input.value}}'
              {{on 'click' (fn @updateValue input.value)}}>{{input.label}}</button>
          {{/each}}
        </div>
      `
    );
    this.owner.register('component:ui/radio-group', templateOnly());

    // selectize stub — a button that adds a record by id via @onItemAdd
    this.owner.register(
      'template:components/selectize-input',
      hbs`<div class='stub-selectize' id='{{@inputId}}'>
        <button type='button' class='pick' {{on 'click' (fn @onItemAdd 'u2' 'item')}}>pick</button>
      </div>`
    );
    this.owner.register('component:selectize-input', templateOnly());

    // new-folderset-form stub — reports name/privacy up
    this.owner.register(
      'template:components/new-folderset-form',
      hbs`<div class='stub-folderset-form'>
        <button type='button' class='set-name' {{on 'click' (fn @onNameChange 'FS Name')}}>name</button>
      </div>`
    );
    this.owner.register('component:new-folderset-form', templateOnly());

    this.owner.register(
      'template:components/ui/error-box',
      hbs`<div class='stub-error'>{{@error}}</div>`
    );
    this.owner.register('component:ui/error-box', templateOnly());
  });

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      newWsOwner: undefined,
      newWsName: undefined,
      newWsMode: undefined,
      newFolderSetOptions: undefined,
      workspace: { get: (k) => (k === 'name' ? 'Original WS' : undefined) },
      modeInputs: MODE_INPUTS,
      folderSets: [],
      existingFolderSet: undefined,
      isCopyingFolders: false,
      proceededWith: undefined,
      backDirections: [],
      onProceed: (...args) => context.set('proceededWith', args),
      onBack: (dir) =>
        context.set('backDirections', [...context.backDirections, dir]),
      ...overrides,
    });
    return render(hbs`
      <WsCopyOwnerSettings
        @newWsOwner={{this.newWsOwner}}
        @newWsName={{this.newWsName}}
        @newWsMode={{this.newWsMode}}
        @newFolderSetOptions={{this.newFolderSetOptions}}
        @workspace={{this.workspace}}
        @modeInputs={{this.modeInputs}}
        @folderSets={{this.folderSets}}
        @existingFolderSet={{this.existingFolderSet}}
        @isCopyingFolders={{this.isCopyingFolders}}
        @onProceed={{this.onProceed}}
        @onBack={{this.onBack}}
      />
    `);
  }

  const nextButton = '.nav-btn-container .primary-button:not(.cancel-button)';

  test('seeds the name and owner defaults for a fresh copy', async function (assert) {
    await renderComponent(this);

    assert.dom('#ws-copy-owner-settings').exists();
    assert
      .dom('input#ws-copy-name')
      .hasValue('Copy of Original WS', 'name defaults from the workspace');
    assert
      .dom('.stub-radio.mode')
      .hasAttribute('data-selected', 'private', 'mode defaults to private');
  });

  test('proceeds with the seeded name, owner, mode and no folder set', async function (assert) {
    await renderComponent(this);

    await click(nextButton);

    const [name, owner, mode, folderSetOptions] = this.proceededWith;
    assert.strictEqual(name, 'Copy of Original WS');
    assert.strictEqual(owner.id, 'me', 'defaults to the current user');
    assert.strictEqual(mode, 'private');
    assert.false(folderSetOptions.doCreateFolderSet);
  });

  test('reports name and mode changes and proceeds with them', async function (assert) {
    await renderComponent(this);

    await fillIn('input#ws-copy-name', 'My Copy');
    await click('.stub-radio.mode .opt[data-value="public"]');
    await click(nextButton);

    const [name, , mode] = this.proceededWith;
    assert.strictEqual(name, 'My Copy');
    assert.strictEqual(mode, 'public');
  });

  test('blocks proceeding and shows an error when the name is blank', async function (assert) {
    await renderComponent(this);

    await fillIn('input#ws-copy-name', '');
    await click(nextButton);

    assert.dom('.stub-error').exists('a validation error is shown');
    assert.strictEqual(this.proceededWith, undefined, 'does not proceed');
  });

  test('reveals the folder-set form when copying folders and choosing Yes', async function (assert) {
    await renderComponent(this, { isCopyingFolders: true });
    assert.dom('.stub-folderset-form').doesNotExist('hidden until Yes');

    await click('input[type="radio"]'); // the "Yes" radio (first one)

    assert.dom('.stub-folderset-form').exists('folder-set form is shown');
  });

  test('Back calls @onBack with -1', async function (assert) {
    await renderComponent(this);

    await click('.cancel-button');

    assert.deepEqual(this.backDirections, [-1]);
  });
});
