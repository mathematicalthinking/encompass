const utils = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const aiService = require('../../services/ai');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

async function aiDraft(req, res, next) {
  let user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError(
      'You must be logged in to use AI draft functionality.',
      res
    );
  }

  const target = req.query.target;
  const workspace = req.query.workspace;
  const responseMode = req.query.responseMode || 'all';

  if (!target) {
    return utils.sendError.InvalidArgumentError(
      'target submission is required.',
      res
    );
  }

  // Validate response_mode
  const validModes = ['student_only', 'teacher_only', 'all'];
  if (!validModes.includes(responseMode)) {
    return utils.sendError.InvalidArgumentError(
      `Invalid response_mode. Must be one of: ${validModes.join(', ')}`,
      res
    );
  }

  try {
    // Generate AI draft using the AI service with response mode
    const draft = await aiService.generateDraft(
      target,
      responseMode,
      workspace
    );

    const response = {
      target: target,
      responseMode: responseMode,
      message: `AI draft generated for target submission: ${target}`,
      draft,
    };

    return utils.sendResponse(res, response);
  } catch (error) {
    console.error('AI draft generation error:', error);
    return utils.sendError.InternalError(
      error.message || 'Failed to generate AI draft',
      res
    );
  }
}

module.exports.get.aiDraft = aiDraft;
