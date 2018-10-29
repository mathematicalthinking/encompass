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
    oldUser.isTrashed = false;
    oldUser.actingRole = 'student';
    try {
      await oldUser.save();
      console.log(oldUser.username + " saved.");
    } catch (err) {
      console.error(`ERROR saving ${oldUser.username} - ${err}`);
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
  let skipCount = 0;
  let updateCount = 0;
  let publicCount = 0;
  let privateCount = 0;
  let answerWithImages = 0;
  let descWithImages = 0;
  try {
    // try does not catch postgres server not running
    // ToDo - try .then() to catch promise
    const res = await pgClient.query(`select * from pow_submissions ps;`);
    // const res = await pgClient.query(`select ps.id from pow_submissions ps inner join pow_uploaded_files up on up.id = ps.uploaded_file_id offset 0;`);
    // get pow puzzle ids for looping (with multiple promises).
    const resIds = res.rows.map(d => d.id)
    // console.log(`There are ${resIds} resIds`)
    return Promise.all(resIds.map( async (id) => {
      let powSub;
      let problem;
      let encAnswer;
      // console.log(`resid: ${id}`)
      return pgClient.query(`select
        pz.id as puzzleId, pb.publicationlivedate as pubDate,
        pb.solutiontype as pubType, pb.commentary as pubCommentary,
        pb.notepad as pubNotes, pt.status as threadStatus, pt.current_submission as currentSubmission,
        ps.id as subId, ps.status as subStatus, ps.createdate as subDate, ps.shortanswer as shortAnswer,
        ps.longanswer as longAnswer, u.first_name as firstName, u.last_name as lastName,
        up.savedfilename as upImg
        from pow_submissions ps
        left join pow_threads pt on pt.id = ps.thread_id
        left join pow_publications pb on pb.id = pt.publication
        left join pow_puzzles pz on pz.id = pb.puzzle
        left join dir_users u on u.id = ps.creator
        left join pow_uploaded_files up on up.id = ps.uploaded_file_id
        where ps.id = ${id}`)
      .then( (powsSubs) => {
        powSub = powsSubs.rows[0];
        // console.log(`\n powSub['puzzleid']: ${powSub['puzzleid']}`);
        return models.Problem.find({puzzleId: powSub.puzzleId}).exec();
      })
      .then ( (problems) => {
        // find existing encompass problem
        if (problems.length === 0) {
          skipCount += 1;
          return
        } else {
          problem = problems[0];
          // console.log(`\n ${powSub['subid']} ${powSub['puzzleid']} ${problem['title']}`)
          // console.log(`found problem for POWs submission: ${problems[0].title} by ${powSub.firstname} ${powSub.lastname}`);
          if (problem.privacySetting !== 'M') {
            publicCount += 1;
          } else {
            privateCount += 1;
          }
          // console.log(`subid: ${powSub['subid']}`);
          return models.Answer.find({powsSubmId: powSub['subid']}).exec();
        }
      })
      .then ( (answers) => {
        // find existing encompass problem
        if (answers.length > 0) {
          if (answers.length > 1) {
            console.error(`ERROR - found ${answers} existing encompass answers for submission ${powSub.subid}`)
            // console.log(`answers > 1, using first`);
          }
          encAnswer = answers[0];
          // console.log(`found answer for POWs submission ID: ${encAnswer.powsSubmId}`);
          skipCount += 1;
          // console.log(`answers === 1`);
        } else {
          // console.log(`create new answer for ID: ${powSub.subid}, shortanswer: ${powSub.shortanswer}`)
          encAnswer = new models.Answer({
            createdBy: powsUser._id,
            createDate: powSub.subdate,
            problem: problem._id,
            answer: powSub.shortanswer,
            explanation: powSub.longanswer,
            // no section
            // students are by name not encompass user
            studentNames: [ fullName(powSub.firstname, powSub.lastname) ],
            // don't need priorAnswer, correct???
            isSubmitted: (powSub.substatus === "SUBMITTED" ? true : false),
            notes: `Publish Date: ${powSub.pubdate}, Type: ${powSub.pubtype}, Notes: ${powSub.pubnotes}, Commentary: ${powSub.pubcommentary}`,
            powsSubmId: powSub.subid,
            isTrashed: (problem.privacySetting === 'M')
          });
          addCount += 1;
          // console.log(`new answer`);
        }
        // console.log(`\n------------------------------------------------------------`);
        // console.log(`initial encAnswer.explanation: ${encAnswer.explanation}`);
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
        return encAnswer.save();
      })
      .then ( (answer) => {
        updateCount += 1;
        if ( ((updateCount) % 1000) === 0) {
          console.log(`processed ${updateCount} records`)
        }
        return;
      })
      .catch ( (err) => {
        console.log(`createAnswersFromPows query error stack: ${err.stack}`);
      })
    }))
    .then((answerData) => {
      console.log(' answerData length', answerData.length);
    })
    .catch((err) => {
      console.log('err', err);
    });
  } catch (err) {
    console.log(`createAnswersFromPows query error stack: ${err.stack}`);
  }
  console.log(`createAnswersFromPows ${answerWithImages} answers with images`);
  console.log(`createAnswersFromPows ${descWithImages} descriptions with images`);
  console.log(`createAnswersFromPows ${addCount} adds`);
  console.log(`createAnswersFromPows ${skipCount} updates`);
  console.log(`createAnswersFromPows ${publicCount} Public Answers`);
  console.log(`createAnswersFromPows ${privateCount} Private Answers`);
  console.log(`-------------------`);
}


function newAnswer(powsUser, powSub, problem) {
  encAnswer = new models.Answer({
    createdBy: powsUser._id,
    createDate: powSub.subdate,
    problem: problem._id,
    answer: powSub.shortanswer,
    explanation: powSub.longanswer,
    // no section
    // students are by name not encompass user
    studentNames: [ fullName(powSub.firstname, powSub.lastname) ],
    // don't need priorAnswer, correct???
    isSubmitted: (powSub.substatus === "SUBMITTED" ? true : false),
    notes: `Publish Date: ${powSub.pubdate}, Type: ${powSub.pubtype}, Notes: ${powSub.pubnotes}, Commentary: ${powSub.pubcommentary}`,
    powsSubmId: powSub.subid,
    isTrashed: (problem.privacySetting === 'M')
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
    console.log('process.env.POSGRES_PASSWORD: ',process.env.POSGRES_PASSWORD);

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

    // // updates for week of Oct 22
    await createAnswersFromPows(pgClient, powsUser, errorPublicStream, errorPrivateStream);

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
