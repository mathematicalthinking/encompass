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
  const variant = req.query.variant || 'A'; // Default to variant A

  if (!target) {
    return utils.sendError.InvalidArgumentError(
      'target submission is required.',
      res
    );
  }

  // Validate variant using active server configuration
  const validVariants = variantConfig.activeVariants.map((v) => v.key);
  if (!validVariants.includes(variant)) {
    return utils.sendError.InvalidArgumentError(
      `Invalid variant. Must be one of: ${validVariants.join(', ')}`,
      res
    );
  }

  try {
    // Generate AI draft using the AI service with selected variant
    const draftResult = await aiService.generateDraft(
      target,
      variant,
      workspace,
      user._id
    );
    const requestId = `aiVariant_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    let variantLogId = null;
    const draftText =
      typeof draftResult === 'object' && draftResult?.draft
        ? draftResult.draft
        : draftResult;
    const variantConfigData = variantConfig.activeVariants.find(
      (v) => v.key === variant
    );

    // Save variant to database for export/analysis
    try {
      if (!variantConfigData) {
        console.warn(
          `[AI Variant] No active config found for variant ${variant}; skipping save`
        );
      } else {
        const variantRow = await models.AIVariant.create({
          submission: target,
          workspace: workspace,
          variantKey: variant,
          variantLabel: variantConfigData.label,
          inputType: variantConfigData.inputType,
          draftText: draftText,
          requestId,
          createdBy: user._id,
        });
        variantLogId = variantRow?._id?.toString() || null;
      }
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
              variantKey: variant,
              isTrashed: false,
            },
            {
              $set: {
                workspace,
                variantLabel: variantConfigData.label,
                inputType: variantConfigData.inputType,
                draftText,
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
              `[AI Variant] Reused existing row for ${target}/${variant} after duplicate-key save error`
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
      variant: variant,
      message: `AI draft generated for target submission: ${target}`,
      draft: draftText,
      requestId,
      variantLogId,
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
