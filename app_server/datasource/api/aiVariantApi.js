const models = require('../schemas');
const utils = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');

module.exports.get = {};
module.exports.put = {};

async function getVariants(req, res) {
  try {
    const query = { isTrashed: false };

    if (req.query.submission || req.query.submissionId) {
      query.submission = req.query.submission || req.query.submissionId;
    }
    if (req.query.submissionIds) {
      const ids = req.query.submissionIds.split(',');
      query.submission = { $in: ids };
    }
    if (req.query.workspaceId) {
      query.workspace = req.query.workspaceId;
    }

    const variants = await models.AIVariant.find(query)
      .populate('submission', 'student shortAnswer')
      .populate('createdBy', 'username')
      .sort({ createDate: -1 });

    return utils.sendResponse(res, { variants });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return utils.sendError.InternalError(error.message, res);
  }
}

module.exports.get.aiVariants = getVariants;

async function putVariant(req, res) {
  try {
    const user = userAuth.requireUser(req);
    if (!user) {
      return utils.sendError.InvalidCredentialsError(
        'You must be logged in to update AI variant reviews.',
        res
      );
    }

    const payload =
      req?.body?.aiVariant || req?.body?.variant || req?.body || {};
    const rating = Number(payload.rating);
    const teacherNotes =
      typeof payload.teacherNotes === 'string' ? payload.teacherNotes : '';

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return utils.sendError.InvalidArgumentError(
        'rating is required and must be a number between 1 and 5.',
        res
      );
    }

    if (teacherNotes.trim().length < 10) {
      return utils.sendError.InvalidArgumentError(
        'teacherNotes is required and must be at least 10 characters.',
        res
      );
    }

    const variant = await models.AIVariant.findById(req.params.id).exec();
    if (!variant || variant.isTrashed) {
      return utils.sendResponse(res, null);
    }

    variant.rating = rating;
    variant.teacherNotes = teacherNotes;
    variant.lastModifiedBy = user._id;
    variant.lastModifiedDate = new Date();
    await variant.save();

    return utils.sendResponse(res, { variant });
  } catch (error) {
    console.error('Error updating variant review:', error);
    return utils.sendError.InternalError(error.message, res);
  }
}

module.exports.put.aiVariant = putVariant;
