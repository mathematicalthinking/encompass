const mongoose = require('mongoose');
const pg = require("pg");
// const cheerio = require('cheerio');
// const domParser = require('dom-parser');
const htmlparser = require("htmlparser2");
var fs = require('fs');

const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

require('dotenv').config();

const imgDirRoot = '/Users/davidtaylor/Documents/synched_21/mathematicalThinking/EnCoMPASS/data/pow_images/'
const answerDirRoot = '/Users/davidtaylor/Documents/synched_21/mathematicalThinking/EnCoMPASS/data/jpuzzler-uploads/'
// // no good trying to run this with image loading on server. It ran out of room with these file on it.
// const imgDirRoot = '../data/pow_images/'
// const answerDirRoot = '../data/jpuzzler-uploads/'

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
    oldUser = users[0];
    // make sure oldUser is not trashed
    if (oldUser.isTrashed || oldUser.actingRole !== 'student') {
      oldUser.isTrashed = false;
      oldUser.actingRole = 'student';
      try {
        await oldUser.save();
        console.log(oldUser.username + " saved.");
      } catch (err) {
        console.error(`ERROR saving ${oldUser.username} - ${err}`);
      }
    }
    return oldUser;

  } else {
    console.log(`no user with username: pows_old_user`)
    let newUser = await new models.User({
      createdBy: "529518daba1cd3d8c4013344", // steve
      username: `old_pows_user`,
      name: 'POWs User',
      isTrashed: false,
      accountType: 'T',
      actingRole: 'student',
      requestReason: 'POWS user for conversion'
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

function fullName(fName, lName) {
  let name = '';
  if (fName) {
    name = fName;
    if (lName){
      name += ` ${lName}`;
    }
  } else if (lName) {
    name = lName;
  } else {
    name = 'Guest';
  }
  return name;
}



function imageToBase64(origUrl) {
  let imageFileName = '';
  let imgBase64 = '';
  let imgPush = '';
  if (origUrl.substring(0, 21) === 'data:image/png;base64') {
    imgBase64 = '';
    imgPush = 'Image already converted';
  } else if (origUrl.length === 0) {
    imgBase64 = '';
    imgPush = 'ERROR image has blank src';
  } else if (origUrl.substring(0, 20) === 'http://mathforum.org') {
    // math forum file (should be local)
    imageFileName = origUrl.substring(21);
  } else if (origUrl.substring(0, 1) === '/' || origUrl.substring(0, 1) === '.') {
    // local file
    imageFileName = origUrl.substring(1);
  } else {
    // url
    imageFileName = origUrl.substring(0);
  }
  if (imageFileName !== '') {
    // console.log(`Check in imgDirRoot for ${imgDirRoot + imageFileName}`)
    imgBase64 = imageFileToBase64(imgDirRoot + imageFileName);
    if (imgBase64 === '') {
      // console.log(`Check in answerDirRoot for ${answerDirRoot + imageFileName}`)
      imgBase64 = imageFileToBase64(answerDirRoot + imageFileName);
      if (imgBase64 === '') {
        // console.log(`Check in imgDirRoot missing for ${imgDirRoot + 'missing/' + imageFileName}`)
        imgBase64 = imageFileToBase64(imgDirRoot + 'missing/' + imageFileName);
      } else {
        imgPush = `\nERROR missing ${imageFileName} from ${origUrl}`;
      }
    } else {
    }
  } else {
  }
  return {imgB64: imgBase64, push: imgPush};
}


function insertImagesIntoAnswers(text, errorPublicStream, errorPrivateStream, problem) {
  // console.log(`\n--------------\nOriginal HTML: ${text}`)
  result = [];
  let imgSrc = 0;
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
      result.push('<' + name + '>');
    },
    onattribute: function(name, value) {
      // Note: always push the name and value
      // if first pushing a string with
      // -- leading 'E', flagged as error
      // -- leading 'I', flagged to ignore
      if (name == 'src') {
        imgSrc += 1;
        let imgRet = imageToBase64(value);
        // console.log(`\nreturned ${imgRet.imgB64}, ${imgRet.push} from imageToBase64`)
        if (imgRet.imgB64 !== '') {
          value = imgRet.imgB64;
        }
        if (imgRet.push !== '') {
          result.push(imgRet.push);
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
          if (problem.privacySetting !== 'M') {
            errorPublicStream.write(elem);
          } else {
            errorPrivateStream.write(elem);
          }
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
          // console.log(`${problem.title} - ${elem}`)
          break;
        default:
        imgErrs += 1;
        console.log(`Reconstitute ERROR: invalid stack element ${elem}`);
          break;
      }
    });
    if (imgErrs > 0 ) {
      console.error(`ERROR: missing image(s)`)
      return text; // missing images error, return original text
    } else if (imgIgnores > 0) {
      return text; // Ignore these problems, return original text
    } else if (imgSrc === 0) {
      return text; // Ignore problems with no image sources, return original text
    } else {
      // console.log(`\n--------------\nFinal HTML: ${outStr}`)
      return outStr; // no errors
    }
  } catch (e) {
    console.error(`ERROR: ${e}`);
    return text; // have errors, return original text
  }
}


async function createAnswersFromPows(pgClient, powsUser, errorPublicStream, errorPrivateStream) {
  console.log(`Starting createAnswersFromPows `);
  let addCount = 0;
  let updateCount = 0;
  let skipCount = 0;
  let publicCount = 0;
  let privateCount = 0;
  let answerWithImages = 0;
  let descWithImages = 0;
  let startTime = new Date();
  let finishTime = new Date();
  let showDetails =
  false;
  if (process.argv[4] === 'details') {
    showDetails = true;
  }
  console.log(`showDetails: ${showDetails}`)
  try {
    // try does not catch postgres server not running
    // ToDo - try .then() to catch promise
    const findProblem = {};
    const problems = await models.Problem.find({}).exec();
    console.log(`problems.length: ${problems.length}`)
    for (let problem of problems) {
      findProblem[problem.puzzleId] = { privacy: problem.privacySetting, id: problem._id };
    }

    console.log(`findProblem.length: ${Object.keys(findProblem).length}`)

    console.log(`processing offset: ${process.argv[2]} - ${process.argv[3]}`)
    // const res = await pgClient.query(`select * from pow_submissions ps offset ${process.argv[2]} limit ${process.argv[3]};`);
    const resps = await pgClient.query(`
    select
    pz.id as puzzleId, pb.publicationlivedate as pubDate,
    pb.solutiontype as pubType, pt.status as threadStatus,
    pt.current_submission as currentSubmission,
    ps.id as subId, ps.status as subStatus, ps.createdate as subDate,
    ps.shortanswer as shortAnswer, ps.longanswer as longAnswer, ps.notepad as subNotes,
    u.first_name as firstName, u.last_name as lastName,
    up.savedfilename as upImg
    from pow_submissions ps
    left join pow_threads pt on pt.id = ps.thread_id
    left join pow_publications pb on pb.id = pt.publication
    left join pow_puzzles pz on pz.id = pb.puzzle
    left join dir_users u on u.id = ps.creator
    left join pow_uploaded_files up on up.id = ps.uploaded_file_id
    order by ps.id
    offset ${process.argv[2]} limit ${process.argv[3]};`);
    // where ps.id = any('{999143,990173,510438,574297,575792,579604,575393,579411,579335,575985,575995,572601,579587,574607,574928,575983,575051,573320,573318,970776,970779,970777,970778,970621,970680,970745,970670,970623,971098,971086,970628,971172,970626,970622,970634,970629,970649,970646,971002,971080,971049,970637,970638,970669,970772,970664,970682,970775,971054,970661,971052,970663,971058,970659,970674,970749,970696,970693,970692,970694,970697,970695,970624,970641,970639,970756,970762,971762,970810,971125,970817,971324,970840,971030,971026,970852,970851,971022,971036,971348,971021,970888,971016,971105,971101,971111,971350,971401,971289,971123,971282,971818,971361,971373,971503,971504,971647,971926,971583,971766,973411,970631,971334,970769,971038,973447,970959,970857,971083,971708,972183,971372,972739,971606,971386,971639,971702,972466,971965,971712,973049,972856,972888,972625,973174,973184,973142,973183,973075,973350,973422,973281,973212,973402,973419,973373,973474,974691,974692,973687,971799,973196,974566,973198,974958,972812,972166,972171,972167,972169,972748,972366,973207,972574,974562,972553,973167,973650,973653,973669,974549,972747,972649,972650,972816,974752,972791,972804,973382,974943,974597,973041,973237,973085,973647,973851,973737,974008,975174,973923,974361,975623,974618,974598,974809,974908,975153,975233,973515,976211,974959,973369,975998,973535,974120,974971,975363,975625,975736,975384,975383,977311,976076,975855,975780,977168,978634,977185,978630,978551,978633,978797,978823,986083,986084,986085,986086,986087,986088,986089,986090,985510,982707,985512,982454,985609,983534,983476,983570,983474,983576,983730,983595,985092,983930,985093,985096,985098,985099,985294,984308,984284,984747,984309,984077,983958,984307,984302,984310,984390,984311,983969,984330,983991,984329,984323,984331,983978,983985,985231,984333,983993,984434,984347,984339,984338,984345,984001,984336,984342,984071,984340,984007,984632,984006,984005,984356,984018,984015,984357,984361,984070,985157,984303,984183,984283,984289,984293,984297,984294,984295,984304,984341,984634,985179,985521,985437,985462,985461,985457,985494,985515,985506,985605,985514,985534,985593,985576,985555,985617,987707,987758,985518,985656,985578,985664,985748,985682,987735,987786,987736,987728,987724,987768,987743,987738,987740,987790,987776,987787,987788,987791,987344,986746,987249,986980,987451,987438,987546,988066,987436,987443,987462,988077,987457,987946,987948,988072,987463,988594,987524,987551,987545,987549,987550,988558,987548,987922,987553,987947,988076,987969,988450,988449,988447,988445,988448,988456,988455,988452,988453,988454,988461,988458,988460,988457,988489,988466,988490,988464,988465,988462,988488,988468,988487,988472,988467,988475,988474,990008,988820,987920,989957,988528,988526,988510,988589,988597,989536,989394,990014,989045,989925,989920,989537,989956,990315,989984,989978,991059,992291,990308,992304,992305,991073,992298,992292,992289,991043,992301,991101,991089,991087,991095,991092,991103,991096,991094,991112,991110,991117,991118,991108,991131,991120,991114,991111,991130,991119,990884,991125,991128,991133,991113,991115,991146,990902,991150,990907,991147,991148,990908,991256,991286,991319,990912,991465,991472,992585,991428,992002,992153,992464,991480,993396,992135,992647,992145,993406,992471,993395,992089,993398,992007,992462,992474,992683,992751,993060,993410,995424,986624,980537,981494,995229,995629,995630,995627,995628,995631,995634,995633,995635,995636,995632,995641,995638,995646,995645,995637,995650,995647,995649,996157,996162,996159,996169,996161,996163,996165,996166,996167,996171,996173,996295,996296,996298,996300,996302,996309,997224,996293,996155,996335,996334,996337,996338,996341,996342,982057,996351,996292,980673,980400,981823,981495,982962,981555,981604,982176,996404,996390,996398,996400,996399,981496,996700,997553,997341,997315,997344,997342,997291,997346,997352,997350,997351,997349,997353,997403,996736,995719,995078,995326,997228,997264,996748,996742,997818,997659,994898,994511,996318,995526,995970,995963,995964,995966,996122,996106,995965,995971,994955,995998,995973,995986,995992,995980,995984,995978,995745,995988,996003,994994,996015,996008,996007,996028,996020,994998,996021,995010,996030,996024,995002,996023,996019,996041,995027,995288,995023,995286,996049,995029,996451,996445,995437,996396,995713,995604,995529,995859,995844,996245,996488,996484,997579,997361,996769,356757,995675,997948,997565,998189,998192,998191,998194,998200,998197,997995,998105,998102,998111,998112,998115,997759,999286,999606,998208,999193,999224,999516,999288,998201,998206,998199,998061,998066,998064,998063,998065,998067,998331,997270,998235,996571,996220,998290,997891,998082,998292,999026,999086,999167,998937,999079,999230,999221,999210,999204,999202,999226,999799,999265,999975,999865,1000230,1000503,1000492,1000471,1000617,999435,999421,999423,999419,999420,999424,999426,999425,999429,999297,999305,999303,999302,999304,999520,999306,999308,999307,999309,999525,999528,999522,999523,999524,999526,999527,999879,999885,999882,999883,999881,999886,999887,999866,999797,999679,999862,999870,999996,999978,999973,999984,999681,999893,999871,999798,999872,999974,1000000,1000005,999979,1000015,1000016,999726,999727,999986,1000041,998190,998509,998279,998989,1000014,999877,998681,1000056,999201,999172,999171,1000036,1000073,1000024,999271,999785,999640,999615,1000018,999795,999791,1000006,999969,1000053,1000054,984113,986321,1000007,1000282,1000069,1000059,984692,999503,987105,997454,996852,996596,974837,974963,974696,975572,973122,973746,973129,971697,972955,974968,973679,972839,973431,979821,972836,999507,976429,975034,999542,984170,999540,975570,999544,997755,999543,999620,996452,996266,996489,999206,997390,997402,974194,974330,974344,974198,981553,571725,570664,570897,571079,570694}'::int[]);    `);
    // console.log(`There are ${resIds.length} resIds`)
    for (let powSub of resps.rows) {
      startTime = Object.assign(finishTime);

      if (powSub) {
        // const powSub = powsSubs.rows[0];
        // find existing encompass problem
        let encAnswer;
        const problem = findProblem[powSub['puzzleid']];
        // we found the problem
        if (problem) {
          if (problem['privacy'] !== 'M') {
            publicCount += 1;
          } else {
            privateCount += 1;
          }
          const answers = await models.Answer.find({powsSubmId: powSub.subid}).exec();
          // find existing encompass answer
          if (answers.length > 0) {
            if (answers.length > 1) {
              console.error(`ERROR - found ${answers.length} existing encompass answers for submission ${powSub.subid}`)
            }
            encAnswer = answers[0];
            // console.log(`found answer for POWs submission ID: ${encAnswer.powsSubmId}`);
            if (showDetails) console.log(`submission id ${powSub.subid} skipped - answer exists`)
            updateCount += 1;
          } else {
            let hasAnswer = true;
            if (!powSub.shortanswer
              || powSub.shortanswer.length < 1
              || powSub.shortanswer.includes('student looked at puzzle without submitting')
            ) {
              hasAnswer = false;
            }
            let hasExplanation = true;
            if ( !powSub.longanswer
              || powSub.longanswer.length < 1
            ) {
              hasExplanation = false;
            }
            if (hasAnswer || hasExplanation) {
              // console.log(`create new answer for ID: ${powSub.subid}, shortanswer: ${powSub.shortanswer}`)
              encAnswer = newAnswer(powsUser, powSub, problem);
              // insert any images into short answer
              encAnswer.answer = insertImagesIntoAnswers(powSub.shortanswer, errorPublicStream, errorPrivateStream, problem);
              // insert any images into explanation (long answer)
              encAnswer.explanation = insertImagesIntoAnswers(powSub.longanswer, errorPublicStream, errorPrivateStream, problem);
              // if an upload image is provided, attach it to the end of the explanation (long answer)
              if (powSub.upimg) {
                let imgRet = imageToBase64(powSub.upimg);
                if (imgRet.imgB64 !== '') {
                  // console.log(`summission with image: ${powSub.subid}`)
                  encAnswer.explanation = `<div id="origAnswer">${powSub.longanswer}</div><div id="uploadedImg"><img src="${imgRet.imgB64}"/></div>`
                }
              }
              addCount += 1;
              try {
                await encAnswer.save();
                // console.log(encAnswer.powsSubmId + " saved.");
              } catch (err) {
                console.error(`ERROR saving ${encAnswer.powsSubmId} - ${err}`);
              }
              if (showDetails) console.log(`submission id ${powSub.subid} saved`)
            } else {
              if (showDetails) console.log(`submission id ${powSub.subid} skipped - empty`)
              skipCount += 1;
            }
          }
        } else {
          // if no problem, then we do not want an answer (we dropped KenKen problems)
          // if (showDetails) console.log(`${powSub['puzzleid']} skipped - problem not found`)
          if (showDetails) console.log(`submission id ${powSub.subid} skipped - no problem`)
          skipCount += 1;
        }
        // console.log(`\n------------------------------------------------------------`);
        // console.log(`answer ${encAnswer.powsSubmId} to problem "${problem.title}"`)
      }
      // feedback mechanism to indicate progress on conversion
      finishTime = new Date();
      const diffDate = new Date(finishTime - startTime);
      if ( ((addCount+skipCount+updateCount) % 1000) === 0) {
        console.log(`processed ${addCount+skipCount+updateCount} -> ${startTime.getMinutes()}:${startTime.getSeconds()} - ${finishTime.getMinutes()}:${finishTime.getSeconds()} = ${diffDate.getMinutes()}:${diffDate.getSeconds()}`);
      }
    }
    console.log(`should be done`);
  } catch (err) {
    console.log(`createAnswersFromPows query error stack: ${err.stack}`);
  }
  console.log(`createAnswersFromPows ${answerWithImages} answers with images`);
  console.log(`createAnswersFromPows ${descWithImages} descriptions with images`);
  console.log(`createAnswersFromPows ${addCount} adds`);
  console.log(`createAnswersFromPows ${skipCount} skips`);
  console.log(`createAnswersFromPows ${updateCount} updates`);
  console.log(`createAnswersFromPows ${publicCount} Public Answers`);
  console.log(`createAnswersFromPows ${privateCount} Private Answers`);
  console.log(`-------------------`);
}


function newAnswer(powsUser, powSub, problem) {
  encAnswer = new models.Answer({
    createdBy: powsUser._id,
    createDate: powSub.subdate,
    problem: problem['id'],
    answer: powSub.shortanswer,
    explanation: powSub.longanswer,
    // no section
    // students are by name not encompass user
    studentNames: [ fullName(powSub.firstname, powSub.lastname) ],
    // don't need priorAnswer, correct???
    isSubmitted: (powSub.substatus === "SUBMITTED" ? true : false),
    notes: powSub.subNotes,
    powsSubmId: powSub.subid,
    isTrashed: problem['privacy'] === 'M'
  });
  return encAnswer;
}


async function update() {
  try {

    // // open connection to encompass database (production)
    console.log(`connect to mongo`);
    // // attempt to avoid open deprecation warning - fail
    // const monConn = await mongoose.createConnection().openUri('mongodb://localhost:27017/encompass');
    mongoose.connect('mongodb://localhost:27017/encompass_staging', (err) => {
      if (err) {
        // note this is not working!
        console.error(`ERROR, cannot connect to mongodb: ${err}`);
        process.exit(1);
      }
    });

    // open connection to POWs Postgres Database
    console.log(`postgres client create`)

    const pgClient = new pg.Client({
      user: 'postgres',
      host: 'localhost',
      database: process.env.POWS_DATABASE,
      password: process.env.POSGRES_PASSWORD,
      port: 5432,
    });
    pgClient.connect();
    console.log(`pg client connected`);

    // create error stream
    // const errorStream = fs.createWriteStream("errorProblems.txt");
    const errorPublicStream = fs.createWriteStream("errorPublicProblemImages.txt");
    const errorPrivateStream = fs.createWriteStream("errorPrivateProblemImages.txt");

    // create pows_user
    const powsUser = await getOrCreatePowUser();

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

    // // updates for week of Oct 16
    // await setProblemAuthor(pgClient);
    // await updateMiscPics(pgClient, pows_user, errorStream);

    // // updates for weeks of Oct 15 - Nov 8
    await createAnswersFromPows(pgClient, powsUser, errorPublicStream, errorPrivateStream);
    // await updateAnswersImages(pgClient, powsUser, errorPublicStream, errorPrivateStream);

    // close error stream
    // errorStream.end();
    errorPublicStream.end();
    errorPrivateStream.end();

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
