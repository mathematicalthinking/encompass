const utils = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const AIService = require('../../services/ai');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

const aiService = new AIService();

async function aiDraft(req, res, next) {
  let user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError(
      'You must be logged in to use AI draft functionality.',
      res
    );
  }

  const target = req.query.target;
  const context = req.query.context;

  if (!target) {
    return utils.sendError.InvalidArgumentError(
      'target submission is required.',
      res
    );
  }

  try {
    // Parse context parameter - it could be a comma-separated string or array
    let contextArray = [];
    if (context) {
      if (Array.isArray(context)) {
        contextArray = context;
      } else if (typeof context === 'string') {
        contextArray = context
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id.length > 0);
      }
    }

    // Generate AI draft using the AI service
    const draft = await aiService.generateDraft(target, contextArray);

    const response = {
      target: target,
      contextLength: contextArray.length,
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
