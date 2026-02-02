import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';
import Service from '@ember/service';

module(
  'Integration | Component | submission-viewer-list-item',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      // Create a stub for the sweet-alert service
      this.owner.register(
        'service:sweet-alert',
        class extends Service {
          showModal() {
            return Promise.resolve({ value: false });
          }
          showToast() {
            return Promise.resolve({ value: false });
          }
        }
      );

      // Create a mock answer object
      this.set(
        'answer',
        EmberObject.create({
          id: 'answer-1',
          student: 'John Doe',
          explanation: 'This is my explanation for the problem.',
          isTrashed: false,
          isVmt: false,
          createDate: new Date('2024-01-15'),
          section: EmberObject.create({ name: 'Section A' }),
          save: function () {
            return Promise.resolve(this);
          },
        })
      );

      this.set('selectedMap', {});
      this.set('threads', {});
      this.set('onSelect', () => {});
    });

    // =========================================
    // Basic Rendering Tests
    // =========================================

    test('it renders the component', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert.dom('.item-container').exists('renders item container');
    });

    test('it displays the student name', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.student')
        .hasText('John Doe', 'displays student name');
    });

    test('it displays the explanation for non-VMT answers', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.explanation')
        .containsText('This is my explanation', 'displays explanation');
    });

    test('it displays the section name', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.section')
        .hasText('Section A', 'displays section name');
    });

    test('it displays N/A when section name is missing', async function (assert) {
      this.set('answer.section', EmberObject.create({ name: null }));

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.section')
        .hasText('N/A', 'displays N/A for missing section');
    });

    test('it displays the create date', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.createDate span')
        .exists('displays create date');
    });

    // =========================================
    // Checkbox / Selection Tests
    // =========================================

    test('checkbox is unchecked when answer is not in selectedMap', async function (assert) {
      this.set('selectedMap', {});

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('input[type="checkbox"]')
        .isNotChecked('checkbox is unchecked');
    });

    test('checkbox is checked when answer is in selectedMap', async function (assert) {
      this.set('selectedMap', { 'answer-1': true });

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert.dom('input[type="checkbox"]').isChecked('checkbox is checked');
    });

    test('clicking checkbox calls onSelect with answer and current checked state', async function (assert) {
      assert.expect(2);

      this.set('selectedMap', { 'answer-1': true });
      this.set('onSelect', (answer, wasChecked) => {
        assert.strictEqual(answer.id, 'answer-1', 'receives correct answer');
        assert.true(wasChecked, 'receives checked state');
      });

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('input[type="checkbox"]');
    });

    // =========================================
    // Revision Count Tests
    // =========================================

    test('displays revision count of 0 when no threads', async function (assert) {
      this.set('threads', {});

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.revisions')
        .hasText('0', 'displays 0 revisions');
    });

    test('displays correct revision count from threads', async function (assert) {
      this.set('threads', {
        'John Doe': ['rev1', 'rev2', 'rev3'],
      });

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.revisions')
        .hasText('3', 'displays correct revision count');
    });

    test('displays 0 when student not in threads', async function (assert) {
      this.set('threads', {
        'Other Student': ['rev1', 'rev2'],
      });

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.revisions')
        .hasText('0', 'displays 0 for missing student');
    });

    // =========================================
    // Trashed State Tests
    // =========================================

    test('adds trashed class when answer is trashed', async function (assert) {
      this.set('answer.isTrashed', true);

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.student')
        .hasClass('trashed', 'has trashed class');
    });

    test('does not have trashed class when answer is not trashed', async function (assert) {
      this.set('answer.isTrashed', false);

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.student')
        .doesNotHaveClass('trashed', 'does not have trashed class');
    });

    // =========================================
    // More Menu Tests
    // =========================================

    test('more menu is hidden by default', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert.dom('.click-menu').doesNotExist('menu is hidden by default');
    });

    test('clicking more button shows menu', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      assert.dom('.click-menu').exists('menu is visible after click');
    });

    test('clicking more button again hides menu', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      assert.dom('.click-menu').exists('menu is visible');

      await click('.item-section.more');
      assert
        .dom('.click-menu')
        .doesNotExist('menu is hidden after second click');
    });

    test('shows Delete option for non-trashed answer', async function (assert) {
      this.set('answer.isTrashed', false);

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      assert
        .dom('.click-menu li .icon-text')
        .hasText('Delete', 'shows Delete option');
      assert.dom('.click-menu li i.fas.fa-trash').exists('shows trash icon');
    });

    test('shows Restore option for trashed answer', async function (assert) {
      this.set('answer.isTrashed', true);

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      assert
        .dom('.click-menu li .icon-text')
        .hasText('Restore', 'shows Restore option');
      assert.dom('.click-menu li i.fas.fa-undo').exists('shows undo icon');
    });

    // =========================================
    // VMT Answer Tests
    // =========================================

    test('displays VMT room info for VMT answers', async function (assert) {
      this.set(
        'answer',
        EmberObject.create({
          id: 'vmt-answer-1',
          student: 'VMT User',
          isVmt: true,
          isTrashed: false,
          createDate: new Date(),
          section: EmberObject.create({ name: 'VMT Section' }),
          vmtRoomInfo: {
            roomName: 'Math Room 101',
            activityName: 'Algebra Activity',
            participants: ['user1', 'user2'],
            facilitators: ['teacher1'],
          },
          save: function () {
            return Promise.resolve(this);
          },
        })
      );

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.explanation')
        .containsText('Room Name: Math Room 101', 'displays room name');
      assert
        .dom('.item-section.explanation')
        .containsText('Activity Name:', 'displays activity label');
      assert
        .dom('.item-section.explanation')
        .containsText('Algebra Activity', 'displays activity name');
      assert
        .dom('.item-section.explanation')
        .containsText('Participants', 'displays participants section');
      assert
        .dom('.item-section.explanation')
        .containsText('user1', 'displays participant');
      assert
        .dom('.item-section.explanation')
        .containsText('Facilitators', 'displays facilitators section');
      assert
        .dom('.item-section.explanation')
        .containsText('teacher1', 'displays facilitator');
    });

    test('displays N/A for missing VMT activity name', async function (assert) {
      this.set(
        'answer',
        EmberObject.create({
          id: 'vmt-answer-2',
          student: 'VMT User',
          isVmt: true,
          isTrashed: false,
          createDate: new Date(),
          section: EmberObject.create({ name: 'VMT Section' }),
          vmtRoomInfo: {
            roomName: 'Math Room 102',
            activityName: null,
            participants: [],
            facilitators: [],
          },
          save: function () {
            return Promise.resolve(this);
          },
        })
      );

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      // Check for Activity Name label followed by N/A
      const explanationText = this.element.querySelector(
        '.item-section.explanation'
      ).textContent;
      assert.ok(
        explanationText.includes('N/A'),
        'displays N/A for missing activity name'
      );
    });

    // =========================================
    // Delete Answer Tests
    // =========================================

    test('clicking Delete shows confirmation modal', async function (assert) {
      assert.expect(1);

      this.owner.register(
        'service:sweet-alert',
        class extends Service {
          showModal(type, title) {
            assert.strictEqual(
              title,
              'Are you sure you want to delete this submission',
              'shows delete confirmation'
            );
            return Promise.resolve({ value: false });
          }
          showToast() {
            return Promise.resolve({ value: false });
          }
        }
      );

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      await click('.click-menu li');
    });

    test('confirming delete sets isTrashed to true and saves', async function (assert) {
      assert.expect(2);

      let saveCalled = false;
      this.set('answer.save', function () {
        saveCalled = true;
        return Promise.resolve(this);
      });

      this.owner.register(
        'service:sweet-alert',
        class extends Service {
          showModal() {
            return Promise.resolve({ value: true });
          }
          showToast() {
            return Promise.resolve({ value: false });
          }
        }
      );

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      await click('.click-menu li');
      await settled();

      assert.true(this.answer.isTrashed, 'isTrashed is set to true');
      assert.true(saveCalled, 'save was called');
    });

    test('clicking Undo on delete toast restores the answer', async function (assert) {
      assert.expect(2);

      let saveCount = 0;
      this.set('answer.save', function () {
        saveCount++;
        return Promise.resolve(this);
      });

      this.owner.register(
        'service:sweet-alert',
        class extends Service {
          showModal() {
            return Promise.resolve({ value: true });
          }
          showToast(type, message) {
            // First call is delete toast, second is restore confirmation
            if (message === 'Submission Deleted') {
              return Promise.resolve({ value: true }); // User clicks Undo
            }
            return Promise.resolve({ value: false });
          }
        }
      );

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      await click('.click-menu li');
      await settled();

      assert.false(
        this.answer.isTrashed,
        'isTrashed is restored to false after undo'
      );
      assert.strictEqual(
        saveCount,
        2,
        'save was called twice (delete and undo)'
      );
    });

    // =========================================
    // Restore Answer Tests
    // =========================================

    test('clicking Restore shows confirmation modal', async function (assert) {
      assert.expect(1);

      this.set('answer.isTrashed', true);

      this.owner.register(
        'service:sweet-alert',
        class extends Service {
          showModal(type, title) {
            assert.strictEqual(
              title,
              'Are you sure you want to restore this submission',
              'shows restore confirmation'
            );
            return Promise.resolve({ value: false });
          }
          showToast() {
            return Promise.resolve({ value: false });
          }
        }
      );

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      await click('.click-menu li');
    });

    test('confirming restore sets isTrashed to false and saves', async function (assert) {
      assert.expect(2);

      this.set('answer.isTrashed', true);

      let saveCalled = false;
      this.set('answer.save', function () {
        saveCalled = true;
        return Promise.resolve(this);
      });

      this.owner.register(
        'service:sweet-alert',
        class extends Service {
          showModal() {
            return Promise.resolve({ value: true });
          }
          showToast() {
            return Promise.resolve({ value: false });
          }
        }
      );

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      await click('.item-section.more');
      await click('.click-menu li');
      await settled();

      assert.false(this.answer.isTrashed, 'isTrashed is set to false');
      assert.true(saveCalled, 'save was called');
    });

    // =========================================
    // Click Outside Handler Tests
    // =========================================

    test('menu closes when clicking outside', async function (assert) {
      await render(hbs`
      <div class="outside-element" style="padding: 20px;">
        <SubmissionViewerListItem
          @answer={{this.answer}}
          @selectedMap={{this.selectedMap}}
          @threads={{this.threads}}
          @onSelect={{this.onSelect}}
        />
      </div>
    `);

      // Open menu
      await click('.item-section.more');
      assert.dom('.click-menu').exists('menu is open');

      // Click outside
      await click('.outside-element');
      await settled();

      assert.dom('.click-menu').doesNotExist('menu closes on outside click');
    });

    // =========================================
    // Structure Tests
    // =========================================

    test('renders all expected sections', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert.dom('.item-section.toggle-check').exists('has checkbox section');
      assert.dom('.item-section.student').exists('has student section');
      assert.dom('.item-section.revisions').exists('has revisions section');
      assert.dom('.item-section.explanation').exists('has explanation section');
      assert.dom('.item-section.section').exists('has section section');
      assert.dom('.item-section.createDate').exists('has createDate section');
      assert.dom('.item-section.more').exists('has more menu section');
    });

    test('more menu icon is present', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-section.more i.fas.fa-ellipsis-v')
        .exists('has ellipsis icon');
    });

    // =========================================
    // Edge Cases
    // =========================================

    test('handles missing answer gracefully', async function (assert) {
      this.set('answer', null);

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('.item-container')
        .exists('component renders with null answer');
    });

    test('handles empty selectedMap', async function (assert) {
      this.set('selectedMap', null);

      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('input[type="checkbox"]')
        .isNotChecked('checkbox unchecked with null selectedMap');
    });

    test('checkbox has correct value attribute', async function (assert) {
      await render(hbs`
      <SubmissionViewerListItem
        @answer={{this.answer}}
        @selectedMap={{this.selectedMap}}
        @threads={{this.threads}}
        @onSelect={{this.onSelect}}
      />
    `);

      assert
        .dom('input[type="checkbox"]')
        .hasValue('answer-1', 'checkbox has answer id as value');
    });
  }
);
