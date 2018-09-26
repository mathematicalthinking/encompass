const mongoose = require('mongoose');
const pg = require("pg");

const models = require('../datasource/schemas');
const _ = require('underscore');
mongoose.Promise = global.Promise;

async function allPuzzlesLoop(pgClient) {
  console.log(`Starting allPuzzlesLoop `);
  try {
    const res = await pgClient.query('SELECT * FROM pow_puzzles;');
    const resIds = res.rows.map(d => d.id)
    console.log(`There are ${resIds.length} resIds`)
    // for (let id of colDocIds) {
    //   let doc = await coll.findById(id).exec();

    // res.rows.forEach( (elem) => {
    for (let id of resIds) {
      console.log(`allPuzzlesLoop pow id: ${id}`);
      const problems = await models.Problem.find({puzzleId: id}).exec();
      if (problems.length > 0) {
        console.log(`found problem: ${problems[0].title}`);
      } else {
        console.log(`create new problem`);
        const pows_problem = await pgClient.query(`select * from pow_puzzles where id = ${id}`);
        const problem = pows_problem.rows[0];
        const pows_user = await getOrCreateUserByPowUserId(problem.id);
        // console.log(`pows_user: ${pows_user}`);
        let prob = await new models.Problem({
          createdBy: "529518daba1cd3d8c4013344", // steve
          title: problem.title,
          puzzleId: problem.id,
          text: problem.text,
          // teaser short and long
          // answer_check
          // online resource page with its many links ???
          // sourceUrl: { type: String },
          additionalInfo: problem.notepad,
          privacySetting: 'E'
          //categories: [{ type: ObjectId, ref: 'Category' }]
        });
        try {
          await prob.save();
          console.log(problem.title + " saved.");
        } catch (err) {
          console.error(`ERROR saving ${prob.title} - ${err}`)
        }
      }
    }
  } catch (err) {
    console.log(`allPuzzlesLoop query error stack: ${err.stack}`);
  }
  console.log(`done running allPuzzlesLoop`);
  console.log(`-------------------`);
}

async function getOrCreateUserByPowUserId(powUserId) {
  let users = models.User;
  let user = await users.find({username: `pows_${powUserId}`}).exec();
  if (user.length > 0) {
    console.log(`powUserId ${powUserId} already exists`);
    // console.log(`resulting user: ${user}`)
    return user;
  } else {
    console.log(`no user with username: pows_${powUserId}`)
    newUser = await new users({
      createdBy: "529518daba1cd3d8c4013344", // steve
      username: `pows_${powUserId}`,
      isTrashed: true,
      accountType: 'T',
      requestReason: 'temporary POWS user for conversion'
    });
    try {
      await newUser.save();
      console.log(newUser.username + " saved.");
    } catch (err) {
      console.error(`ERROR saving ${newUser.username} - ${err}`)
    }
    // console.log(`saved newUser: ${newUser}`)
    return newUser;
  }

}


async function update() {
  console.log(`connect to mongo`);
  mongoose.connect('mongodb://localhost:27017/encompass_prod');
;
  console.log(`postgres client create`)
  const pgClient = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'POWS',
    password: '',
    port: 5432,
  });
  console.log(`pg client connect`);
  pgClient.connect();

  await allPuzzlesLoop(pgClient);


  console.log(`client end`);
  await pgClient.end()
  mongoose.connection.close();
}

update();
