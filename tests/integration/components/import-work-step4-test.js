import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

const MONGO_ID = '507f1f77bcf86cd799439011';

class UtilityMethodsStub extends Service {
  isValidMongoId(value) {
    return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
  }
}

class SweetAlertStub extends Service {
  toastCalls = [];

  showToast(...args) {
    this.toastCalls.push(args);
  }
}

class StudentMatchingAnswerStub extends Component {
  get isStub() {
    return true;
  }
}

class ErrorBoxStub extends Component {
  get isStub() {
    return true;
  }
}

module('Integration | Component | import-work-step4', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register('service:sweet-alert', SweetAlertStub);

    this.owner.register(
      'component:student-matching-answer',
      StudentMatchingAnswerStub
    );
    this.owner.register(
      'template:components/student-matching-answer',
      hbs`
        <div class='student-matching-answer-stub' data-answer-id={{@answer.id}}>
          <input
            class='student-match-input'
            id='select-add-student{{@answer.explanationImage.id}}'
            value={{@answer.seedSelectValue}}
          />
        </div>
      `
    );

    this.owner.register('component:ui/error-box', ErrorBoxStub);
    this.owner.register(
      'template:components/ui/error-box',
      hbs`
        <div class='error-box-stub'>
          <span class='error-text'>{{@error}}</span>
          <button
            type='button'
            class='dismiss-error'
            {{on 'click' @resetError}}
          >
            Dismiss
          </button>
        </div>
      `
    );

    this.defaultAnswer = {
      id: 'answer-1',
      explanationImage: {
        id: 'img-1',
        imageData: 'data:image/png;base64,AAA',
        fileNameDisplay: 'work-1.png',
      },
      students: [],
      studentNames: [],
      seedSelectValue: '',
    };
  });

  async function renderComponent(context, overrides = {}) {
    const answers = overrides.answers || [context.defaultAnswer];
    const studentMap = overrides.studentMap || {
      [MONGO_ID]: { id: MONGO_ID, username: 'existing_student' },
    };

    context.setProperties({
      selectedProblem: { id: 'problem-1', title: 'Linear Functions' },
      selectedSection: null,
      selectedValue: false,
      uploadedFileIdsParam: 'img-1,img-2',
      answers,
      studentMap,
      isFetchingSectionStudents: false,
      proceedCount: 0,
      backDirections: [],
      goToSteps: [],
      refreshCount: 0,
      onProceed: () => {
        context.proceedCount += 1;
      },
      onBack: (direction) => {
        context.backDirections = [...context.backDirections, direction];
      },
      goToStep: (stepValue) => {
        context.goToSteps = [...context.goToSteps, stepValue];
      },
      onRefreshStudents: () => {
        context.refreshCount += 1;
      },
      ...overrides,
    });

    await render(hbs`
      <ImportWorkStep4
        @answers={{this.answers}}
        @selectedProblem={{this.selectedProblem}}
        @studentMap={{this.studentMap}}
        @selectedSection={{this.selectedSection}}
        @selectedValue={{this.selectedValue}}
        @uploadedFileIdsParam={{this.uploadedFileIdsParam}}
        @onBack={{this.onBack}}
        @onProceed={{this.onProceed}}
        @goToStep={{this.goToStep}}
        @onRefreshStudents={{this.onRefreshStudents}}
        @isFetchingSectionStudents={{this.isFetchingSectionStudents}}
      />
    `);
  }

  test('it renders class roster details when a class is selected', async function (assert) {
    await renderComponent(this, {
      selectedSection: { id: 'section-1', name: 'Algebra 1' },
      studentMap: {
        [MONGO_ID]: { id: MONGO_ID, username: 'amy_student' },
      },
    });

    assert.dom('.section-name').hasText('Class: Algebra 1');
    assert.dom('.student-list').includesText('amy_student');
    assert
      .dom('.primary-button.cancel-button')
      .includesText('Refresh Students');
  });

  test('it shows no-class guidance when class mode is enabled but no class is selected', async function (assert) {
    await renderComponent(this, {
      selectedValue: true,
      selectedSection: null,
    });

    assert
      .dom('.sub-input-label')
      .includesText('No class is selected right now');
  });

  test('it calls refresh callback from the refresh students button', async function (assert) {
    await renderComponent(this, {
      selectedSection: { id: 'section-1', name: 'Algebra 1' },
    });

    await click('.primary-button.cancel-button');

    assert.strictEqual(this.refreshCount, 1, 'refresh callback is invoked');
  });

  test('it calls onBack with -1 from Back button', async function (assert) {
    await renderComponent(this);

    await click('.nav-btn-container:last-of-type .cancel-button');

    assert.deepEqual(this.backDirections, [-1], 'back callback receives -1');
  });

  test('it blocks proceed and shows error/toast when matching is incomplete', async function (assert) {
    await renderComponent(this, {
      answers: [
        {
          ...this.defaultAnswer,
          seedSelectValue: '',
          students: [],
          studentNames: [],
        },
      ],
    });

    await click(
      '.nav-btn-container:last-of-type .primary-button:not(.cancel-button)'
    );

    const alertService = this.owner.lookup('service:sweet-alert');

    assert.strictEqual(this.proceedCount, 0, 'onProceed is not called');
    assert.deepEqual(this.goToSteps, [], 'goToStep is not called');
    assert.strictEqual(
      alertService.toastCalls.length,
      1,
      'toast is shown once'
    );
    assert.strictEqual(
      alertService.toastCalls[0][1],
      'Please match at least one student/name for each submission',
      'toast message matches expected copy'
    );
    assert.dom('.error-box-stub').exists('error box is displayed');
  });

  test('it dismisses matching error via Ui::ErrorBox reset callback', async function (assert) {
    await renderComponent(this, {
      answers: [
        {
          ...this.defaultAnswer,
          seedSelectValue: '',
        },
      ],
    });

    await click(
      '.nav-btn-container:last-of-type .primary-button:not(.cancel-button)'
    );
    assert.dom('.error-box-stub').exists();

    await click('.dismiss-error');
    assert.dom('.error-box-stub').doesNotExist();
  });

  test('it proceeds and advances to step 5 when a plain-text match is present', async function (assert) {
    const answer = {
      ...this.defaultAnswer,
      seedSelectValue: 'Typed Student',
    };

    await renderComponent(this, {
      answers: [answer],
    });

    await click(
      '.nav-btn-container:last-of-type .primary-button:not(.cancel-button)'
    );

    assert.strictEqual(this.proceedCount, 1, 'onProceed is called once');
    assert.deepEqual(this.goToSteps, [5], 'flow advances to step 5');
    assert.deepEqual(
      answer.studentNames,
      ['Typed Student'],
      'answer receives typed student name during sync'
    );
    assert.dom('.error-box-stub').doesNotExist();
  });

  test('it maps mongo id values to selected students during sync', async function (assert) {
    const answer = {
      ...this.defaultAnswer,
      seedSelectValue: MONGO_ID,
    };
    const selectedStudent = { id: MONGO_ID, username: 'existing_student' };

    await renderComponent(this, {
      answers: [answer],
      studentMap: {
        [MONGO_ID]: selectedStudent,
      },
    });

    await click(
      '.nav-btn-container:last-of-type .primary-button:not(.cancel-button)'
    );

    assert.strictEqual(this.proceedCount, 1);
    assert.strictEqual(
      answer.students.length,
      1,
      'student is mapped to answer'
    );
    assert.strictEqual(
      answer.students[0],
      selectedStudent,
      'mapped student object comes from studentMap'
    );
    assert.deepEqual(answer.studentNames, [], 'no plain-text names remain');
  });
});
