Encompass.DashboardClassesListComponent = Ember.Component.extend(
  Encompass.CurrentUserMixin,
  {
    utils: Ember.inject.service("utility-methods"),
    tableHeight: "",
    elementId: "section-list",
    sortCriterion: {
      name: "A-Z",
      sortParam: { param: "submissionDate", direction: "asc" },
      icon: "fas fa-sort-alpha-down sort-icon",
      type: "submissionDate",
    },
    sortOptions: {
      name: [
        { sortParam: null, icon: "" },
        {
          name: "A-Z",
          sortParam: { param: "problem.title", direction: "asc" },
          icon: "fas fa-sort-alpha-down sort-icon",
          type: "name",
        },
        {
          name: "Z-A",
          sortParam: { param: "problem.title", direction: "desc" },
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
      submissionDate: [
        { sortParam: null, icon: "" },
        {
          id: 3,
          name: "Newest",
          sortParam: {
            param: "submissionDate",
            direction: "asc",
          },
          icon: "fas fa-arrow-down sort-icon",
          type: "submissionDate",
        },
        {
          id: 4,
          name: "Oldest",
          sortParam: {
            param: "submissionDate",
            direction: "desc",
          },
          icon: "fas fa-arrow-up sort-icon",
          type: "submissionDate",
        },
      ],
    },
    cleanSections: function () {
      return this.get("sections").rejectBy("isTrashed");
    }.property("sections.@each.isTrashed"),
    didReceiveAttrs: function () {
      this.yourAssignments();
    },
    // Sorts all the sections in the database
    yourAssignments: function () {
      let yourSections = this.get("cleanSections").filter((section) => {
        let creatorId = this.get("utils").getBelongsToId(section, "createdBy");
        return creatorId === this.get("currentUser.id");
      });

      const yourSectionIds = yourSections.map((section) => section.get("sectionId")
      );

      let assignmentsList = this.assignments.filter((assignment) => yourSectionIds.includes(assignment.get("section").get("sectionId"))
      );

      // Return list of assignments, add section name, id to each
      return assignmentsList;
    },
    sortedClasses: function () {
      let sortValue =
        this.get("sortCriterion.sortParam.param") || "submissionDate";
      let sortDirection =
        this.get("sortCriterion.sortParam.direction") || "asc";
      let sorted;

      if (sortValue === "submissionDate") {
        this.yourAssignments().forEach((assignment) => {
          if (assignment.get("answers").length) {
            console.log("inside if");

            // loop through answers and create new property with latest answer create date
            let createDate;
            const latestAnswerA = assignment
              .get("answers")
              .sortBy("createDate");
            if (latestAnswerA[0]) {
              createDate = latestAnswerA[0].get("createDate");
            }

            assignment.set("createDateAnswer", createDate);
          }
        });
        sorted = this.yourAssignments().sortBy("createDateAnswer");
      } else {
        if (this.yourAssignments().length) {
          sorted = this.yourAssignments().sortBy(sortValue);
        }
      }

      if (sortDirection === "desc") {
        return sorted.reverse();
      }
      this.set("sortCriterion", "submissionDate");
      return sorted;
    }.property("sortCriterion"),
    actions: {
      updateSortCriterion(criterion) {
        this.set("sortCriterion", criterion);
      },
    },
  }
);
