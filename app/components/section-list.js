import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class SectionListComponent extends Component {
  @service('utility-methods') utils;
  @service currentUser;

  get userOrgName() {
    return this.currentUser.user?.organization?.name || 'Unknown Organization';
  }

  get cleanSections() {
    return this.args.sections.filter((section) => !section.isTrashed);
  }

  // This sorts all the sections in the database and returns only the ones you created
  get yourSections() {
    const yourSections = this.cleanSections.filter((section) => {
      const creatorId = this.utils.getBelongsToId(section, 'createdBy');
      return creatorId === this.currentUser.id;
    });
    return yourSections
      .slice()
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }

  get yourTeacherSectionIds() {
    const sections = this.currentUser.user.sections || [];
    return sections.filter((s) => s.role === 'teacher').map((s) => s.sectionId);
  }

  get yourStudentSectionIds() {
    const sections = this.currentUser.user.sections || [];
    return sections.filter((s) => s.role === 'student').map((s) => s.sectionId);
  }

  // This displays the sections if you are inside the teachers array
  // This works but by default if you create it you are in the teacher's array
  get collabSections() {
    const collabSections = this.cleanSections.filter((section) => {
      const sectionId = section.id;

      return (
        this.yourTeacherSectionIds.includes(sectionId) &&
        !this.yourSections.includes(section)
      );
    });
    return collabSections
      .slice()
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }

  get orgSections() {
    const sections = this.cleanSections.filter((section) => {
      const orgId = this.utils.getBelongsToId(section, 'organization');
      const userOrgId = this.utils.getBelongsToId(
        this.currentUser.user,
        'organization'
      );

      return (
        orgId === userOrgId &&
        !this.yourSections.includes(section) &&
        !this.collabSections.includes(section)
      );
    });
    return sections
      .slice()
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }

  get studentSections() {
    const sections = this.cleanSections.filter((section) => {
      return this.yourStudentSectionIds.includes(section.id);
    });
    return sections
      .slice()
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }

  get allSections() {
    const sections = this.cleanSections.filter((section) => {
      return (
        !this.yourSections.includes(section) &&
        !this.collabSections.includes(section)
      );
    });
    return sections
      .slice()
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }
}
