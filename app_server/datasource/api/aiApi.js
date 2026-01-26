// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
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
  const variant = req.query.variant || 'A'; // A/B TEST: Default to variant A

  if (!target) {
    return utils.sendError.InvalidArgumentError(
      'target submission is required.',
      res
    );
  }

  // A/B TEST: Validate variant (A/B/C/D input combinations)
  const validVariants = ['A', 'B', 'C', 'D'];
  if (!validVariants.includes(variant)) {
    return utils.sendError.InvalidArgumentError(
      `Invalid variant. Must be one of: ${validVariants.join(', ')}`,
      res
    );
  }

  try {
    // A/B TEST: Generate AI draft using the AI service with variant
    const draft = await aiService.generateDraft(
      target,
      variant,
      workspace,
      user._id
    );

    const response = {
      target: target,
      variant: variant, // A/B TEST: Include variant in response
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
