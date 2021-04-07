Encompass.DashboardClassesListComponent = Ember.Component.extend(
  Encompass.CurrentUserMixin,
  {
    utils: Ember.inject.service("utility-methods"),
    tableHeight: "",
    elementId: "section-list",
    sortCriterion: {
      name: "A-Z",
      sortParam: { param: "classes", direction: "asc" },
      icon: "fas fa-sort-alpha-down sort-icon",
      type: "classes",
    },
    sortOptions: {
      name: [
        { sortParam: null, icon: "" },
        {
          name: "A-Z",
          sortParam: { param: "name", direction: "asc" },
          icon: "fas fa-sort-alpha-down sort-icon",
          type: "name",
        },
        {
          name: "Z-A",
          sortParam: { param: "name", direction: "desc" },
          icon: "fas fa-sort-alpha-up sort-icon",
          type: "name",
        },
      ],
      classes: [
        { sortParam: null, icon: "" },
        {
          name: "A-Z",
          sortParam: {
            param: "section.name",
            direction: "asc",
          },
          icon: "fas fa-sort-alpha-down sort-icon",
          type: "classes",
        },
        {
          name: "Z-A",
          sortParam: {
            param: "section.name",
            direction: "desc",
          },
          icon: "fas fa-sort-alpha-up sort-icon",
          type: "classes",
        },
      ],
      assignedDate: [
        { sortParam: null, icon: "" },
        {
          name: "Newest",
          sortParam: {
            param: "assignedDate",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "assignedDate",
        },
        {
          name: "Oldest",
          sortParam: {
            param: "assignedDate",
            direction: "desc",
          },
          icon: "fas fa-arrow-up sort-icon",
          type: "assignedDate",
        },
      ],
      dueDate: [
        { sortParam: null, icon: "" },
        {
          name: "Newest",
          sortParam: {
            param: "dueDate",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "dueDate",
        },
        {
          name: "Oldest",
          sortParam: {
            param: "dueDate",
            direction: "desc",
          },
          icon: "fas fa-arrow-up sort-icon",
          type: "dueDate",
        },
      ],
      submissions: [
        { sortParam: null, icon: "" },
        {
          name: "Newest",
          sortParam: {
            param: "answers.length",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "submissions",
        },
        {
          name: "Oldest",
          sortParam: {
            param: "answers.length",
            direction: "desc",
          },
          icon: "fas fa-arrow-up sort-icon",
          type: "submissions",
        },
      ],
    },
    cleanSections: function () {
      return this.get("sections").rejectBy("isTrashed");
    }.property("sections.@each.isTrashed"),
    didReceiveAttrs: function () {
      this.yourSections();
    },
    // This sorts all the sections in the database and returns only the ones you created
    yourSections: function () {
      let yourSections = this.get("cleanSections").filter((section) => {
        let creatorId = this.get("utils").getBelongsToId(section, "createdBy");
        return creatorId === this.get("currentUser.id");
      });

      const yourSectionIds = yourSections.map((section) => section.get('sectionId'));

      let assignmentsList = this.assignments.filter((assignment) => yourSectionIds.includes(assignment.get('section').get('sectionId')));

      // return list of assignments, add section name, id to each
      return assignmentsList;
    },
    sortedClasses: function () {
      let sortValue = this.get("sortCriterion.sortParam.param") || "classes";
      let sortDirection =
        this.get("sortCriterion.sortParam.direction") || "asc";
      let sorted;
      if (this.yourSections) {
        sorted = this.yourSections().sortBy(sortValue);
      }
      if (sortDirection === "desc") {
        return sorted.reverse();
      }

      return sorted;
    }.property("sortCriterion"),
    actions: {
      updateSortCriterion(criterion) {
        this.set("sortCriterion", criterion);
      },
    },
  }
);
