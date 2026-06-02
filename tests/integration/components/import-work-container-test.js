import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

class StoreStub extends Service {
  peekRecord(modelName, id) {
    if (modelName === 'problem' && id === 'problem-1') {
      return { id: 'problem-1', title: 'Problem 1' };
    }
    return null;
  }

  async findRecord() {
    throw new Error('record not found');
  }
}

class UtilityMethodsStub extends Service {
  isNonEmptyObject(value) {
    return (
      !!value && typeof value === 'object' && Object.keys(value).length > 0
    );
  }
}

class ErrorHandlingStub extends Service {
  handleErrors() {}
}

class CurrentUserStub extends Service {
  user = { id: 'user-1', username: 'teacher' };
}

class SweetAlertStub extends Service {
  showToast() {}
}

module('Integration | Component | import-work-container', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:store', StoreStub);
    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register('service:error-handling', ErrorHandlingStub);
    this.owner.register('service:current-user', CurrentUserStub);
    this.owner.register('service:currentUser', CurrentUserStub);
    this.owner.register('service:sweet-alert', SweetAlertStub);

    this.owner.register(
      'component:details-list-item',
      class extends Component {}
    );
    this.owner.register(
      'template:components/details-list-item',
      hbs`<li class='details-list-item-stub'></li>`
    );

    const stepTemplates = {
      1: hbs`<div data-test-step='1'></div>`,
      2: hbs`<div data-test-step='2'></div>`,
      3: hbs`<div data-test-step='3'></div>`,
      4: hbs`<div data-test-step='4'></div>`,
      5: hbs`<div data-test-step='5'></div>`,
      6: hbs`<div data-test-step='6'></div>`,
    };

    Object.keys(stepTemplates).forEach((step) => {
      this.owner.register(
        `component:import-work-step${step}`,
        class extends Component {}
      );
      this.owner.register(
        `template:components/import-work-step${step}`,
        stepTemplates[step]
      );
    });

    this.owner.register('component:ui/error-box', class extends Component {});
    this.owner.register(
      'template:components/ui/error-box',
      hbs`<div class='error-box-stub'></div>`
    );
  });

  test('it resets to step 1 when stale resume params point past upload with missing files', async function (assert) {
    this.setProperties({
      model: {
        sections: [],
        folderSets: [],
        problems: [{ id: 'problem-1', title: 'Problem 1' }],
      },
      users: [],
      initialStep: '4',
      initialProblemId: 'problem-1',
      initialUploadedFileIds: 'missing-image-id',
    });

    await render(hbs`
      <ImportWorkContainer
        @model={{this.model}}
        @users={{this.users}}
        @initialStep={{this.initialStep}}
        @initialProblemId={{this.initialProblemId}}
        @initialUploadedFileIds={{this.initialUploadedFileIds}}
      />
    `);
    await settled();

    assert
      .dom("[data-test-step='1']")
      .exists('stale resume without files falls back to step 1');
    assert.dom("[data-test-step='3']").doesNotExist();
    assert.dom("[data-test-step='4']").doesNotExist();
  });
});
