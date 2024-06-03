// app/services/addable-problems.js

import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class AddableProblemsService extends Service {
  @service store;

  getAddableProblems(query, syncProblems) {
    if (query.length === 0 && syncProblems) {
      return syncProblems.toArray();
    }
    let text = query.replace(/\W+/g, '');

    return this.store
      .query('problem', {
        filterBy: {
          title: text,
        },
      })
      .then((problems) => {
        return problems.toArray();
      })
      .catch((err) => {
        // Handle errors if necessary
        console.error(err);
        throw err;
      });
  }

  setAddProblemFunction(name) {
    if (!this[name]) {
      this[name] = this.getAddableProblems.bind(this);
    }
  }
}
