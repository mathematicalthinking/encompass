const mongoose = require('mongoose');
const _ = require('underscore');
const fs = require('fs');

const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/encompass');

async function getSubsWithoutAnswers() {
  try {
    let missingAnswers = 0;
    let missingPowsSubmIds = [];
  const submissions = await models.Submission.find({answer: {$exists: false}, 'thread.currentSubmissionId': {$exists: true, $ne: null}}).lean().exec();
  console.log(`There are ${submissions.length} submissions without an answer field`);

  // use thread.currentSubmissionId to look up corresponding answer in db
      // set answer field on submission model to corresponding answerId;
      // save;

    for (let sub of submissions) {
      let submissionId = sub.thread.currentSubmissionId;
      let encAnswer = await models.Answer.find({powsSubmId: submissionId}).lean().exec();
      if (encAnswer.length === 0) {
        missingPowsSubmIds.push(submissionId);
        missingAnswers++;
      } else if (encAnswer.length > 1) {
        console.log('multiple answers with same powsSubmId: ', submissionId);
      }

    }



    console.log(`There are ${missingAnswers} missing answers`);
    let uniqueMissing = _.uniq(missingPowsSubmIds);
     let json = (JSON.stringify(uniqueMissing));
    console.log(`There are  ${uniqueMissing.length} missing submission ids`);
    fs.writeFile('missingPowsSubs.json', json, 'utf8', (err, data) => {
      if (err) {
        console.log('err write file', err);
      }
    });
  }catch(err) {
    console.log(err);
  }


}

getSubsWithoutAnswers();