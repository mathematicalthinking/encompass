const mongoose = require('mongoose');
const pg = require("pg");
// const cheerio = require('cheerio');
// const domParser = require('dom-parser');
const htmlparser = require("htmlparser2");
var fs = require('fs');

const models = require('../datasource/schemas');
const _ = require('underscore');
mongoose.Promise = global.Promise;

const imgDirRoot = '/Users/davidtaylor/Documents/synched_21/mathematicalThinking/EnCoMPASS/data/pow_images/'

async function allPuzzlesLoop(pgClient, pows_user, errorStream) {
  console.log(`Starting allPuzzlesLoop `);
  try {
    // try does not catch postgres server not running
    // ToDo - try .then() to catch promise
    const res = await pgClient.query('SELECT * FROM pow_puzzles;');
    // get pow puzzle ids for looping (with multiple promises).
    const resIds = res.rows.map(d => d.id)
    console.log(`There are ${resIds.length} resIds`)
    for (let id of resIds) {
      console.log(`------------------------------`);
      console.log(`allPuzzlesLoop pow id: ${id}`);
      // find existing encompass problem, else create new one from pow record
      const problems = await models.Problem.find({puzzleId: id}).exec();
      let problem;
      if (problems.length > 0) {
        problem = problems[0];
        // console.log(`found problem in encompass: ${problem.title}, puzzleId: ${problem.puzzleId}`);
      } else {
        // console.log(`create new problem`);
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
      newHtml = insertImagesIntoText(problem.text, errorStream, problem.title);
      if (newHtml) {
        problem.isTrashed = false;
        problem.text = newHtml;
      } else {
        problem.isTrashed = true;
      }
      // save updated values into encompass problems (as obtained)
      try {
        console.log(`trashed: ${problem.isTrashed}`)
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

function insertImagesIntoText(text, errorStream, probTitle) {
  // console.log(`\n--------------\nOriginal HTML: ${text}`)
  result = [];
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
      result.push('<' + name + '>');
    },
    onattribute: function(name, value) {
      const origUrl = value;
      let imageFilePath;
      if (name == 'src') {
        console.log(`url: ${origUrl}`)
        if (origUrl.substring(0, 20) === 'http://mathforum.org') {
          imageFilePath = imgDirRoot + origUrl.substring(21);
        } else {
          imageFilePath = imgDirRoot + origUrl.substring(1);
        }
        value = imageFileToBase64(imageFilePath);
        if (value === '') {
          // dont print kenken in error stream file
          if (origUrl.substring(0, 27) === 'http://mathforum.org/kenken') {
            result.push(`K ERROR: POW kenken puzzle ${probTitle} Missing image file: ${origUrl}\n`)
          } else {
            result.push(`ERROR: POW puzzle ${probTitle} Missing image file: ${origUrl}\n`)
          }
        }
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
  try {
    parser.write(text);
    parser.end();
    let imgErrs = 0;
    let outStr = '';
    let saveAttrs = '';
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
        case 'E':
          // print missing images in error stream file
          console.log(elem);
          errorStream.write(elem);
          imgErrs += 1;
          break;
        case 'K':
          // dont print kenken in error stream file
          console.log(elem);
          // errorStream.write(elem);
          imgErrs += 1;
          break;
        default:
          console.log(`ERROR: invalid stack element ${elem}`);
          break;
      }
    });
    if (imgErrs > 0) {
      console.error(`ERROR: missing image(s)`)
      return ''; // missing images error
    } else {
      // console.log(`\n--------------\nFinal HTML: ${outStr}`)
      return outStr; // no errors
    }
  } catch (e) {
    console.error(`ERROR: ${e}`);
    return ''; // have errors
  }
}


function imageFileToBase64(file) {
  try {
    let data = fs.readFileSync(file);
    if (data) {
      let buffer = new Buffer(data).toString('base64');
      let format = `data:image/png;base64,`;
      let imgData = `${format}${buffer}`;
      // console.log(`imgData: ${imgData}`);
      return imgData;
    } else {
      return '';
    }
  } catch (err) {
    return '';
  }
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

    // error log file:
    const errorStream = fs.createWriteStream("errorProblems.txt");


    await cleanPowUsers();

    const pows_user = await getOrCreatePowUser();
    await allPuzzlesLoop(pgClient, pows_user, errorStream);

    errorStream.end();
    console.log(`client end`);
    await pgClient.end()
    mongoose.connection.close();
  } catch (err) {
    console.error(`ERROR - ${err}`)
  }
}

update();
