Encompass.DashboardWorkspacesListComponent = Ember.Component.extend(
  Encompass.CurrentUserMixin,
  {
    utils: Ember.inject.service("utility-methods"),
    tableHeight: "",
    sortCriterion: {
      name: "A-Z",
      sortParam: { param: "lastModifiedDate", direction: "asc" },
      icon: "fas fa-sort-alpha-down sort-icon",
      type: "lastModifiedDate",
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
      owner: [
        { sortParam: null, icon: "" },
        {
          name: "A-Z",
          sortParam: { param: "owner.username", direction: "asc" },
          icon: "fas fa-sort-alpha-down sort-icon",
          type: "owner",
        },
        {
          name: "Z-A",
          sortParam: { param: "owner.username", direction: "desc" },
          icon: "fas fa-sort-alpha-up sort-icon",
          type: "owner",
        },
      ],
      lastModifiedDate: [
        { sortParam: null, icon: "" },
        {
          id: 3,
          name: "Newest",
          sortParam: { param: "lastModifiedDate", direction: "asc" },
          icon: "fas fa-arrow-down sort-icon",
          type: "lastModifiedDate",
        },
        {
          id: 4,
          name: "Oldest",
          sortParam: { param: "lastModifiedDate", direction: "desc" },
          icon: "fas fa-arrow-up sort-icon",
          type: "lastModifiedDate",
        },
      ],
    },

    didReceiveAttrs: function () {
      this.calculateTableHeight();
    },

    calculateTableHeight: function () {
      this.tableHeight = this.workspaces.content.length * 31 + "px";
    },
    sortedWorkspaces: function () {
      let sortValue = this.get("sortCriterion.sortParam.param") || "lastModifiedDate";
      let sortDirection =
        this.get("sortCriterion.sortParam.direction") || "asc";
      let sorted;
      if (this.workspaces) {
        sorted = this.workspaces.sortBy(sortValue);
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
