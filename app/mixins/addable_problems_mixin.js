Encompass.AddableProblemsMixin = Ember.Mixin.create({
  getAddableProblems: function () {
    const store = this.get('store');
    let ret = function (query, syncCb, asyncCb) {
      let text = query.replace(/\W+/g, "");
      return store.query('problem', {
         filterBy: {
           title: text
         }
        }).then((problems) => {
          if (!problems) {
            return [];
          }

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