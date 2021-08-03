import Mixin from '@ember/object/mixin';

export default Mixin.create({
  getAddableProblems: function () {
    const store = this.store;
    const syncProblems = this.syncProblems;
    let ret = function (query, _syncCb, asyncCb) {
      if (query.length === 0 && syncProblems) {
        return asyncCb(syncProblems.toArray());
      }
      let text = query.replace(/\W+/g, '');

      return store
        .query('problem', {
          filterBy: {
            title: text,
          },
        })
        .then((problems) => {
          return asyncCb(problems.toArray());
        })
        .catch((err) => {
          this.handleErrors(err, 'queryErrors');
        });
    };
    return ret.bind(this);
  },

  setAddProblemFunction: function (name) {
    if (!this.get(name)) {
      this.set(name, this.getAddableProblems.call(this));
    }
  },
});
