Encompass.MetricsProblemController = Ember.Controller.extend({
  showProblemText: false,
  relevantWorkspaces: [],
  problemSubmissions: [],
  actions: {
    toggleProblemText: function () {
      this.toggleProperty("showProblemText");
    },
    findWorkspaces: function () {
      this.get("store").query("workspace", {
        filterBy: {
          "submissionSet.criteria.puzzle.puzzleId": this.get("model.id"),
        },
      })
      .then((res) => {
        console.log(res);
        this.set("relevantWorkspaces", res);
      });
    },
    findWorkspaces2: function(){
      this.get('store').query('workspace', {
        filterBy: {
          'submissionSet.criteria.puzzle.puzzleId': this.get('model.puzzleId')
        }
      }).then(res=>{
        console.log(res);
        this.set('relevantWorkspaces', res);
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
          console.log(res);
          this.set("problemSubmissions", res);
        });
    },
  },
});

// /api/answers?didConfirmLargeRequest=true&filterBy%5Bproblem%5D=5bac0800ea4c0a230b2c81b0&filterBy%5BstartDate%5D=2003-06-04&filterBy%5BendDate%5D=2021-06-17&filterBy%5BisVmtOnly%5D=false&filterBy%5BisTrashedOnly%5D=false
