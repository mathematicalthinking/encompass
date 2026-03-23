/**
 * AI Variant Configuration
 * SINGLE SOURCE OF TRUTH for variant definitions
 *
 * To simplify from 4 variants to 1 in future:
 * 1. Update activeVariants array to single entry
 * 2. Set generateAllOnRequest = false
 */

module.exports = {
  // Current A/B/E/F Testing Mode: 4 active variants
  // Storage mapping:
  // - A -> Student Work Only (RAG on)
  // - B -> Student Work + Selections + Comments (RAG on)
  // - E -> Student Work Only (RAG off)
  // - F -> Student Work + Selections + Comments (RAG off)
  //
  // Upstream compatibility mapping:
  // - E behaves as legacy C
  // - F behaves as legacy D
  activeVariants: [
    {
      key: 'A',
      label: 'Variant A: Student Work Only (RAG On)',
      inputType: 'work_only',
      description: 'AI analyzes only student submission text',
      useRag: true,
      upstreamVariant: 'A',
    },
    {
      key: 'B',
      label: 'Variant B: Student Work + Selections + Comments (All) (RAG On)',
      inputType: 'work_all',
      description: 'AI analyzes student work + all teacher annotations',
      useRag: true,
      upstreamVariant: 'B',
    },
    {
      key: 'E',
      label: 'Variant E: Student Work Only (RAG Off)',
      inputType: 'work_only',
      description: 'AI analyzes only student submission text with RAG disabled',
      useRag: false,
      upstreamVariant: 'C',
    },
    {
      key: 'F',
      label:
        'Variant F: Student Work + Selections + Comments (All) (RAG Off)',
      inputType: 'work_all',
      description:
        'AI analyzes student work + all teacher annotations with RAG disabled',
      useRag: false,
      upstreamVariant: 'D',
    },
  ],

  // When true, generate all variants automatically
  // When false, generate only defaultVariantKey
  generateAllOnRequest: true,

  // Default variant when system simplifies to single mode
  defaultVariantKey: 'B',
};
