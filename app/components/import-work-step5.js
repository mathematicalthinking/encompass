/*global _:false */
Encompass.ImportWorkStep5Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
    elementId: 'import-work-step5',
    creatingWs: Ember.computed.equal("doCreateWs", true),
    creatingAssignment: Ember.computed.equal("createAssignmentValue", true),
    utils: Ember.inject.service('utility-methods'),
    workspaceOwner: null,
    workspaceMode: null,
    folderSet: null,
    assignmentName: null,
    createWs: {
      groupName: "createWs",
      required: true,
      inputs: [
        {
          value: true,
          label: "Yes"
        },
        {
          value: false,
          label: "No"
        }
      ]
    },
    createAssignment: {
      groupName: "createAssignment",
      required: true,
      inputs: [
        {
          value: true,
          label: "Yes"
        },
        {
          value: false,
          label: "No"
        }
      ]
    },
    ownerOptions: function() {
      if (this.get("users")) {
        return this.get("users").map(user => {
          return {
            id: user.get("id"),
            username: user.get("username")
          };
        });
      }
      return [];
    }.property("users.[]"),
    modeInputs: function() {
      let res = {
        groupName: "mode",
        required: true,
        inputs: [
          {
            value: "private",
            label: "Private",
            moreInfo:
              "Workspace will only be visible to the owner and collaborators"
          },
          {
            value: "org",
            label: "My Org",
            moreInfo:
              "Workspace will be visible to everyone belonging to your org"
          },
          {
            value: "public",
            label: "Public",
            moreInfo: "Workspace will be visible to every Encompass user"
          }
        ]
      };

      if (
        this.get("currentUser.isStudent") ||
        !this.get("currentUser.isAdmin")
      ) {
        return res;
      }

      res.inputs.push({
        value: "internet",
        label: "Internet",
        moreInfo:
          "Workspace will be accesible to any user with a link to the workspace"
      });
      return res;
    }.property("currentUser.isStudent", "currentUser.isAdmin"),

    initialOwnerItem: function() {
      const selectedOwner = this.get("selectedOwner");
      if (selectedOwner && this.get("utils").isNonEmptyObject(selectedOwner)) {
        return [selectedOwner.id];
      }
      return [];
    }.property("selectedOwner"),


    initialFolderSetItem: function() {
      const selectedFolderSet = this.get("selectedFolderSet");
      if (this.get("utils").isNonEmptyObject(selectedFolderSet)) {
        return [selectedFolderSet.id];
      }
      return [];
    }.property("selectedFolderSet"),

    willDestroyElement: function() {
      this.set("doCreateWs", this.get("doCreateWs"));
      this.set("createAssignmentValue", this.get("createAssignmentValue"));
      this.set("selectedMode", this.get("selectedMode"));
      this.set("workspaceName", this.get("workspaceName"));
    },

    actions: {
      updateSelectizeSingle(val, $item, propToUpdate, model) {
        if (_.isNull($item)) {
          this.set(propToUpdate, null);
          return;
        }
        let record = this.get("store").peekRecord(model, val);
        if (!record) {
          return;
        }
        this.set(propToUpdate, record);
      },
      createWorkspace() {
        this.set("workspaceName", this.get("workspaceName"));
        this.set("workspaceOwner", this.get("selectedOwner"));
        this.set("workspaceMode", this.get("selectedMode"));
        this.set("folderSet", this.get("selectedFolderSet"));
        if (
          !this.get("workspaceName") ||
          !this.get("selectedOwner") ||
          !this.get("selectedMode")
        ) {
          this.set(
            "createWorkspaceError",
            "Please provide required information"
          );
        } else {
          this.set("createWorkspaceError", null);
          this.get("onProceed")();
        }
      },
      next() {
        if (this.get("createAssignmentValue")) {
          this.set("assignmentName", this.get("assignmentName"));
        } else {
          this.set("assignmentName", null);
        }
        if (this.get("doCreateWs")) {
          this.send("createWorkspace");
        } else {
          this.set("workspaceName", null);
          this.set("workspaceOwner", null);
          this.set("workspaceMode", null);
          this.set("folderSet", null);
          this.get("onProceed")();
        }
        //check for assignment and set assignmentName
      },
      back() {
        this.get("onBack")(-1);
      }
    }
  }
);