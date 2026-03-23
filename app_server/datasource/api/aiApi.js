// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI API MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
const utils = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const aiService = require('../../services/ai');
const models = require('../schemas');
const variantConfig = require('../../config/aiVariants');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

const LEGACY_VARIANT_ALIASES = Object.freeze({
  C: 'E',
  D: 'F',
});

const normalizeRequestedVariant = (rawVariant = 'A') => {
  const requestedVariant = String(rawVariant || 'A').trim().toUpperCase();
  const storageVariant =
    LEGACY_VARIANT_ALIASES[requestedVariant] || requestedVariant;

  return {
    requestedVariant,
    storageVariant,
    wasAliased: requestedVariant !== storageVariant,
  };
};

async function aiDraft(req, res) {
  let user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError(
      'You must be logged in to use AI draft functionality.',
      res
    );
  }

  const target = req.query.target;
  const workspace = req.query.workspace;
  const { requestedVariant, storageVariant, wasAliased } =
    normalizeRequestedVariant(req.query.variant || 'A');

  if (!target) {
    return utils.sendError.InvalidArgumentError(
      'target submission is required.',
      res
    );
  }

  // Validate variant using active server configuration
  const validVariants = variantConfig.activeVariants.map((v) => v.key);
  if (!validVariants.includes(storageVariant)) {
    return utils.sendError.InvalidArgumentError(
      `Invalid variant. Must be one of: ${validVariants.join(', ')} (legacy aliases: C->E, D->F)`,
      res
    );
  }

  try {
    const variantConfigData = variantConfig.activeVariants.find(
      (v) => v.key === storageVariant
    );
    if (!variantConfigData) {
      return utils.sendError.InvalidArgumentError(
        `No variant configuration found for: ${storageVariant}`,
        res
      );
    }
    const upstreamVariant =
      variantConfigData.upstreamVariant || variantConfigData.key;

    // Generate AI draft using the AI service with selected variant
    const draftResult = await aiService.generateDraft(
      target,
      upstreamVariant,
      workspace,
      user._id,
      {
        inputType: variantConfigData.inputType,
        useRag: Boolean(variantConfigData.useRag),
      }
    );
    const requestId = `aiVariant_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    let variantLogId = null;
    const draftText =
      typeof draftResult === 'object' && draftResult?.draft
        ? draftResult.draft
        : draftResult;
    const sentAnnotations = Array.isArray(draftResult?.sentAnnotations)
      ? draftResult.sentAnnotations
      : [];

    // Save variant to database for export/analysis
    try {
      const variantRow = await models.AIVariant.create({
        submission: target,
        workspace: workspace,
        variantKey: storageVariant,
        variantLabel: variantConfigData.label,
        inputType: variantConfigData.inputType,
        ragEnabled: Boolean(variantConfigData.useRag),
        draftText: draftText,
        sentAnnotations,
        requestId,
        createdBy: user._id,
      });
      variantLogId = variantRow?._id?.toString() || null;
    } catch (saveError) {
      const isDuplicateKey =
        saveError?.code === 11000 ||
        (typeof saveError?.message === 'string' &&
          saveError.message.includes('E11000 duplicate key error'));

      if (isDuplicateKey && variantConfigData) {
        // Compatibility fallback for environments that still enforce one row per
        // (submission, variantKey). We reuse that row so review logging can proceed.
        try {
          const fallbackRow = await models.AIVariant.findOneAndUpdate(
            {
              submission: target,
              variantKey: storageVariant,
              isTrashed: false,
            },
            {
              $set: {
                workspace,
                variantLabel: variantConfigData.label,
                inputType: variantConfigData.inputType,
                ragEnabled: Boolean(variantConfigData.useRag),
                draftText,
                sentAnnotations,
                requestId,
                lastModifiedBy: user._id,
                lastModifiedDate: new Date(),
              },
              $setOnInsert: {
                createdBy: user._id,
              },
            },
            {
              new: true,
              upsert: true,
              setDefaultsOnInsert: true,
            }
          )
            .select('_id')
            .exec();

          variantLogId = fallbackRow?._id?.toString() || null;

          if (variantLogId) {
            console.warn(
              `[AI Variant] Reused existing row for ${target}/${storageVariant} after duplicate-key save error`
            );
          }
        } catch (fallbackError) {
          console.error(
            '[AI Variant] Duplicate-key fallback failed while saving variant:',
            fallbackError
          );
        }
      }

      if (!variantLogId) {
        console.error('[AI Variant] Failed to save variant:', saveError);
      }
    }
    const response = {
      target: target,
      variant: storageVariant,
      requestedVariant,
      upstreamVariant,
      message: `AI draft generated for target submission: ${target}`,
      draft: draftText,
      requestId,
      variantLogId,
      inputType: variantConfigData.inputType,
      useRag: Boolean(variantConfigData.useRag),
    };
    if (wasAliased) {
      response.variantAliasApplied = `${requestedVariant}->${storageVariant}`;
    }

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
