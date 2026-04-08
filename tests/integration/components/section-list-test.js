import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | section-list', function (hooks) {
  setupRenderingTest(hooks);

  // Helper to build section objects
  const buildSection = (overrides = {}) => {
    const base = {
      id: 's1',
      name: 'Test Section',
      isTrashed: false,
      createDate: '2025-01-15T00:00:00Z',
      createdBy: 'u1',
      organization: 'org1',
    };
    return { ...base, ...overrides };
  };

  // Helper to build currentUser mock
  const buildCurrentUser = (overrides = {}) => {
    const base = {
      id: 'current',
      isStudent: false,
      isTeacher: true,
      isPdAdmin: false,
      isAdmin: false,
      user: {
        username: 'test-user',
        sections: [],
        organization: { id: 'org1', name: '21PSTEM' },
      },
    };
    return { ...base, ...overrides };
  };

  // Render helper
  async function renderSectionList(
    context,
    { sections = [], currentUser = {} } = {}
  ) {
    // Mock utility-methods service - mimics real service behavior
    // In real Ember Data models, relationships can be objects with .id or loaded records
    // This mock handles both test data (plain objects) and simulates the real service
    context.owner.register(
      'service:utility-methods',
      Service.extend({
        getBelongsToId(obj, property) {
          // Real service uses record.belongsTo(property).id()
          // For tests with plain objects, we check obj[property]
          const value = obj?.[property];
          if (!value) return null;
          // If it's an object with id property, return the id (matches real behavior)
          if (typeof value === 'object' && value.id) {
            return value.id;
          }
          // If it's a string, it's already an id
          if (typeof value === 'string') {
            return value;
          }
          return null;
        },
      })
    );

    // Mock currentUser service
    context.owner.register(
      'service:current-user',
      buildCurrentUser(currentUser),
      { instantiate: false }
    );

    context.set('sections', sections);
    await render(hbs`<SectionList @sections={{this.sections}} />`);
  }

  // --- Tests ---

  test('renders header with Classes heading', async function (assert) {
    await renderSectionList(this, {
      sections: [],
      currentUser: { isTeacher: true },
    });

    assert.dom('h1').hasText('Classes', 'Heading displays "Classes"');
  });

  test('shows Create New Class link for non-students', async function (assert) {
    await renderSectionList(this, {
      sections: [],
      currentUser: { isTeacher: true, isStudent: false },
    });

    assert
      .dom('#new-section-link')
      .exists('Create New Class link is present for teacher');
    assert.dom('#new-section-link span').hasText('Create New Class');
  });

  test('hides Create New Class link for students', async function (assert) {
    await renderSectionList(this, {
      sections: [],
      currentUser: { isStudent: true, isTeacher: false },
    });

    assert
      .dom('#new-section-link')
      .doesNotExist('Create New Class link is hidden for students');
  });

  test('filters out trashed sections', async function (assert) {
    const sections = [
      buildSection({ id: 's1', name: 'Active Section', isTrashed: false }),
      buildSection({ id: 's2', name: 'Trashed Section', isTrashed: true }),
      buildSection({ id: 's3', name: 'Another Active', isTrashed: false }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isStudent: true,
        user: {
          username: 'student',
          sections: [
            { sectionId: 's1', role: 'student' },
            { sectionId: 's2', role: 'student' },
            { sectionId: 's3', role: 'student' },
          ],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('.section')
      .exists({ count: 2 }, 'Only non-trashed sections are displayed');
    assert.dom(this.element).includesText('Active Section');
    assert.dom(this.element).includesText('Another Active');
    assert.dom(this.element).doesNotIncludeText('Trashed Section');
  });

  test('teacher view shows "Your Classes" list with sections they created', async function (assert) {
    const sections = [
      buildSection({
        id: 's1',
        name: 'My Class 1',
        createdBy: 'current',
        createDate: '2025-01-15T00:00:00Z',
      }),
      buildSection({
        id: 's2',
        name: 'My Class 2',
        createdBy: 'current',
        createDate: '2025-01-10T00:00:00Z',
      }),
      buildSection({
        id: 's3',
        name: 'Other Teacher Class',
        createdBy: 'other',
        createDate: '2025-01-05T00:00:00Z',
      }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'teacher-user',
          sections: [],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('h2')
      .includesText("teacher-user's Classes", 'Shows username in heading');
    assert
      .dom('.your-sections .section')
      .exists({ count: 2 }, 'Shows 2 sections created by user');
    assert.dom('.your-sections').includesText('My Class 1');
    assert.dom('.your-sections').includesText('My Class 2');
    assert.dom('.your-sections').doesNotIncludeText('Other Teacher Class');
  });

  test('teacher view shows empty state when no sections created', async function (assert) {
    await renderSectionList(this, {
      sections: [],
      currentUser: {
        id: 'current',
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'new-teacher',
          sections: [],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('.your-sections')
      .includesText('You have no classes', 'Shows empty state message');
  });

  test('teacher view shows "Classes you belong to" as collaborator', async function (assert) {
    const sections = [
      buildSection({ id: 's1', name: 'My Own Class', createdBy: 'current' }),
      buildSection({ id: 's2', name: 'Collab Class 1', createdBy: 'other1' }),
      buildSection({ id: 's3', name: 'Collab Class 2', createdBy: 'other2' }),
      buildSection({ id: 's4', name: 'Not My Class', createdBy: 'other3' }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'collab-teacher',
          sections: [
            { sectionId: 's1', role: 'teacher' }, // Own class
            { sectionId: 's2', role: 'teacher' }, // Collab
            { sectionId: 's3', role: 'teacher' }, // Collab
          ],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert.dom(this.element).includesText('Classes you belong to');
    assert
      .dom('.collab-sections .section')
      .exists({ count: 2 }, 'Shows 2 collab sections');
    assert.dom('.collab-sections').includesText('Collab Class 1');
    assert.dom('.collab-sections').includesText('Collab Class 2');
    assert
      .dom('.collab-sections')
      .doesNotIncludeText('My Own Class', 'Excludes own created sections');
    assert
      .dom('.collab-sections')
      .doesNotIncludeText('Not My Class', 'Excludes non-member sections');
  });

  test('teacher view shows empty state for collab sections', async function (assert) {
    const sections = [
      buildSection({ id: 's1', name: 'My Class', createdBy: 'current' }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'solo-teacher',
          sections: [{ sectionId: 's1', role: 'teacher' }],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('.collab-sections')
      .includesText("You don't belong to any classes yet");
  });

  test('student view shows only "Your Classes" list', async function (assert) {
    const sections = [
      buildSection({ id: 's1', name: 'Math 101', createdBy: 'teacher1' }),
      buildSection({ id: 's2', name: 'Science 101', createdBy: 'teacher2' }),
      buildSection({ id: 's3', name: 'Other Class', createdBy: 'teacher3' }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'student1',
        isStudent: true,
        isTeacher: false,
        user: {
          username: 'student-user',
          sections: [
            { sectionId: 's1', role: 'student' },
            { sectionId: 's2', role: 'student' },
          ],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert.dom('h2').includesText('Your Classes');
    assert
      .dom('.your-sections .section')
      .exists({ count: 2 }, 'Shows 2 enrolled sections');
    assert.dom('.your-sections').includesText('Math 101');
    assert.dom('.your-sections').includesText('Science 101');
    assert.dom('.your-sections').doesNotIncludeText('Other Class');

    // Student should not see teacher sections
    assert
      .dom('.collab-sections')
      .doesNotExist('No collab sections for students');
    assert.dom('.org-sections').doesNotExist('No org sections for students');
  });

  test('student view shows empty state when not enrolled', async function (assert) {
    await renderSectionList(this, {
      sections: [],
      currentUser: {
        id: 'student1',
        isStudent: true,
        isTeacher: false,
        user: {
          username: 'new-student',
          sections: [],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('.your-sections')
      .includesText("You don't belong to any classes yet");
  });

  test('pdAdmin view shows organization classes', async function (assert) {
    const sections = [
      buildSection({
        id: 's1',
        name: 'My Class',
        createdBy: 'current',
        organization: 'org1',
      }),
      buildSection({
        id: 's2',
        name: 'Org Class 1',
        createdBy: 'teacher1',
        organization: 'org1',
      }),
      buildSection({
        id: 's3',
        name: 'Org Class 2',
        createdBy: 'teacher2',
        organization: 'org1',
      }),
      buildSection({
        id: 's4',
        name: 'Other Org Class',
        createdBy: 'teacher3',
        organization: 'org2',
      }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isTeacher: true,
        isPdAdmin: true,
        isStudent: false,
        user: {
          username: 'pd-admin',
          sections: [{ sectionId: 's1', role: 'teacher' }],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom(this.element)
      .includesText("21PSTEM's Classes", 'Shows org name in heading');
    assert
      .dom('.org-sections .section')
      .exists({ count: 2 }, 'Shows 2 org sections');
    assert.dom('.org-sections').includesText('Org Class 1');
    assert.dom('.org-sections').includesText('Org Class 2');
    assert
      .dom('.org-sections')
      .doesNotIncludeText('My Class', 'Excludes own created classes');
    assert
      .dom('.org-sections')
      .doesNotIncludeText('Other Org Class', 'Excludes other org classes');
  });

  test('pdAdmin view shows empty state for org sections', async function (assert) {
    const sections = [
      buildSection({
        id: 's1',
        name: 'My Class',
        createdBy: 'current',
        organization: 'org1',
      }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isPdAdmin: true,
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'pd-admin',
          sections: [{ sectionId: 's1', role: 'teacher' }],
          organization: { id: 'org1', name: 'Empty Org' },
        },
      },
    });

    assert
      .dom('.org-sections')
      .includesText('Empty Org does not have any classes yet');
  });

  test('admin view shows "All Classes" list', async function (assert) {
    const sections = [
      buildSection({
        id: 's1',
        name: 'My Class',
        createdBy: 'current',
        organization: 'org1',
      }),
      buildSection({
        id: 's2',
        name: 'Teacher A Class',
        createdBy: 'teacherA',
        organization: 'org1',
      }),
      buildSection({
        id: 's3',
        name: 'Teacher B Class',
        createdBy: 'teacherB',
        organization: 'org2',
      }),
      buildSection({
        id: 's4',
        name: 'Collab Class',
        createdBy: 'teacherC',
        organization: 'org3',
      }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isAdmin: true,
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'admin-user',
          sections: [
            { sectionId: 's1', role: 'teacher' },
            { sectionId: 's4', role: 'teacher' },
          ],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert.dom(this.element).includesText('All Classes');
    assert
      .dom('.all-sections .section')
      .exists({ count: 2 }, 'Shows all sections excluding own and collab');
    assert.dom('.all-sections').includesText('Teacher A Class');
    assert.dom('.all-sections').includesText('Teacher B Class');
    assert
      .dom('.all-sections')
      .doesNotIncludeText('My Class', 'Excludes own created class');
    assert
      .dom('.all-sections')
      .doesNotIncludeText('Collab Class', 'Excludes collab class');
  });

  test('admin view shows all sections when admin creates none', async function (assert) {
    const sections = [
      buildSection({ id: 's1', name: 'Class 1', createdBy: 'teacher1' }),
      buildSection({ id: 's2', name: 'Class 2', createdBy: 'teacher2' }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isAdmin: true,
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'admin-observer',
          sections: [],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('.all-sections .section')
      .exists({ count: 2 }, 'Shows all sections');
  });

  test('sections are sorted by createDate in descending order', async function (assert) {
    const sections = [
      buildSection({
        id: 's1',
        name: 'Old Class',
        createdBy: 'current',
        createDate: '2024-01-01T00:00:00Z',
      }),
      buildSection({
        id: 's2',
        name: 'Newest Class',
        createdBy: 'current',
        createDate: '2025-03-01T00:00:00Z',
      }),
      buildSection({
        id: 's3',
        name: 'Middle Class',
        createdBy: 'current',
        createDate: '2025-02-01T00:00:00Z',
      }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'teacher',
          sections: [],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    const sectionLinks = this.element.querySelectorAll(
      '.your-sections .section'
    );
    assert.strictEqual(
      sectionLinks[0].textContent.trim(),
      'Newest Class',
      'Most recent is first'
    );
    assert.strictEqual(
      sectionLinks[1].textContent.trim(),
      'Middle Class',
      'Middle date is second'
    );
    assert.strictEqual(
      sectionLinks[2].textContent.trim(),
      'Old Class',
      'Oldest is last'
    );
  });

  test('handles missing organization gracefully', async function (assert) {
    await renderSectionList(this, {
      sections: [],
      currentUser: {
        id: 'current',
        isPdAdmin: true,
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'pd-admin',
          sections: [],
          organization: null, // Missing organization
        },
      },
    });

    assert
      .dom(this.element)
      .includesText('Unknown Organization', 'Shows fallback organization name');
  });

  test('component has section-list id for styling', async function (assert) {
    await renderSectionList(this, {
      sections: [],
      currentUser: { isTeacher: true },
    });

    assert.dom('#section-list').exists('Component has section-list id');
  });

  test('all section links route correctly', async function (assert) {
    const sections = [
      buildSection({
        id: 'section-123',
        name: 'Test Section',
        createdBy: 'current',
      }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'teacher',
          sections: [],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    const link = this.element.querySelector('.your-sections .section');
    assert
      .dom(link)
      .hasAttribute('href', '/sections/section-123', 'Link has correct route');
  });

  test('combined role: pdAdmin sees both own sections and org sections', async function (assert) {
    const sections = [
      buildSection({
        id: 's1',
        name: 'My Class',
        createdBy: 'current',
        organization: 'org1',
      }),
      buildSection({
        id: 's2',
        name: 'Org Class',
        createdBy: 'other',
        organization: 'org1',
      }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isTeacher: true,
        isPdAdmin: true,
        isStudent: false,
        user: {
          username: 'pd-admin',
          sections: [{ sectionId: 's1', role: 'teacher' }],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('.your-sections .section')
      .exists({ count: 1 }, 'Shows own classes');
    assert.dom('.your-sections').includesText('My Class');
    // The org class won't appear in org-sections because it's not in yourSections or collabSections
    // and the getter filters to exclude those. Since 'other' created it and current is not a teacher member,
    // it should appear in org sections
    assert
      .dom('.org-sections .section')
      .exists({ count: 1 }, 'Shows org class');
    assert.dom('.org-sections').includesText('Org Class');
  });

  test('combined role: admin+teacher sees own, collab, and all sections', async function (assert) {
    const sections = [
      buildSection({ id: 's1', name: 'My Class', createdBy: 'current' }),
      buildSection({ id: 's2', name: 'Collab Class', createdBy: 'other1' }),
      buildSection({ id: 's3', name: 'Other Class', createdBy: 'other2' }),
    ];

    await renderSectionList(this, {
      sections,
      currentUser: {
        id: 'current',
        isAdmin: true,
        isTeacher: true,
        isStudent: false,
        user: {
          username: 'admin-teacher',
          sections: [
            { sectionId: 's1', role: 'teacher' },
            { sectionId: 's2', role: 'teacher' },
          ],
          organization: { id: 'org1', name: '21PSTEM' },
        },
      },
    });

    assert
      .dom('.your-sections .section')
      .exists({ count: 1 }, 'Shows own class');
    assert
      .dom('.collab-sections .section')
      .exists({ count: 1 }, 'Shows collab class');
    assert
      .dom('.all-sections .section')
      .exists({ count: 1 }, 'Shows other class');
  });
});
