const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * @public
 * @class AIVariant
 * @description Stores AI-generated feedback variants for A/B testing and analysis.
 * Designed to be configuration-driven to support future simplification from
 * multiple variants to a single production variant.
 */
var AIVariantSchema = new Schema(
  {
    //== Shared properties (Because Mongoose doesn't support schema inheritance)
    createdBy: { type: ObjectId, ref: 'User', required: true },
    createDate: { type: Date, default: Date.now },
    isTrashed: { type: Boolean, default: false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, default: Date.now },
    //====

    // Context - what submission is this variant for?
    submission: { type: ObjectId, ref: 'Submission', required: true },
    workspace: { type: ObjectId, ref: 'Workspace', required: true },

    // Variant identification (flexible, not hardcoded)
    variantKey: { type: String, required: true }, // e.g., 'A', 'B', 'E', 'F' (legacy C/D may exist in historical rows)
    variantLabel: { type: String, required: true }, // e.g., 'Student Work Only', 'Work + Selections'
    inputType: { type: String, required: true }, // 'work_only', 'work_selections', 'work_comments', 'work_all'

    // AI-generated content
    draftText: { type: String, required: true },
    sentAnnotations: [
      {
        selectedText: { type: String },
        selectorUsername: { type: String },
        selectorDate: { type: Date },
        comments: [
          {
            type: { type: String },
            text: { type: String },
            annotatorUsername: { type: String },
            annotatorDate: { type: Date },
          },
        ],
      },
    ],

    // Teacher evaluation/interaction
    rating: { type: Number, min: 1, max: 5 }, // Teacher's rating of this variant (latest)
    isSelected: { type: Boolean, default: false }, // Did teacher choose this variant?
    teacherNotes: { type: String }, // Teacher's notes about this variant (latest)
    // Append-only review history so past reviews are never overwritten
    reviewHistory: [
      {
        rating: { type: Number, min: 1, max: 5 },
        teacherNotes: { type: String },
        reviewedAt: { type: Date },
        reviewedBy: { type: ObjectId, ref: 'User' },
      },
    ],

    // Technical metadata
    requestId: { type: String },
    modelUsed: { type: String }, // e.g., 'claude-3-5-sonnet', 'gpt-4'
    tokensUsed: { type: Number },
    responseTime: { type: Number }, // milliseconds
    ragEnabled: { type: Boolean, default: false }, // Was RAG used for this variant?
  },
  { versionKey: false }
);

// Indexes for efficient querying
AIVariantSchema.index({ submission: 1, variantKey: 1, createDate: -1 }); // Keep full generation history
AIVariantSchema.index({ requestId: 1 }); // Lookup by request id when debugging logs
AIVariantSchema.index({ workspace: 1, createDate: -1 }); // For workspace reports
AIVariantSchema.index({ createdBy: 1, createDate: -1 }); // For user analytics
AIVariantSchema.index({ isSelected: 1 }); // For analyzing chosen variants

module.exports.AIVariant = mongoose.model('AIVariant', AIVariantSchema);
