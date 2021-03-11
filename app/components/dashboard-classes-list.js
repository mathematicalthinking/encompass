Encompass.DashboardClassesComponent = Ember.Component.extend(
  Encompass.CurrentUserMixin,
  {
    elementId: "section-list",

    cleanSections: function () {
      return this.get("sections").rejectBy("isTrashed");
    }.property("sections.@each.isTrashed"),

    // This sorts all the sections in the database and returns only the ones you created
    yourSections: function () {
      let yourSections = this.get("cleanSections").filter((section) => {
        let creatorId = this.get("utils").getBelongsToId(section, "createdBy");
        return creatorId === this.get("currentUser.id");
      });
      return yourSections.sortBy("createDate").reverse();
    }.property("cleanSections.[]", "currentUser.id"),

    yourTeacherSectionIds: function () {
      let sections = this.get("currentUser.sections") || [];
      return sections.filterBy("role", "teacher").mapBy("sectionId");
    }.property("currentUser.sections.@each.role"),

    yourStudentSectionIds: function () {
      let sections = this.get("currentUser.sections") || [];
      return sections.filterBy("role", "student").mapBy("sectionId");
    }.property("currentUser.sections.@each.role"),

    // This displays the sections if you are inside the teachers array
    // This works but by default if you create it you are in the teacher's array
    collabSections: function () {
      let collabSections = this.get("cleanSections").filter((section) => {
        let sectionId = section.get("id");

        return (
          this.get("yourTeacherSectionIds").includes(sectionId) &&
          !this.get("yourSections").includes(section)
        );
      });
      return collabSections.sortBy("createDate").reverse();
    }.property("cleanSections.[]", "yourTeacherSectionIds.[]"),

    orgSections: function () {
      let sections = this.get("cleanSections").filter((section) => {
        let orgId = this.get("utils").getBelongsToId(section, "organization");
        let userOrgId = this.get("utils").getBelongsToId(
          this.get("currentUser"),
          "organization"
        );

        return (
          orgId === userOrgId &&
          !this.get("yourSections").includes(section) &&
          !this.get("collabSections").includes(section)
        );
      });
      return sections.sortBy("createDate").reverse();
    }.property(
      "cleanSections.@each.organization",
      "yourSections.[]",
      "collabSections.[]"
    ),

    studentSections: function () {
      let sections = this.get("cleanSections").filter((section) => {
        return this.get("yourStudentSectionIds").includes(section.get("id"));
      });
      return sections.sortBy("createDate").reverse();
    }.property("sections.@each.isTrashed", "yourStudentSectionIds.[]"),

    allSections: function () {
      let sections = this.get("cleanSections").filter((section) => {
        return (
          !this.get("yourSections").includes(section) &&
          !this.get("collabSections").includes(section)
        );
      });
      return sections.sortBy("createDate").reverse();
    }.property("cleanSections.[]", "collabSections.[]", "yourSections.[]"),
  }
);
