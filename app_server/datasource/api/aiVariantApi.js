const models = require('../schemas');
const utils = require('../../middleware/requestHandler');

module.exports.get = {};

async function getVariants(req, res, next) {
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
