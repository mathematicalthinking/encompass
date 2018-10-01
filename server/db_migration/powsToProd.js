const mongoose = require('mongoose');
const pg = require("pg");
// const cheerio = require('cheerio');
// const domParser = require('dom-parser');
const htmlparser = require("htmlparser2");

const models = require('../datasource/schemas');
const _ = require('underscore');
mongoose.Promise = global.Promise;

async function allPuzzlesLoop(pgClient, pows_user) {
  console.log(`Starting allPuzzlesLoop `);
  try {
    // try does not catch postgres server not running
    // ToDo - try .then() to catch promise
    const res = await pgClient.query('SELECT * FROM pow_puzzles;');
    // get pow puzzle ids for looping (with multiple promises).
    const resIds = res.rows.map(d => d.id)
    console.log(`There are ${resIds.length} resIds`)
    for (let id of resIds) {
      console.log(`allPuzzlesLoop pow id: ${id}`);
      // find existing encompass problem, else create new one from pow record
      const problems = await models.Problem.find({puzzleId: id}).exec();
      let problem;
      if (problems.length > 0) {
        problem = problems[0];
        console.log(`found problem in encompass: ${problem.title}, puzzleId: ${problem.puzzleId}`);
      } else {
        console.log(`create new problem`);
        const pows_problem = await pgClient.query(`select * from pow_puzzles where id = ${id}`);
        const pow = pows_problem.rows[0];
        // console.log(`pows_user: ${pows_user}`);
        problem = await new models.Problem({
          createdBy: pows_user,
          title: pow.title,
          puzzleId: pow.id,
          text: pow.text,
          additionalInfo: pow.notepad,
          privacySetting: 'E'
        });
      }
      // update values in problems (e.g. images, category, etc)
      problem.createdBy = pows_user;
      console.log(`set to user: ${problem.createdBy.username}`);
      await insertImagesIntoText(problem.text);
      // save updated values into encompass problems (as obtained)
      try {
        await problem.save();
        console.log(`Saved ${problem.title}`);
      } catch (err) {
        console.error(`ERROR saving ${prob.title} - ${err}`);
      }
  }
  } catch (err) {
    console.log(`allPuzzlesLoop query error stack: ${err.stack}`);
  }
  console.log(`done running allPuzzlesLoop`);
  console.log(`-------------------`);
}


async function cleanPowUsers() {
const users = await models.User.find({username: /\Apows_*/}).exec();
  console.log(`pows users to clean ${users.length}`);
  const userIds = users.map(u => u._id);
  for (let id of userIds) {
    try {
      const u = await models.User.remove({ _id: id}).exec();
    } catch (err) {
      console.error(`ERROR removing ${u.username} - ${err}`)
    }
  }
}


async function getOrCreatePowUser() {
  let users = await models.User.find({username: /\Aold_pows_user\z/}).exec();
  if (users.length > 0) {
    console.log(`user old_pows_user already exists`);
    return users[0];
  } else {
    console.log(`no user with username: pows_old_user`)
    newUser = await new models.User({
      createdBy: "529518daba1cd3d8c4013344", // steve
      username: `old_pows_user`,
      name: 'POWs User',
      isTrashed: true,
      accountType: 'T',
      requestReason: 'temporary POWS user for conversion'
    });
    try {
      await newUser.save();
      console.log(newUser.username + " saved.");
    } catch (err) {
      console.error(`ERROR saving ${newUser.username} - ${err}`);
    }
    return newUser;
  }
}

async function insertImagesIntoText(text) {

  // text = "<div><img src='test1'><img src='test2'><iframe src='test3'>zzz</iframe></div>"
  // console.log(`starting text: ${text}`);

  // // cheerio attempt
  // const ct = cheerio.load(text);
  // let imgs = ct('img');
  // console.log(`length: ${imgs.length}`);
  // console.log(`0: ${imgs[0]}`);
  // console.log(`1: ${imgs[1]}`);
  // // console.log(`html 0: ${imgs[0].html()}`);
  // // console.log(`html 1: ${imgs[1].html()}`);
  // let imgs2 = ct('img').attr('src');
  // console.log(`length: ${imgs2.length}`);
  // console.log(`0: ${imgs2[0]}`);
  // console.log(`1: ${imgs2[1]}`);


  // htmlparser2 attempt
  result = [];
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
      result.push('<' + name + '>');
    },
    onattribute: function(name, value) {
      if (name === 'src') {
        value = "this is changed"
      }
      result.push(' ' + name + '="' + value + '"');
    },
    ontext: function(text){
      result.push('T' + text)
    },
    onclosetag: function(tagname){
      result.push('</' + tagname + '>');
    }
  }, {decodeEntities: true});
  parser.write(text);
  parser.end();
  outStr = '';
  saveAttrs = '';
  result.forEach ( (elem) => {
    switch (elem[0] ) {
      case '<':
        if (saveAttrs.length > 0) {
          outStr += elem.substring(0, elem.length - 1) + saveAttrs + '>';
          saveAttrs = '';
        } else {
          outStr += elem;
        }
        break;
      case ' ':
        saveAttrs += elem;
        break;
      case 'T':
        outStr +=  elem.substring(1);
        break;
      default:
        console.log(`ERROR: invalid stack element ${elem}`);
        break;
    }

  });
  // console.log(`\n\noutStr: ${outStr}`)



  // // dom-parser attempt
  // const rootedText = `<div id='rootedElement'>${text}</div>`
  // var parser = new DomParser();
  // var dom = parser.parseFromString(rootedText);
  // srcTags1 = dom.getElementsByTagName('img');
  // console.log(`dom-parser: length: ${srcTags1.length}`)
  // let saveElem;
  // srcTags1.forEach( (elem) => {
  //   saveElem = elem;
  //   srcAttrib = elem.getAttribute('src');
  //   console.log(`element - ${srcAttrib}`);
  //   // srcAttrib.innerHTML = "what?";
  //   elem.setAttribute('src', 'What?');
  //   console.log(`element - ${srcAttrib}`);
  // })
  // console.log(`dom-parser: : ${srcTags1.length}`)
  // console.log(`updated string: ${dom.getElementById('rootedElement').outerHTML}`)

}

async function imageFileToBase64(file) {
  // return readFilePromise(file).then((data) => {
  //   let newImage = new models.Image(f);
  //   let buffer = new Buffer(data).toString('base64');
  //   let format = `data:image/png;base64,`;
  //   let imgData = `${format}${buffer}`;
  //   newImage.imageData = imgData;
  //   return newImage;
  // })
}



async function update() {
  try {
    console.log(`connect to mongo`);
    mongoose.connect('mongodb://localhost:27017/encompass_prod');
    console.log(`postgres client create`)
    const pgClient = new pg.Client({
      user: 'postgres',
      host: 'localhost',
      database: 'POWS',
      password: '',
      port: 5432,
    });
    pgClient.connect();
    console.log(`pg client connected`);

    await cleanPowUsers();

    const pows_user = await getOrCreatePowUser();
    await allPuzzlesLoop(pgClient, pows_user);


    console.log(`client end`);
    await pgClient.end()
    mongoose.connection.close();
  } catch (err) {
    console.error(`ERROR - ${err}`)
  }
}

update();
