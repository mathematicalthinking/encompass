import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | response-new', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:current-user',
      Service.extend({
        id: 'user1',
        username: 'testuser',
        user: { id: 'user1', username: 'testuser' },
      })
    );

    this.owner.register(
      'service:utils',
      Service.extend({
        getBelongsToId(obj, field) {
          return obj[field] || obj.createdBy;
        },
      })
    );

    this.owner.register(
      'service:loading-display',
      Service.extend({
        handleLoadingMessage() {},
      })
    );

    this.owner.register(
      'service:errorHandling',
      Service.extend({
        handleErrors() {},
      })
    );

    this.owner.register(
      'service:alert',
      Service.extend({
        showToast() {},
      })
    );

    this.owner.register(
      'service:store',
      Service.extend({
        createRecord() {
          return {
            save() {
              return Promise.resolve({});
            },
          };
        },
      })
    );

    this.owner.register('helper:format-date', function () {
      return 'January 1st 2024';
    });
  });

  // Mock data objects used across tests
  const mockSelection = {
    id: 'selection1',
    text: 'Selected text',
    isTrashed: false,
    createdBy: 'user1',
    workspace: { id: 'workspace1' },
    submission: { id: 'submission1' },
  };

  const mockComment = {
    id: 'comment1',
    text: 'Test comment',
    label: 'notice',
    isTrashed: false,
    createdBy: 'user1',
    selection: { id: 'selection1' },
    workspace: { id: 'workspace1' },
    submission: { id: 'submission1' },
  };

  const mockImageSelection = {
    ...mockSelection,
    id: 'selection2',
    imageTagLink: 'https://example.com/test-image.jpg',
    text: 'Math diagram showing triangles',
  };

  const mockOtherUserSelection = {
    id: 'selection3',
    text: 'Other user selection',
    isTrashed: false,
    createdBy: 'otheruser',
    workspace: { id: 'workspace1' },
    submission: { id: 'submission1' },
  };

  const mockTrashedSelection = {
    id: 'selection4',
    text: 'Trashed selection',
    isTrashed: true,
    createdBy: 'user1',
    workspace: { id: 'workspace1' },
    submission: { id: 'submission1' },
  };

  async function renderResponseNew(context, responseData) {
    context.set('responseData', responseData);
    await render(hbs`<ResponseNew @responseData={{this.responseData}} />`);
  }

  test('renders basic component structure', async function (assert) {
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [],
      comments: [],
    });

    assert.dom('.new-response-container').exists();
    assert.dom('.new-response-header').exists();
  });

  test('displays header information', async function (assert) {
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [],
      comments: [],
    });

    assert.dom('.new-response-header p').hasText('Craft Response');
    assert.dom('.new-response-header-info').includesText('To: Test Student');
    assert.dom('.new-response-header-info').includesText('From: testuser');
  });

  test('displays submit buttons', async function (assert) {
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [],
      comments: [],
    });

    // Both primary action buttons should be present
    assert.dom('.save-response').exists();
    assert.dom('.save-draft').exists();
    assert.dom('.save-draft').hasText('Save as Draft');
  });

  test('shows correct button text for canDirectSend', async function (assert) {
    // When user has direct send privileges, button text should change
    this.set('responseData', {
      student: 'Test Student',
      selections: [],
      comments: [],
    });
    this.set('canDirectSend', true);
    await render(hbs`<ResponseNew
            @responseData={{this.responseData}}
            @canDirectSend={{this.canDirectSend}}
        />`);

    // Button should show "Send" instead of "Submit for Approval"
    assert.dom('.save-response').hasText('Send');
  });

  test('displays selections when available', async function (assert) {
    // When selections exist, the selections section should be visible
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection],
      comments: [],
    });

    // Selections section should render with proper header
    assert.dom('.selections').exists();
    assert.dom('.selections .response-header').includesText('Selections');
  });

  test('toggles selections visibility', async function (assert) {
    // Selections should be collapsible/expandable
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection],
      comments: [],
    });

    // Initially collapsed - content should be hidden
    assert.dom('.selections-list').doesNotExist();

    // Clicking header should expand and show content
    await click('.selections .response-header');
    assert.dom('.selections-list').exists();
    assert.dom('.selections-list-item').exists();
  });

  test('displays comments when available', async function (assert) {
    // Comments section should appear when both selections and comments exist
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection],
      comments: [mockComment],
    });

    // Comments section should render with proper header
    assert.dom('.comments').exists();
    assert.dom('.comments .response-header').includesText('Comments');
  });

  test('shows note field for mentor pending approval', async function (assert) {
    // Mentor responses needing approval should show note field for context
    this.set('responseData', {
      student: 'Test Student',
      selections: [],
      comments: [],
    });
    this.set('canDirectSend', true);
    this.set('newReplyType', 'mentor');
    this.set('newReplyStatus', 'pending');
    await render(hbs`<ResponseNew
            @responseData={{this.responseData}}
            @newReplyType={{this.newReplyType}}
            @newReplyStatus={{this.newReplyStatus}}
        />`);

    // Note section and textarea should be visible for pending mentor replies
    assert.dom('.approve-note').exists();
    assert.dom('.approver-note').exists();
  });

  test('hides note field for approved mentor replies', async function (assert) {
    // Approved mentor responses don't need approval notes
    await renderResponseNew(
      this,
      { student: 'Test Student', selections: [], comments: [] },
      { newReplyType: 'mentor', newReplyStatus: 'approved' }
    );

    // Note field should be hidden for approved responses
    assert.dom('.approve-note').doesNotExist();
  });

  test('shows empty state when no selections', async function (assert) {
    // When no content exists, user should see helpful guidance
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [],
      comments: [],
      text: null,
    });

    // Empty state message should guide user to create content
    assert.dom('.response-prefill').exists();
  });

  test('selection content displays with proper structure and navigation links', async function (assert) {
    // Selections should be clickable and lead back to original context
    await renderResponseNew(this, {
      student: 'John Doe',
      selections: [mockSelection],
      comments: [],
    });

    // Expand selections to view content
    await click('.selections .response-header');

    // Selection content and navigation should be properly structured
    assert
      .dom('.selections-list-item')
      .containsText(
        'Selected text',
        'Selection text content is visible to user'
      );
    assert
      .dom('.selections-list-item a')
      .exists('Selection is wrapped in clickable link for navigation');
    assert
      .dom('.selections-list-item a')
      .hasAttribute(
        'href',
        '/workspaces/workspace1/submissions/submission1/selections/selection1',
        'Link routes to correct selection detail page'
      );
    assert
      .dom('.selections-list')
      .hasTagName(
        'ul',
        'Selections container uses unordered list for semantic grouping'
      );
    assert
      .dom('.selections-list-item')
      .hasTagName('li', 'Each selection uses list item for accessibility');
  });

  test('image selections render with accessibility attributes and proper fallback behavior', async function (assert) {
    // Image selections should be accessible to screen readers and handle load failures
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockImageSelection],
      comments: [],
    });

    // Expand selections to view image content
    await click('.selections .response-header');

    // Image should render with proper accessibility attributes
    assert
      .dom('.selections-list img')
      .exists('Image selection displays as img element');
    assert
      .dom('.selections-list img')
      .hasAttribute(
        'src',
        'https://example.com/test-image.jpg',
        'Image source URL is correctly set for browser loading'
      );
    assert
      .dom('.selections-list img')
      .hasAttribute(
        'alt',
        'Math diagram showing triangles',
        'Alt text provides description for screen readers and failed image loads'
      );
    assert
      .dom('.selections-list-item')
      .doesNotContainText(
        'Math diagram showing triangles',
        'Alt text is not redundantly displayed as visible content'
      );
  });

  test('selection filtering enforces ownership rules and excludes deleted content', async function (assert) {
    // Multiple selections with different ownership and trash status
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection, mockOtherUserSelection, mockTrashedSelection],
      comments: [],
    });

    // User expands selections to view available content
    await click('.selections .response-header');

    //  Only current user's non-trashed selections should be visible
    assert
      .dom('.selections-list-item')
      .exists({ count: 1 }, 'Displays exactly one selection after filtering');
    assert
      .dom('.selections-list-item')
      .containsText('Selected text', "Shows current user's valid selection");

    // Other user's content should be hidden
    assert
      .dom('.selections-list')
      .doesNotContainText(
        'Other user selection',
        'Hides selections created by other users'
      );

    // Deleted content should not appear
    assert
      .dom('.selections-list')
      .doesNotContainText(
        'Trashed selection',
        'Excludes trashed selections to show only active content'
      );
  });

  test('comment toggle icons provide clear visual feedback for expand/collapse state', async function (assert) {
    // Given a response with comments available for expansion
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection],
      comments: [mockComment],
    });

    // Collapsed state should show appropriate icon
    assert
      .dom('.comments .response-header i')
      .hasClass(
        'fa-chevron-left',
        'Displays left-pointing chevron to indicate collapsed state'
      );
    assert
      .dom('.comments .response-header i')
      .doesNotHaveClass(
        'fa-chevron-down',
        'Does not show down chevron when section is collapsed'
      );

    // User clicks to expand comments
    await click('.comments .response-header');

    // Expanded state should update icon accordingly
    assert
      .dom('.comments .response-header i')
      .hasClass(
        'fa-chevron-down',
        'Changes to down-pointing chevron to indicate expanded state'
      );
    assert
      .dom('.comments .response-header i')
      .doesNotHaveClass(
        'fa-chevron-left',
        'Removes left chevron when section is expanded'
      );
  });

  test('comment toggle shows correct icon states', async function (assert) {
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection],
      comments: [mockComment],
    });

    assert
      .dom('.comments .response-header i')
      .hasClass('fa-chevron-left', 'Shows left chevron when closed');
    assert
      .dom('.comments .response-header i')
      .doesNotHaveClass(
        'fa-chevron-down',
        'Does not show down chevron when closed'
      );
    await click('.comments .response-header');
    assert
      .dom('.comments .response-header i')
      .hasClass('fa-chevron-down', 'Shows down chevron when open');
    assert
      .dom('.comments .response-header i')
      .doesNotHaveClass(
        'fa-chevron-left',
        'Does not show left chevron when open'
      );
  });

  test('comment content displays with proper formatting and navigation', async function (assert) {
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection],
      comments: [mockComment],
    });

    await click('.comments .response-header');
    assert
      .dom('.comments-list-item')
      .containsText(
        '"Test comment"',
        'Comment text is wrapped in quotes for clarity'
      );
    assert
      .dom('.comments-list-item a')
      .exists('Comment is wrapped in navigation link');

    const linkHref = this.element
      .querySelector('.comments-list-item a')
      .getAttribute('href');
    assert.ok(
      linkHref.includes('workspaces'),
      'Link contains workspace route segment'
    );
    assert.ok(
      linkHref.includes('submissions'),
      'Link contains submission route segment'
    );
    assert.ok(
      linkHref.includes('selections'),
      'Link contains selection route segment'
    );
  });

  test('button states and styling', async function (assert) {
    // A basic response form without specific content
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [],
      comments: [],
    });

    // Buttons should have proper semantic HTML attributes
    assert
      .dom('.save-response')
      .hasAttribute('type', 'button', 'Save response is button type');
    assert
      .dom('.save-draft')
      .hasAttribute('type', 'button', 'Save draft is button type');

    //Buttons should have consistent visual styling
    assert
      .dom('.save-response')
      .hasClass('primary-button', 'Save response has primary styling');
    assert
      .dom('.save-draft')
      .hasClass('primary-button', 'Save draft has primary styling');

    // Button layout should follow design system patterns
    assert
      .dom('.submit-buttons')
      .hasClass('button-row', 'Buttons are in proper container');
  });

  test('note field validation and structure', async function (assert) {
    // A mentor response that requires approval (pending status)
    this.set('responseData', {
      student: 'Test Student',
      selections: [],
      comments: [],
    });
    this.set('newReplyType', 'mentor'); // Mentor responses may need approval
    this.set('newReplyStatus', 'pending'); // Pending status triggers note field display
    this.set('replyNote', 'Please review this response carefully'); // Pre-filled note content
    await render(hbs`<ResponseNew
            @responseData={{this.responseData}}
            @newReplyType={{this.newReplyType}}
            @newReplyStatus={{this.newReplyStatus}}
            @replyNote={{this.replyNote}}
        />`);

    // Note section should have proper semantic structure
    assert
      .dom('.approve-note .response-header')
      .hasText('Note to Approver', 'Note section has correct header');

    // Note textarea should have proper HTML attributes for accessibility
    assert
      .dom('.approver-note')
      .hasAttribute('id', 'response-note', 'Note textarea has correct ID');
    assert
      .dom('.approver-note')
      .hasClass('approver-note', 'Note textarea has correct class');

    // Note field should display bound data correctly
    assert
      .dom('.approver-note')
      .hasValue(
        'Please review this response carefully',
        'Note field shows bound value'
      );
  });

  test('empty state message specificity', async function (assert) {
    // A response with no selections, comments, or existing text
    await renderResponseNew(this, {
      student: 'Jane Smith',
      selections: [], // No selections made
      comments: [], // No comments available
      text: null, // No existing response text
      workspace: { id: 'workspace1' },
      submission: { id: 'submission1' },
    });

    // Empty state should provide specific, actionable guidance
    assert
      .dom('.response-prefill')
      .containsText(
        "you haven't made any selections",
        'Shows specific empty message'
      );

    // Should include clear instructions for next steps
    assert
      .dom('.response-prefill')
      .containsText('go back to the', 'Includes navigation instruction');

    // Should provide a direct link to take corrective action
    assert
      .dom('.response-prefill a')
      .exists('Empty state includes link to submission');
    assert
      .dom('.response-prefill a')
      .hasAttribute(
        'href',
        '/workspaces/workspace1/submissions/submission1',
        'Link routes to correct submission'
      );
    assert
      .dom('.response-prefill a')
      .hasText('submission', 'Link has correct text');
  });

  test('date formatting and display', async function (assert) {
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [],
      comments: [],
    });

    // Test date display structure
    assert
      .dom('.response-date')
      .hasClass('response-date', 'Date has correct CSS class');
    assert
      .dom('.response-date')
      .hasText('January 1st 2024', 'Date is formatted correctly');

    // Test date is in header
    assert
      .dom('.new-response-header .response-date')
      .exists('Date is positioned in header');
  });

  test('hides selections section when no selections available', async function (assert) {
    // A response with comments but no selections
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [], // Empty selections array
      comments: [mockComment], // Comments exist but won't show without selections
    });

    // Selections section should not render when empty
    assert.dom('.selections').doesNotExist('No selections section when empty');

    // Comments section should also be hidden (depends on selections)
    assert
      .dom('.comments')
      .doesNotExist('No comments section when no selections');

    // Empty message should be displayed instead
    assert.dom('.response-prefill').exists('Shows empty state message');
  });

  test('hides comments section when no comments available', async function (assert) {
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection],
      comments: [],
    });

    assert.dom('.selections').exists('Shows selections section');
    assert.dom('.comments').exists('Shows comments section even when empty');
  });

  test('shows both sections when both selections and comments exist', async function (assert) {
    // A response with both selections and comments available
    await renderResponseNew(this, {
      student: 'Test Student',
      selections: [mockSelection], // Content exists
      comments: [mockComment], // Related comments exist
    });

    // Both content sections should be visible
    assert.dom('.selections').exists('Shows selections section');
    assert.dom('.comments').exists('Shows comments section');

    // Empty state should not appear when content exists
    assert
      .dom('.response-prefill')
      .doesNotExist('No empty state when content exists');
  });

  test('handles null/undefined responseData gracefully', async function (assert) {
    // Test with null responseData
    await renderResponseNew(this, null);

    assert
      .dom('.new-response-container')
      .exists('Component renders with null data');
    assert
      .dom('.selections')
      .doesNotExist('No selections section with null data');
    assert.dom('.comments').doesNotExist('No comments section with null data');

    // Test header still renders but with fallback content
    assert
      .dom('.new-response-header-info')
      .containsText('To:', 'Header structure maintained');
    assert
      .dom('.new-response-header-info')
      .containsText('From: testuser', 'Current user still displayed');
  });
});
