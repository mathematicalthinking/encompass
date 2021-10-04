import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  utils: service('utility-methods'),
  elementId: 'section-list',

  cleanSections: computed('sections.@each.isTrashed', function () {
    return this.sections.rejectBy('isTrashed');
  }),

  // This sorts all the sections in the database and returns only the ones you created
  yourSections: computed('cleanSections.[]', 'currentUser.id', function () {
    let yourSections = this.cleanSections.filter((section) => {
      let creatorId = this.utils.getBelongsToId(section, 'createdBy');
      return creatorId === this.get('currentUser.id');
    });
    return yourSections.sortBy('createDate').reverse();
  }),

  yourTeacherSectionIds: computed(
    'currentUser.sections.@each.role',
    function () {
      let sections = this.get('currentUser.sections') || [];
      return sections.filterBy('role', 'teacher').mapBy('sectionId');
    }
  ),

  yourStudentSectionIds: computed(
    'currentUser.sections.@each.role',
    function () {
      let sections = this.get('currentUser.sections') || [];
      return sections.filterBy('role', 'student').mapBy('sectionId');
    }
  ),

  // This displays the sections if you are inside the teachers array
  // This works but by default if you create it you are in the teacher's array
  collabSections: computed(
    'cleanSections.[]',
    'yourTeacherSectionIds.[]',
    function () {
      let collabSections = this.cleanSections.filter((section) => {
        let sectionId = section.get('id');

        return (
          this.yourTeacherSectionIds.includes(sectionId) &&
          !this.yourSections.includes(section)
        );
      });
      return collabSections.sortBy('createDate').reverse();
    }
  ),

  orgSections: computed(
    'cleanSections.@each.organization',
    'yourSections.[]',
    'collabSections.[]',
    function () {
      let sections = this.cleanSections.filter((section) => {
        let orgId = this.utils.getBelongsToId(section, 'organization');
        let userOrgId = this.utils.getBelongsToId(
          this.currentUser,
          'organization'
        );

        return (
          orgId === userOrgId &&
          !this.yourSections.includes(section) &&
          !this.collabSections.includes(section)
        );
      });
      return sections.sortBy('createDate').reverse();
    }
  ),

  studentSections: computed(
    'sections.@each.isTrashed',
    'yourStudentSectionIds.[]',
    function () {
      let sections = this.cleanSections.filter((section) => {
        return this.yourStudentSectionIds.includes(section.get('id'));
      });
      return sections.sortBy('createDate').reverse();
    }
  ),

  allSections: computed(
    'cleanSections.[]',
    'collabSections.[]',
    'yourSections.[]',
    function () {
      let sections = this.cleanSections.filter((section) => {
        return (
          !this.yourSections.includes(section) &&
          !this.collabSections.includes(section)
        );
      });
      return sections.sortBy('createDate').reverse();
    }
  ),
});
