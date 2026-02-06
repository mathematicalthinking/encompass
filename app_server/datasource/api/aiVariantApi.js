const models = require('../schemas');
const aiService = require('../../services/ai');
const variantConfig = require('../../config/aiVariants');
const utils = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
 * POST /api/aiVariants/generateAll
 * Generate and store all configured variants for a submission
 *
 * Body: {
 *   submissionId: ObjectId,
 *   workspaceId: ObjectId
 * }
 *
 * Returns: {
 *   variants: [AIVariant, AIVariant, AIVariant, AIVariant]
 * }
 */
async function generateAllVariants(req, res, next) {
  if (!req.user) {
    return utils.sendError.InvalidCredentialsError(
      'You must be logged in.',
      res
    );
  }

  const { submissionId, workspaceId } = req.body;

  if (!submissionId || !workspaceId) {
    return utils.sendError.InvalidArgumentError(
      'submissionId and workspaceId are required.',
      res
    );
  }

  try {
    // Check if variants already exist
    const existingVariants = await models.AIVariant.find({
      submission: submissionId,
      isTrashed: false,
    });

    if (existingVariants.length > 0) {
      // Return existing variants instead of regenerating
      return utils.sendResponse(res, {
        variants: existingVariants,
        message: 'Variants already exist for this submission',
      });
    }

    // Generate all configured variants
    const variantPromises = variantConfig.activeVariants.map(
      async (variantDef) => {
        // Call AI service to generate draft
        const startTime = Date.now();
        const draftText = await aiService.generateDraft(
          submissionId,
          variantDef.key,
          workspaceId,
          req.user._id
        );
        const responseTime = Date.now() - startTime;

        // Store variant in database
        const variant = new models.AIVariant({
          submission: submissionId,
          workspace: workspaceId,
          createdBy: req.user._id,
          variantKey: variantDef.key,
          variantLabel: variantDef.label,
          inputType: variantDef.inputType,
          draftText: draftText,
          responseTime: responseTime,
          // metadata from aiService response could be added here
        });

        await variant.save();
        return variant;
      }
    );

    const variants = await Promise.all(variantPromises);

    return utils.sendResponse(res, {
      variants,
      message: `Generated ${variants.length} variants`,
    });
  } catch (error) {
    console.error('Error generating variants:', error);
    return utils.sendError.InternalError(error.message, res);
  }
}

/**
 * GET /api/aiVariants
 * Get variants for a submission or workspace
 *
 * Query: {
 *   submissionId?: ObjectId,
 *   workspaceId?: ObjectId
 * }
 */
async function getVariants(req, res, next) {
  if (!req.user) {
    return utils.sendError.InvalidCredentialsError(
      'You must be logged in.',
      res
    );
  }

  try {
    const query = { isTrashed: false };

    if (req.query.submissionId) {
      query.submission = req.query.submissionId;
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

/**
 * PUT /api/aiVariants/:id
 * Update variant metadata (rating, selection, notes)
 *
 * Body: {
 *   rating?: Number,
 *   isSelected?: Boolean,
 *   teacherNotes?: String
 * }
 */
async function updateVariant(req, res, next) {
  if (!req.user) {
    return utils.sendError.InvalidCredentialsError(
      'You must be logged in.',
      res
    );
  }

  try {
    const variant = await models.AIVariant.findById(req.params.id);

    if (!variant) {
      return utils.sendError.NotFoundError('Variant not found', res);
    }

    // Update allowed fields
    if (req.body.rating !== undefined) {
      variant.rating = req.body.rating;
    }
    if (req.body.isSelected !== undefined) {
      variant.isSelected = req.body.isSelected;
    }
    if (req.body.teacherNotes !== undefined) {
      variant.teacherNotes = req.body.teacherNotes;
    }

    variant.lastModifiedBy = req.user._id;
    variant.lastModifiedDate = Date.now();

    await variant.save();

    return utils.sendResponse(res, { variant });
  } catch (error) {
    console.error('Error updating variant:', error);
    return utils.sendError.InternalError(error.message, res);
  }
}

module.exports.post.generateAllVariants = generateAllVariants;
module.exports.get.aiVariants = getVariants;
module.exports.put.updateVariant = updateVariant;
