Encompass.DashboardClassesListComponent = Ember.Component.extend(
  Encompass.CurrentUserMixin,
  {
    utils: Ember.inject.service("utility-methods"),
    tableHeight: "",
    elementId: "section-list",
    sortCriterion: {
      name: "A-Z",
      sortParam: { param: "name", direction: "asc" },
      icon: "fas fa-sort-alpha-down sort-icon",
      type: "name",
    },
    sortOptions: {
      name: [
        { sortParam: null, icon: "" },
        {
          name: "A-Z",
          sortParam: { param: "linkedAssignment.name", direction: "asc" },
          icon: "fas fa-sort-alpha-down sort-icon",
          type: "name",
        },
        {
          name: "Z-A",
          sortParam: { param: "linkedAssignment.name", direction: "desc" },
          icon: "fas fa-sort-alpha-up sort-icon",
          type: "name",
        },
      ],
      classes: [
        { sortParam: null, icon: "" },
        {
          name: "A-Z",
          sortParam: {
            param: "linkedAssignment.section.name",
            direction: "asc",
          },
          icon: "fas fa-sort-alpha-down sort-icon",
          type: "classes",
        },
        {
          name: "Z-A",
          sortParam: {
            param: "linkedAssignment.section.name",
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
            param: "linkedAssignment.assignedDate",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "assignedDate",
        },
        {
          name: "Oldest",
          sortParam: {
            param: "linkedAssignment.assignedDate",
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
            param: "linkedAssignment.dueDate",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "dueDate",
        },
        {
          name: "Oldest",
          sortParam: {
            param: "linkedAssignment.dueDate",
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
            param: "submissionsLength",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "submissions",
        },
        {
          name: "Oldest",
          sortParam: {
            param: "submissionsLength",
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

      let count = 0;

      yourSections.forEach((section) => {
        const assignments = section.get("assignments");
        count += assignments.content.length;
      });

      this.tableHeight = count * 31 + "px";

      return yourSections.sortBy("createDate").reverse();
    },
    sortedClasses: function () {
      let sortValue = this.get("sortCriterion.sortParam.param") || "name";
      let sortDirection =
        this.get("sortCriterion.sortParam.direction") || "asc";
      let sorted;
      if (this.yourSections) {
        sorted = this.yourSections().sortBy(sortValue);
      }
      if (sortDirection === "desc") {
        return sorted.reverse();
      }
      this.tableHeight = sorted.length * 31 + "px";
      return sorted;
    }.property("sortCriterion"),
    actions: {
      updateSortCriterion(criterion) {
        this.set("sortCriterion", criterion);
      },
    },
  }
);
