// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
const utils = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const aiService = require('../../services/ai');
const models = require('../schemas');
const variantConfig = require('../../config/aiVariants');
const logger = require('log4js').getLogger('ai');

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
  const requestId = `aiDraft_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const requestTimestamp = new Date().toISOString();

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
    const draftResult = await aiService.generateDraft(
      target,
      variant,
      workspace,
      user._id
    );

    // Save variant to database for export/analysis
    try {
      const variantConfigData = variantConfig.activeVariants.find(
        (v) => v.key === variant
      );

      if (!variantConfigData) {
        return;
      }

      const existingVariant = await models.AIVariant.findOne({
        submission: target,
        variantKey: variant,
        isTrashed: false,
      });

      const draftText =
        typeof draftResult === 'object' && draftResult?.draft
          ? draftResult.draft
          : draftResult;
      if (!existingVariant) {
        await models.AIVariant.create({
          submission: target,
          workspace: workspace,
          variantKey: variant,
          variantLabel: variantConfigData.label,
          inputType: variantConfigData.inputType,
          draftText: draftText,
          createdBy: user._id,
        });
      } else {
        existingVariant.draftText = draftText;
        existingVariant.lastModifiedDate = new Date();
        existingVariant.lastModifiedBy = user._id;
        await existingVariant.save();
      }
    } catch (saveError) {
      console.error('[AI Variant] Failed to save variant:', saveError);
    }

    const draftText =
      typeof draftResult === 'object' && draftResult?.draft
        ? draftResult.draft
        : draftResult;

    // Phase 1 logging stub (server-side)
    logger.info('[AI LOG] aiDraft request', {
      requestId,
      submissionId: target,
      workspaceId: workspace || null,
      variant,
      timestamp: requestTimestamp,
      draftText: draftText || null,
    });

    let interactionId = null;
    try {
      const interaction = await models.AIInteraction.create({
        createdBy: user._id,
        submission: target,
        workspace: workspace || null,
        variant,
        requestId,
        requestTimestamp: new Date(requestTimestamp),
        draftText: draftText || null,
      });
      interactionId = interaction?._id || null;
    } catch (logError) {
      logger.error('[AI LOG] Failed to persist aiDraft log', logError);
    }

    const response = {
      target: target,
      variant: variant, // A/B TEST: Include variant in response
      message: `AI draft generated for target submission: ${target}`,
      draft: draftText,
      interactionId,
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

async function updateAIInteraction(req, res, next) {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError(
      'You must be logged in.',
      res
    );
  }

  const interactionId = req.params.id;
  if (!interactionId) {
    return utils.sendError.InvalidArgumentError(
      'AI interaction id is required.',
      res
    );
  }

  try {
    const interaction = await models.AIInteraction.findById(interactionId);
    if (!interaction) {
      return utils.sendError.NotFoundError('AI interaction not found.', res);
    }

    if (
      interaction.createdBy &&
      interaction.createdBy.toString() !== user._id.toString()
    ) {
      return utils.sendError.NotAuthorizedError(
        'You do not have permission.',
        res
      );
    }

    const { action, rating, writtenFeedback, usageIntent, finalAction } =
      req.body || {};

    if (action) {
      interaction.lastAction = action;
      interaction.lastActionAt = new Date();
    }

    if (typeof rating === 'number') {
      interaction.rating = rating;
    }

    if (typeof writtenFeedback === 'string') {
      interaction.writtenFeedback = writtenFeedback;
    }

    if (Array.isArray(usageIntent)) {
      interaction.usageIntent = usageIntent;
    }

    if (finalAction) {
      interaction.finalAction = finalAction;
    }

    interaction.lastModifiedBy = user._id;
    interaction.lastModifiedDate = new Date();

    await interaction.save();

    return utils.sendResponse(res, { interaction });
  } catch (error) {
    logger.error('[AI LOG] Failed to update AI interaction', error);
    return utils.sendError.InternalError(
      error.message || 'Failed to update AI interaction',
      res
    );
  }
}

module.exports.put.aiInteraction = updateAIInteraction;
