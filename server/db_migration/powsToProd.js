const mongoose = require('mongoose');
const pg = require("pg");
// const cheerio = require('cheerio');
// const domParser = require('dom-parser');
const htmlparser = require("htmlparser2");
var fs = require('fs');

const models = require('../datasource/schemas');
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
    let newUser = await new models.User({
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


async function allPOWsProblemsPrivate() {
  let oldCount = 0;
  let deletedCount = 0;
  const problems = await models.Problem.find({}).exec();
  console.log(`problems to review ${problems.length}`);
  const problemIds = problems.map(p => p._id);
  for (let id of problemIds) {
    try {
      const p = await models.Problem.find({ _id: id}).exec();
      const prob = p[0];
      if (prob.puzzleId) {
        console.log(`problem: ${prob.title} has puzzleId: ${prob.puzzleId} - count ${oldCount}`);
        if (prob.isTrashed === true && prob.title.includes("KenKen")) {
          deletedCount += 1;
          await models.Problem.remove({ _id: id}).exec();
          console.log(`problem: ${prob.title} was trashed KenKen - was deleted`);
        } else {
          oldCount += 1;
          prob.copyrightNotice = 'National Council of Teachers of Mathematics';
          prob.sharingAuth = 'Used with the permission of NCTM.';
          prob.privacySetting = 'M';
          await prob.save();
        }
      } else {
        console.log(`problem: ${id} ${prob.title} has no puzzle`);
      }
    } catch (err) {
      console.error(`ERROR resetting problem ${id} - ${err}`)
    }
  }
  console.log(`problems deleted ${deletedCount}`);
  console.log(`problems updated ${oldCount}`);
}


async function listProblemPrivacy() {
  let oldCount = 0;
  const problems = await models.Problem.find({}).exec();
  console.log(`problems to review ${problems.length}`);
  const problemIds = problems.map(p => p._id);
  for (let id of problemIds) {
    try {
      const p = await models.Problem.find({ _id: id}).exec();
      const prob = p[0];
      if (prob.puzzleId) {
        oldCount += 1;
        console.log(`problem: ${prob.title} has puzzleId: ${prob.puzzleId} - privacySetting: ${prob.privacySetting}`);
      } else {
        console.log(`problem: ${id} ${prob.title} has no puzzle - privacySetting: ${prob.privacySetting}`);
      }
    } catch (err) {
      console.error(`ERROR resetting problem ${id} - ${err}`)
    }
  }
}


async function countProblemPrivacy() {
  let oldCount = 0;
  const problemsE = await models.Problem.find({privacySetting: 'E'}).exec();
  console.log(`Public Problems count: ${problemsE.length}`);
  const problemsM = await models.Problem.find({privacySetting: 'M'}).exec();
  console.log(`Private Problems count: ${problemsM.length}`);
}


async function unusedProblemsPrivate() {
  const submissions = await models.Submission.find({}).exec();
  console.log(`submissions to review ${submissions.length}`);
  const submissionIds = submissions.map(s => s._id);
  for (let id of submissionIds) {
    try {
      const s = await models.Submission.find({ _id: id}).exec();
      const sub = s[0];
      if (sub.publication && sub.publication.puzzle) {
        // console.log(`submission: ${id} has puzzle: ${sub.publication.puzzle.puzzleId} - ${sub.publication.puzzle.title}`);
        const prob = await models.Problem.findOne({'puzzleId': sub.publication.puzzle.puzzleId}).exec();
        // console.log(`problem: ${prob._id} has puzzle: ${prob.puzzleId} - ${prob.privacySetting} - ${prob.title}`);
        prob.privacySetting = 'E';
        await prob.save();
      } else {
        console.log(`submission: ${id} ${sub.powId} has no puzzle`);
      }
    } catch (err) {
      console.error(`ERROR privatizing submission id: ${id} - ${err}`)
    }
  }
}


async function setUserActingRole() {
  const users = await models.User.find({}).exec();
  const usersIds = users.map(u => u._id);
  let fixedCount = 0;
  let okCount = 0;
  let errorCount = 0;
  for (let id of usersIds) {
    try {
      const u = await models.User.find({ _id: id}).exec();
      const user = u[0];
      if (user.accountType !== 'S' &&  !['teacher', 'student'].includes(user.actingRole) ) {
        // invalid acting role for teacher, set it to teacher
        user.actingRole = 'teacher';
        try {
          user.save();
          fixedCount += 1;
          console.log (`Fixed ${user.username}`);
        } catch (e) {
          console.log (`ERROR fixing ${user.username}`);
          errorCount += 1;
        }
      } else {
        okCount += 1;
      }
    } catch (err) {
      console.error(`ERROR looping through users`);
    }
  }
  console.log(`Users Acting Role fixed count: ${fixedCount}`);
  console.log(`Users Acting Role OK count: ${okCount}`);
  console.log(`Users Acting Role ERROR count: ${errorCount}`);
}


async function setProblemAuthor(pgClient) {
    console.log(`Starting setProblemAuthor `);
    try {
      // try does not catch postgres server not running
      // ToDo - try .then() to catch promise
      const res = await pgClient.query('SELECT * FROM pow_puzzles;');
      // get pow puzzle ids for looping (with multiple promises).
      const resIds = res.rows.map(d => d.id)
      console.log(`There are ${resIds.length} resIds`)
      for (let id of resIds) {
        console.log(`------------------------------`);
        console.log(`setProblemAuthor pow id: ${id}`);
        const pows_problem = await pgClient.query(`select pz.title as title, u.first_name as fname, u.last_name as lname from pow_puzzles pz left join dir_users u on u.id = pz.creator where pz.id = ${id}`);
        const pow = pows_problem.rows[0];
        // find existing encompass problem, else create new one from pow record
        const problems = await models.Problem.find({puzzleId: id}).exec();
        let problem;
        if (problems.length > 0) {
          problem = problems[0];
          // console.log(`found problem in encompass: ${problem.title}, puzzleId: ${problem.puzzleId}`);
          // update values in problems (e.g. images, category, etc)
          let auth = '';
          if (pow.fname) {
            auth = pow.fname;
            if (pow.lname){
              auth += ` ${pow.lname}`;
            }
          } else if (pow.lname) {
            auth = pow.lname;
          } else {
            auth = 'Guest';
          }
          problem.author = auth;
          console.log(`problem: ${pow.title}, author: ${auth}`);
          // save updated values into encompass problems (as obtained)
          try {
            await problem.save();
            console.log(`Saved ${problem.title}`);
          } catch (err) {
            console.error(`ERROR saving ${prob.title} - ${err}`);
          }
        } else if (pow.title.includes("KenKen")) {
          // ignore KenKen problems
          console.log (`Ignore KenKen problem`);
        } else {
          console.error(`ERROR - Missing problem: ${problem._id} ${problem.title}`)
        }
      }
    } catch (err) {
      console.log(`setProblemAuthor query error stack: ${err.stack}`);
    }
    console.log(`done running setProblemAuthor`);
    console.log(`-------------------`);
  }

  function insertImagesIntoText2(text, errorStream, probTitle) {
    // console.log(`\n--------------\nOriginal HTML: ${text}`)
    result = [];
    let imgSrc = 0;
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
        result.push('<' + name + '>');
      },
      onattribute: function(name, value) {
        const origUrl = value;
        let imageFilePath;
        if (name == 'src') {
          imgSrc += 1;
          // console.log(`url: ${origUrl}`)
          if (origUrl.substring(0, 21) === 'data:image/png;base64') {
            // console.log (`Img already converted`);
            // imageFilePath = imgDirRoot + origUrl.substring(22);
            result.push('Image already converted')
          } else if (origUrl.length === 0) {
            console.log (`ERROR image blanked out`);
            // imageFilePath = imgDirRoot + origUrl.substring(22);
            result.push('ERROR image blanked out')
          } else {
            urlParts = origUrl.split('/');
            justFileName = urlParts[urlParts.length - 1];
            imageFilePath = imgDirRoot + 'missing/' + justFileName;
            value = imageFileToBase64(imageFilePath);
            // console.log(`urlParts: ${urlParts}, justFileName: ${justFileName}, img length: ${value.length}`);
            if (value !== '') {
              result.push(`Update image for ${origUrl}`);
            } else {
              result.push(`Ignore no matching missing image ${probTitle} for ${origUrl}`)
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
      let imgIgnores = 0;
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
            console.log(`Reconstitute Error ${elem}`);
            errorStream.write(elem);
            imgErrs += 1;
            break;
          case 'K':
            // // dont print kenken in error stream file
            // console.log(elem);
            // // errorStream.write(elem);
            // imgErrs += 1;
            imgIgnores += 1;
            break;
          case 'I':
            imgIgnores += 1;
            // console.log(`Reconstitute Ignore ${elem}`)
            break;
          case 'U':
            console.log(`${probTitle} - ${elem}`)
            break;
          default:
          imgErrs += 1;
          console.log(`Reconstitute ERROR: invalid stack element ${elem}`);
            break;
        }
      });
      if (imgErrs > 0 ) {
        console.error(`ERROR: missing image(s)`)
        return ''; // missing images error
      } else if (imgIgnores > 0) {
        return ''; // Ignore these problems
      } else if (imgSrc === 0) {
        return ''; // Ignore problems with no image sources
      } else {
        // console.log(`\n--------------\nFinal HTML: ${outStr}`)
        return outStr; // no errors
      }
    } catch (e) {
      console.error(`ERROR: ${e}`);
      return ''; // have errors
    }
  }


  async function updateMiscPics(pgClient, pows_user, errorStream) {
    console.log(`Starting updateMiscPics `);
    let updateCount = 0;
    try {
      // try does not catch postgres server not running
      // ToDo - try .then() to catch promise
      const res = await pgClient.query('SELECT * FROM pow_puzzles;');
      // get pow puzzle ids for looping (with multiple promises).
      const resIds = res.rows.map(d => d.id)
      console.log(`There are ${resIds.length} resIds`)
      for (let id of resIds) {
        // console.log(`------------------------------`);
        // console.log(`setProblemAuthor pow id: ${id}`);
        const pows_problem = await pgClient.query(`select pz.title as title, u.first_name as fname, u.last_name as lname from pow_puzzles pz left join dir_users u on u.id = pz.creator where pz.id = ${id}`);
        const pow = pows_problem.rows[0];
        // find existing encompass problem, else create new one from pow record
        const problems = await models.Problem.find({puzzleId: id}).exec();
        let problem;
        if (problems.length > 0) {
          problem = problems[0];
          newText = insertImagesIntoText2(problem.text, errorStream, problem.title);
          if (newText.length > 0) {
            // console.log(`Update ${problem.title}`);
            // console.log(`found problem in encompass: ${problem.title}, puzzleId: ${problem.puzzleId}`);
            problem.text = newText;
            // save updated values into encompass problems (as obtained)
            try {
              await problem.save();
              // console.log(`Saved ${problem.title}, ${problem.text}`);
              updateCount += 1
            } catch (err) {
              console.error(`ERROR saving ${problem.title} - ${err}`);
            }
          } else {
            // console.log(`Ignore - not missing image: ${problem._id} ${problem.title}`)
          }
        } else {
          if (!pow.title.includes("KenKen")) {
            console.error(`Error?? Missing Problem??`)
          }
        }
      }
    } catch (err) {
      console.log(`updateMiscPics query error stack: ${err.stack}`);
    }
    console.log(`done running updateMiscPics with ${updateCount} updates`);
    console.log(`-------------------`);
  }


async function update() {
  try {

    // // open connection to encompass database (production)
    console.log(`connect to mongo`);
    mongoose.connect('mongodb://localhost:27017/encompass_prod');

    // open connection to POWs Postgres Database
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

    // create error stream
    const errorStream = fs.createWriteStream("errorProblems.txt");

    // create pows_user
    const pows_user = await getOrCreatePowUser();

    // // original conversions code here
    // await allPuzzlesLoop(pgClient, pows_user, errorStream);

    // // Updates Done week of 9/28/2018
    // // Puzzles added as problems owned by 'old pows user'
    // // Puzzle image sources set as base64 text
    // await cleanPowUsers();

    // // updates for week of Oct 5
    // await allPOWsProblemsPrivate();
    // // await listProblemPrivacy();
    // await countProblemPrivacy();
    // await unusedProblemsPrivate();
    // await countProblemPrivacy();

    // // updates for week of Oct 11
    // await setUserActingRole();

    // updates for week of Oct 16
    // await setProblemAuthor(pgClient);
    await updateMiscPics(pgClient, pows_user, errorStream);

    // close error stream
    errorStream.end();

    // close POWs Postgres connection
    console.log(`client end`);
    await pgClient.end()

    // close mongo connection to encompass
    mongoose.connection.close();

  } catch (err) {
    console.error(`ERROR - ${err}`);
  }
}

update();
