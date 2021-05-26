Encompass.TopBarComponent = Ember.Component.extend(
  Encompass.CurrentUserMixin,
  Encompass.ErrorHandlingMixin,
  {
    tagName: "nav",
    elementId: "al_header",
    classNames: ["nav"],
    toggleRoleErrors: [],
    alert: Ember.inject.service("sweet-alert"),

    make: [
      {text: "assignment", link: "assignments.new", restricted: true},
      {text: "workspace", link: "workspaces.new", restricted: true, children: [ 
        {link: "workspaces.new", text: "new"}, 
        {link: "import", text: "import"}, 
        {link: "workspaces.copy", text: "copy"}, 
        {link: "vmt.import", text: "vmt"}
      ]},
      {text: "problem", link: "problem"}, 
      {text: "class", link: "sections.new"},
      {text: "users", link: "users.new"},
    ],

    do: [
      {text: "solve a problem", link: "assignments", restricted: false},
      {text: "review submitted work", link: "workspaces", restricted: false},
      {text: "mentor submission", link: "responses", restricted: false},
      {text: "manage classes", link: "sections", restricted: true},
      {text: "manage users", link: "users", restricted: true},
    ],

    find: [
      {text: "assignment", link: "assignments", restricted: false},
      {text: "workspace", link: "workspaces", restricted: false},
      {text: "problem", link: "problems", restricted: false},
      {text: "class", link: "sections.home", restricted: false},
      {text: "users", link: "users", restricted: true},
    ],

    didReceiveAttrs: function () {
      let currentUser = this.get("currentUser");
      this.set("isStudentAccount", currentUser.get("accountType") === "S");
      currentUser.set(
        "avatar",
        this.createUserAvatar(
          currentUser.get("firstName") + " " + currentUser.get("lastName")
        )
      );
    },

    createUserAvatar: function (name) {

      function splitName(name) {
        return name.split(" ").join("+");
      }
      const bgString = "3A97EE";
      const formattedName = splitName(name || "");
      const baseUrl = `https://ui-avatars.com/api/?rounded=true&color=ffffff&background=${bgString}&name=${formattedName}`;
      return baseUrl;
    },

    actions: {
      showToggleModal: function () {
        this.get("alert")
          .showModal(
            "question",
            "Are you sure you want to switch roles?",
            "If you are currently modifying or creating a new record, you will lose all unsaved progress",
            "Ok"
          )
          .then((result) => {
            if (result.value) {
              this.send("toggleActingRole");
            }
          });
      },

      toggleActingRole: function () {
        const currentUser = this.get("currentUser");

        // student account types cannot toggle to teacher role
        if (currentUser.get("accountType") === "S") {
          return;
        }
        const actingRole = currentUser.get("actingRole");
        if (actingRole === "teacher") {
          currentUser.set("actingRole", "student");
        } else {
          currentUser.set("actingRole", "teacher");
        }
        currentUser
          .save()
          .then(() => {
            this.set("actionToConfirm", null);
            this.store.unloadAll("assignment");
            this.sendAction("toHome");
            this.get("alert").showToast(
              "success",
              "Successfully switched roles",
              "bottom-end",
              2500,
              false,
              null
            );
          })
          .catch((err) => {
            this.handleErrors(err, "toggleRoleErrors", currentUser);
            this.set("isToggleError", true);
          });
      },
    },
  }
);
