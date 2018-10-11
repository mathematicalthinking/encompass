Encompass.AddableProblemsMixin = Ember.Mixin.create({
  getAddableProblems: function () {
    const store = this.get('store');
    const syncProblems = this.get('syncProblems');
    let ret = function (query, syncCb, asyncCb) {
      if (query.length === 0 && syncProblems) {
        return asyncCb(syncProblems.toArray());
      }
      let text = query.replace(/\W+/g, "");

      return store.query('problem', {
         filterBy: {
           title: text
         }
        }).then((problems) => {
          return asyncCb(problems.toArray());
        })
        .catch((err) => {
          this.handleErrors(err, 'queryErrors');
        });
    };
    return ret.bind(this);
  },

setAddProblemFunction: function(name) {
  if (!this.get(name)) {
    this.set(name, this.getAddableProblems.call(this));

  }
}
});