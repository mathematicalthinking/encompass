const mongoose = require('mongoose');
const _ = require('underscore');
const sharp = require('sharp');
const base64Img = require('base64-img');
const fs = require('fs');

const htmlparser = require("htmlparser2");


const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

//  mongoose.connect('mongodb://localhost:27017/encompass');

 let sizeThreshold = 1000000;
 let pngbase64Id = 'data:image/png;base64';
 let jpgbase64Id = 'data:image/jpeg;base64';

 function parseImageData(expl) {
   let result = [];

  let parser = new htmlparser.Parser({
onopentag: function(name, attr) {

  result.push('<' + name);

  _.each(attr, (val, key) => {
    result.push(` ${key}="${val}"`);
  });
  result.push('>');
},

ontext: function(text) {
  result.push(text);
},
onclosetag: function(tagname) {
  if (tagname !== 'img') {
    result.push('</' + tagname + '>');
  }
},
  }, {decodeEntities: true});

  parser.write(expl);
  parser.end();
  return result;
 }
 async function resizeLargeImages() {
   try {
    let answers = await models.Answer.find({
      explanation: {$exists: true, $ne: null},
      $expr: { $gt: [ { $strLenCP: "$explanation" }, sizeThreshold ] }

    });
    console.log(`There are ${answers.length} answers whose explanation is longer than ${sizeThreshold} characters`);

    let oldPowsAnswers = answers.filter((a => a.powsSubmId));

    console.log(`There are ${oldPowsAnswers.length} old Pows Answers whose explanation is longer than ${sizeThreshold} characters`);

    let newAnswers = answers.filter(a => !a.powsSubmId);
    console.log('newAnswerIds', newAnswers.map(a => a._id));

    let parsedArrays = newAnswers.map((ans) => {
      let parsedExplanationArray = parseImageData(ans.explanation);
      let resizedExplanation = parsedExplanationArray.map(async (el) => {
        if (typeof el === 'string' && el.slice(0,25).includes('data:image')) {
          let imageType = el.slice(0,25).includes('png') ? 'png' : 'jpeg';
          console.log('found image to convert!');

          let buildDir = 'build';

          if (process.env.BUILD_DIR) {
            buildDir = process.env.BUILD_DIR;
          }
          const saveDir = `./${buildDir}/image_uploads/tmp_pngs`;
          fs.access(saveDir, fs.constants.F_OK, (err) => {
            if (err) {
              console.error(`ERROR - PNG Images directory ${saveDir} does not exist`);
            }
          });
          let path = base64Img.imgSync(el.slice(6), saveDir, Date.now());

          let resizedBuffer = await sharp(path).resize(500).toBuffer();
          let resizedBase64 = resizedBuffer.toString('base64');

          let format = `data:image/${imageType};base64,`;
          let imgData = `${format}${resizedBase64}`;
          let ret = `src="${imgData}"`;
          return ret;
        } else {
          return el;
        }
      });
      return Promise.all(resizedExplanation)
      .then((exp) => {
        let joined = exp.join('');
        ans.explanation = joined;
        return ans.save();
      });
    });
    return Promise.all(parsedArrays);
   }catch(err) {
     console.error(`Error resizeLArgeImages: ${err}`);
   }
 }



function migrate() {
  return resizeLargeImages().then((res) => {
  //  console.log(`migrated ${res} editors`);
  console.log('success', res.length);
   mongoose.connection.close();
   console.log('done!');
  })
  .catch((err) => {
    console.log('err', err);
  });
}

// migrate();

module.exports.parseImageData = parseImageData;