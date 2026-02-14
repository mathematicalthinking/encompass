/**
 * AI Variant Configuration
 * SINGLE SOURCE OF TRUTH for variant definitions
 *
 * To simplify from 4 variants to 1 in future:
 * 1. Update activeVariants array to single entry
 * 2. Set generateAllOnRequest = false
 */

module.exports = {
  // Current A/B Testing Mode: 4 variants
  activeVariants: [
    {
      key: 'A',
      label: 'Student Work Only',
      inputType: 'work_only',
      description: 'AI analyzes only student submission text',
    },
    {
      key: 'B',
      label: 'Work + Selections',
      inputType: 'work_selections',
      description: 'AI analyzes student work + teacher text selections',
    },
    {
      key: 'C',
      label: 'Work + Comments',
      inputType: 'work_comments',
      description:
        'AI analyzes student work + teacher comments (notice/wonder/feedback)',
    },
    {
      key: 'D',
      label: 'Work + Selections + Comments',
      inputType: 'work_all',
      description: 'AI analyzes student work + all teacher annotations',
    },
  ],

  // When true, generate all variants automatically
  // When false, generate only defaultVariantKey
  generateAllOnRequest: true,

  // Default variant when system simplifies to single mode
  defaultVariantKey: 'D',

  // FUTURE MODE (example - after picking winner):
  // activeVariants: [
  //   {
  //     key: 'default',
  //     label: 'AI Feedback',
  //     inputType: 'work_all',
  //     description: 'Production AI feedback mode'
  //   }
  // ],
  // generateAllOnRequest: false,
  // defaultVariantKey: 'default'
};
