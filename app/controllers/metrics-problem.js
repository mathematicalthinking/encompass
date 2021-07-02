Encompass.MetricsProblemController = Ember.Controller.extend({
  showProblemText: false,
  showWorkspaces: false,
  showAnswers: false,
  relevantWorkspaces: [],
  problemAnswers: [],
  actions: {
    toggleProblemText: function () {
      this.toggleProperty("showProblemText");
      this.set('showWorkspaces', false);
      this.set("showAnswers", false);
    },
    findWorkspaces: function () {
      this.get("store").query("workspace", {
        filterBy: {
          "submissionSet.criteria.puzzle.puzzleId": this.get("model.id"),
        },
      })
      .then((res) => {
        this.set("relevantWorkspaces", res);
        this.set("showAnswers", false);
        this.set("showWorkspaces", true);
        this.set("showProblemText", false);
      });
    },
    findWorkspaces2: function(){
      this.get('store').query('workspace', {
        filterBy: {
          'submissionSet.criteria.puzzle.puzzleId': this.get('model.puzzleId')
        }
      }).then(res=>{
        this.set('relevantWorkspaces', res);
        this.set("showAnswers", false);
        this.set("showWorkspaces", true);
        this.set("showProblemText", false);
      });
    },
    findSubmissions: function () {
      this.get("store")
        .query("answer", {
          filterBy: {
            problem: this.get("model.id"),
          },
          didConfirmLargeRequest: true,
        })
        .then((res) => {
          this.set("problemAnswers", res);
          this.set("showAnswers", true);
          this.set("showWorkspaces", false);
          this.set("showProblemText", false);
        });
    },
  },
});

// /api/answers?didConfirmLargeRequest=true&filterBy%5Bproblem%5D=5bac0800ea4c0a230b2c81b0&filterBy%5BstartDate%5D=2003-06-04&filterBy%5BendDate%5D=2021-06-17&filterBy%5BisVmtOnly%5D=false&filterBy%5BisTrashedOnly%5D=false
