Encompass.DashboardAssignmentsListComponent = Ember.Component.extend(
  Encompass.CurrentUserMixin,
  {
    utils: Ember.inject.service("utility-methods"),
    tableHeight: "",
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
      class: [
        { sortParam: null, icon: "" },
        {
          name: "A-Z",
          sortParam: {
            param: "linkedAssignment.section.name",
            direction: "asc",
          },
          icon: "fas fa-sort-alpha-down sort-icon",
          type: "class",
        },
        {
          name: "Z-A",
          sortParam: {
            param: "linkedAssignment.section.name",
            direction: "desc",
          },
          icon: "fas fa-sort-alpha-up sort-icon",
          type: "class",
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
      status: [
        { sortParam: null, icon: "" },
        {
          name: "Newest",
          sortParam: {
            param: "submissionsLength",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "status",
        },
        {
          name: "Oldest",
          sortParam: {
            param: "submissionsLength",
            direction: "desc",
          },
          icon: "fas fa-arrow-up sort-icon",
          type: "status",
        },
      ],
    },
    didReceiveAttrs: function () {
      this.filterAssignments();
    },

    filterAssignments: function () {
      let currentUser = this.get("currentUser");
      let filtered = this.assignments.filter((assignment) => {
        return assignment.id && !assignment.get("isTrashed");
      });
      filtered = filtered.sortBy("createDate").reverse();
      if (currentUser.get("accountType") === "S") {
        // what is this if block for?
        // console.log('current user is a student');
      }
      // let currentDate = new Date();
      this.set("assignmentList", filtered);
    }.observes("assignments.@each.isTrashed", "currentUser.isStudent"),

    yourList: function () {
      let currentUser = this.get("currentUser");
      let yourList = this.assignments.filter((assignment) => {
        let userId = currentUser.get("id");
        const assignedStudents = assignment
          .get("students")
          .content.currentState.map((student) => student.id);
        return (
          assignedStudents.includes(userId) && !assignment.get("isTrashed")
        );
      });
      this.tableHeight = yourList.length * 31 + "px";
      return yourList;
    },

    sortedProblems: function () {
      let sortValue = this.get("sortCriterion.sortParam.param") || "name";
      let sortDirection =
        this.get("sortCriterion.sortParam.direction") || "asc";
      let sorted;
      if (this.yourList()) {
        sorted = this.yourList().sortBy(sortValue);
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


