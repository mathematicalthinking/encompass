var mongoose = require('mongoose'),
    _        = require('underscore'),
    Schema   = mongoose.Schema,
    Buffer   = Schema.Types.Buffer,
    ObjectId = Schema.ObjectId,
    Workspace = require('./workspace');

/**
  * @public
  * @class BaseSubmission
  * @description Abstract base class for all submissions.
*/
var baseSubmission = {
//== Shared properties (Because Monggose doesn't support schema inheritance)
  createdBy: {type:ObjectId, ref:'User'},
  createDate: {type:Date, 'default':Date.now()},
  isTrashed: {type: Boolean, 'default': 0},
//====
  shortAnswer: String,
  longAnswer: String,
  // NEW VALUES
  //student: {type: ObjectId, ref: 'User'},
  // Need to update tests to use answer, breaking pdSet?
  // answer: {type: ObjectId, ref: 'Answer'},
  //problem: {type: ObjectId, ref:'Problem'},
  //section: {type: ObjectId, ref: 'Section'},
  answer: {type: ObjectId, ref: 'Answer'},
  powId: Number,
  creator: {creatorId: Number, studentId: String, username: String, safeName: String},
  clazz: {clazzId: Number, sectionId: String, name: String},
  publication: {publicationId: Number, puzzle: {puzzleId: Number, problemId: String, title: String}},
  thread: {threadId: Number, currentSubmissionId: Number},
  'status': String,
  pdSet: {type: String, 'default': 'default'},
  uploadedFile: {uploadedFileId: Number, savedFileName: String},
};

/**
  * @public
  * @class PDSubmission
  * @description A PD submission is a duplicate of an actual submission for trial purposes.
*/
var pdSubmission = _.extend({}, baseSubmission, {
});

/**
  * @public
  * @class EncompassSubmission
  * @description An Encompass submission is a local copy of a PoW submission. This will now become a grouping of problem, section and answer for each student
*/
var encompassSubmission = _.extend({}, baseSubmission, {
  pdSrcId: {type:ObjectId, ref:'PDSubmission'},
  teachers: [{teacherId: Number, username: String, safeName: String}],
  teacher: {teacherId: Number, username: String, id: String, safeName: String},
  primaryTeacher: {type:ObjectId, ref:'User'},
  selections: [{type:ObjectId, ref:'Selection'}],
  comments: [{type:ObjectId, ref:'Comment'}],
  workspaces: [{type:ObjectId, ref:'Workspace'}],
  responses:  [{type:ObjectId, ref:'Response'}]
});

var PDSubmissionSchema = new Schema(pdSubmission, {versionKey: false});
var EncompassSubmissionSchema = new Schema(encompassSubmission, {
  versionKey: false,
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

/** ENC-467
  * We still expect a primary teacher even when
  * a submission may have multiple
  */
function insertTeacher(doc, ret, options) {
  var isSubDoc = (typeof doc.ownerDocument) === 'function';

  if(!isSubDoc) {
    if(!_.isEmpty(doc.teachers) && _.isEmpty(ret.teacher)) {
      ret.teacher = doc.teachers[0];
    }
  }

  return ret;
}

EncompassSubmissionSchema.set("toObject", {transform: insertTeacher, minimize: false, virtuals: true});
EncompassSubmissionSchema.set("toJSON", {transform: insertTeacher, minimize: false, virtuals: true});


/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
EncompassSubmissionSchema.pre('save', function (next) {
  var toObjectId = function(elem, ind, arr) {
    if( !(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem) ) {
      arr[ind] = mongoose.Types.ObjectId(elem);
    }
  };

  /** + Every ID reference in our object is properly typed.
    *   This needs to be done BEFORE any other operation so
    *   that native lookups and updates don't fail.
    */
  try {
    this.responses.forEach(toObjectId);
    this.selections.forEach(toObjectId);
    this.comments.forEach(toObjectId);
    this.workspaces.forEach(toObjectId);
    next();
  }
  catch(err) {
    next(new Error(err.message));
  }
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
EncompassSubmissionSchema.post('save', function (submission) {
  /* + All related workspaces are updated with the submission */
  mongoose.models.Workspace.update({_id: {$in: submission.workspaces}},
    {$addToSet: { 'submissions': submission,
                  'selections': {$each: submission.selections},
                  'comments': {$each: submission.comments}
                }
    },
    {'multi': true},
    function (err, affected, results) {
      if (err) { throw new Error(err.message); }
    });

  /* + All related selections are updated with the submission */
  mongoose.models.Selection.update({_id: {$in: submission.selections}},
    {$set: { 'submission': submission }},
    {'multi': true},
    function (err, affected, results) {
      if (err) { throw new Error(err.message); }
    });
});

module.exports.PDSubmission = mongoose.model('PDSubmission', PDSubmissionSchema);
module.exports.Submission = mongoose.model('Submission', EncompassSubmissionSchema);
