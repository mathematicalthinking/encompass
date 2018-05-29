const models = require('../datasource/schemas');
const _ = require('underscore');

function getProblemsFromPowIds() {
  return models.Submission.find({ powId: { $exists: true } })
    .then((subs) => {
      let problems = subs.map((sub) => {
        return { name: `PoW #${sub.powId}` };
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
        let ans = {
          studentName: sub.creator.safeName,
          answer: sub.shortAnswer,
          explanation: sub.longAnswer,
        };
        return models.Problem.find({ name: `PoW #${sub.powId}` })
          .then((prob) => {
            ans.problemId = prob[0]._id;
            return models.Section.find({ sectionId: sub.clazz.clazzId })
              .then((sect) => {
                if (sect.length > 0) {
                  ans.sectionId = sect[0]._id;
                } else {
                  ans.sectionId = null;
                }
                return ans;
              });
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
          students: tup[1].students
        };

        let probIds = tup[1].problems.map((prob) => {
          return models.Problem.find({ name: prob })
            .then((prob) => {
              return prob[0]._id;
            });
        });

        return Promise.all(probIds)
          .then((ids) => {
            sect.problems = ids;
            return;
          })
          .then(() => {
            let teacherIds = tup[1].teachers.map((username) => {
              return models.User.find({ username: username })
                .then((user) => {
                  return user[0]._id;
                });
            });

            return Promise.all(teacherIds)
              .then((ids) => {
                sect.teachers = ids;
                return sect;
              });
          });
      });

      return Promise.all(inserts)
        .then((sects) => {
          return models.Section.insertMany(sects, (err, sections) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Inserted ${sections.length} sections.`);
            }
          });
        });
    })
    .catch(err => console.log(err));
}

function migrate() {
  getProblemsFromPowIds()
    .then(getSectionsFromSubmissions)
    .then(getAnswersFromSubmissions)
    .catch(console.log);
}
migrate();


