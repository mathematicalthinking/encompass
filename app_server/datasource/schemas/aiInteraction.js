const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * @public
 * @class AIInteraction
 * @description Phase 1 logging for AI draft requests (server-side)
 */
var AIInteractionSchema = new Schema(
  {
    //== Shared properties
    createdBy: { type: ObjectId, ref: 'User', required: true },
    createDate: { type: Date, default: Date.now() },
    isTrashed: { type: Boolean, default: false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, default: Date.now() },
    //====

    // Request context
    requestId: { type: String, required: true },
    submission: { type: ObjectId, ref: 'Submission', required: true },
    workspace: { type: ObjectId, ref: 'Workspace' },
    variant: { type: String, default: 'D' },
    requestTimestamp: { type: Date },

    // Payload (optional for Phase 1)
    draftText: { type: String },

    // Phase 2 - user actions
    rating: { type: Number, min: 1, max: 5 },
    writtenFeedback: { type: String },
    regenerationPrompt: { type: String },
    usageIntent: [{ type: String }],
    lastAction: { type: String },
    lastActionAt: { type: Date },
    finalAction: { type: String },

    // Regeneration tracking
    isSuperseded: { type: Boolean, default: false },
    supersededBy: { type: ObjectId, ref: 'AIInteraction' },
    supersededAt: { type: Date },
  },
  { versionKey: false }
);

AIInteractionSchema.index({ requestId: 1 }, { unique: true });
AIInteractionSchema.index({ submission: 1, createDate: -1 });
AIInteractionSchema.index({ workspace: 1, createDate: -1 });

module.exports.AIInteraction = mongoose.model(
  'AIInteraction',
  AIInteractionSchema
);
