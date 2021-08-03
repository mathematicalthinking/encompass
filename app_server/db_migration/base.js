const models = require('../datasource/schemas');
const _ = require('underscore');

function getProblemsFromPuzzleIds() {
  return models.Submission.find({ 'publication.puzzle.puzzleId': { $exists: true } })
    .then((subs) => {
      let problems = subs.map((sub) => {
        let res = {
          title: sub.publication.puzzle.title,
          puzzleId: sub.publication.puzzle.puzzleId
        };
        return res;
      });
      let uniques = _.uniq(problems, (prob) => {
        return prob.puzzleId;
      });
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
  return models.Submission.find({ 'publication.puzzle.puzzleId': { $exists: true } })
    .then((subs) => {
      let answers = subs.map((sub) => {
        let ans = {
          studentName: sub.creator.safeName,
          answer: sub.shortAnswer,
          explanation: sub.longAnswer,
          createDate: sub.createDate
        };
        return models.Problem.find({ puzzleId: sub.publication.puzzle.puzzleId })
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
      console.log(answers[0]);
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
  return models.Submission.find({ 'publication.puzzle.puzzleId': { $exists: true } })
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
            sections[clazzId].problems = [sub.publication.puzzle.puzzleId];
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
            if (!_.contains(sections[clazzId].problems, sub.publication.puzzle.puzzleId)) {
              sections[clazzId].problems.push(sub.publication.puzzle.puzzleId);
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
          return models.Problem.find({ puzzleId: prob })
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

function migrate() { // eslint-disable-line no-unused-vars
  getProblemsFromPuzzleIds()
    .then(getSectionsFromSubmissions)
    .then(getAnswersFromSubmissions)
    .catch(console.log);
}
// run this only when loading in new data from POWS
//   or when rebuilding POWS replacements (answers, problems, sections)
// migrate();


