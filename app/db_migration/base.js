const models = require('../schemas');
const _ = require('underscore');

function getPowSubmissions(cb) {
  models.Submission.find({ powId: { $exists: true } })
    .then((submissions) => {
      cb(submissions);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getProblemsFromPowIds() {
  return models.Submission.find({ powId: { $exists: true } })
    .then((subs) => {
      let problems = subs.map((sub) => {
        let prob = models.Problem({ name: `PoW #${sub.powId}` });
        return prob;
      });
      let uniques = _.uniq(problems);
      models.Problem.insertMany(uniques, (err, probs) => {
        if (err) {
          console.log(err);
        }
        console.log(`Inserted ${probs.length} problems.`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAnswersFromSubmissions() {
  return models.Submission.find({ powId: { $exists: true } })
    .then((subs) => {
      let answers = subs.map((sub) => {
        return models.Problem.find({ name: `PoW #${sub.powId}` })
          .then((prob) => {
            return {
              name: sub.creator.safeName,
              answer: sub.shortAnswer,
              explanation: sub.longAnswer,
              section: sub.clazz.name || null,
              problem: prob[0]._id,
            };
          });
      });
      return Promise.all(answers);
    })
    .then((answers) => {
      models.Answer.insertMany(answers, (err, answers) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Inserted ${answers.length} answers.`);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getSectionsFromSubmissions() {
  return models.Submission.find({ powId: { $exists: true } })
    .then((subs) => {
      let sections = {};
      subs.forEach((sub) => {
        let clazzId = sub.clazz.clazzId;
        if (clazzId) {
          if (!sections[clazzId]) {
            sections[clazzId] = {};
            sections[clazzId].name = sub.clazz.name;
            sections[clazzId].teachers = [sub.teacher.username];
            sections[clazzId].students = [sub.creator.safeName];
            sections[clazzId].problems = [`PoW #${sub.powId}`];
          } else {
            if (!sections[clazzId].name) {
              sections[clazzId].name = sub.clazz.name;
            }
            if (!_.contains(sections[clazzId].teachers, sub.teacher.username)) {
              sections[clazzId].teachers.push(sub.teacher.username);
            }
            if (!_.contains(sections[clazzId].students, sub.creator.safeName)) {
              sections[clazzId].students.push(sub.creator.safeName);
            }
            if (!_.contains(sections[clazzId].problems, `PoW #${sub.powId}`)) {
              sections[clazzId].problems.push(`PoW #${sub.powId}`);
            }
          }
        }
      });

      let tuples = Object.entries(sections);
      let inserts = tuples.map((tup) => {
        let sect = {
          sectionId: tup[0],
          name: tup[1].name,
          teachers: tup[1].teachers,
          students: tup[1].students,
          problems: tup[1].problems
        };
        return sect;
      });

      return models.Section.insertMany(inserts, (err, sections) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Inserted ${sections.length} sections.`);
        }
      });
    })
    .catch(err => console.log(err));
}

function migrate() {
  getProblemsFromPowIds()
    .then(getAnswersFromSubmissions)
    .then(getSectionsFromSubmissions)
    .catch(console.log);
}
//migrate();


