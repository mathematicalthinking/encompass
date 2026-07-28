/* eslint-env mocha */
const { expect } = require('chai');

const {
  buildOcrRequestBody,
  buildSelectedBox,
  buildStatusPath,
  extractImageSources,
  imageDataToBase64,
  imageSourceKey,
} = require('../../../app_server/services/ai')._test;

describe('AI OCR request helpers', function () {
  it('polls ticket status in the same API stage as the OCR endpoint', function () {
    expect(
      buildStatusPath('/prod/api/generate-draft-ocr', 'ticket 123')
    ).to.equal('/prod/api/status/ticket%20123');
  });

  it('builds the OCR endpoint contract', function () {
    const selectedBox = {
      x: 42,
      y: 118,
      width: 310,
      height: 65,
      page: 0,
    };

    expect(
      buildOcrRequestBody({
        images: ['page-one-base64'],
        variant: 'B',
        problemStatement: 'Solve 2x + 6 = 14.',
        studentWork: {
          short_answer: 'I solved for x.',
          long_answer: '2x + 6 = 14, so x = 4.',
          student_name: 'Alex',
        },
        studentName: 'Alex',
        consensusN: 1,
        requestRows: [
          {
            selected_box: selectedBox,
            comments: [{ text: 'Self-corrected', type: 'highlight' }],
          },
        ],
      })
    ).to.deep.equal({
      images: ['page-one-base64'],
      variant: 'B',
      async_ticket: true,
      ocr_consensus_n: 1,
      problem: {
        statement: 'Solve 2x + 6 = 14.',
      },
      student_work: {
        short_answer: 'I solved for x.',
        long_answer: '2x + 6 = 14, so x = 4.',
        student_name: 'Alex',
      },
      student_name: 'Alex',
      mentor_teacher_context: {
        selections_and_observations: [
          {
            selected_box: selectedBox,
            comments: [{ text: 'Self-corrected', type: 'highlight' }],
          },
        ],
      },
    });
  });

  it('converts normalized image-selection geometry to page pixels', function () {
    const selection = {
      relativeCoords: {
        tagLeftPct: 0.042,
        tagTopPct: 0.236,
      },
      relativeSize: {
        widthPct: 0.31,
        heightPct: 0.13,
      },
    };

    expect(
      buildSelectedBox(selection, { width: 1000, height: 500 }, 0)
    ).to.deep.equal({
      x: 42,
      y: 118,
      width: 310,
      height: 65,
      page: 0,
    });
  });

  it('uses the supplied zero-based page index', function () {
    const selection = {
      relativeCoords: { tagLeftPct: 0.1, tagTopPct: 0.2 },
      relativeSize: { widthPct: 0.3, heightPct: 0.4 },
    };

    expect(
      buildSelectedBox(selection, { width: 200, height: 100 }, 2)
    ).to.include({ page: 2 });
  });

  it('normalizes equivalent relative and absolute image URLs', function () {
    expect(
      imageSourceKey(
        'https://enc-test.mathematicalthinking.org/api/images/file/abc?size=full'
      )
    ).to.equal('/api/images/file/abc?size=full');
    expect(imageSourceKey('/api/images/file/abc?size=full')).to.equal(
      '/api/images/file/abc?size=full'
    );
  });

  it('extracts embedded image sources and strips data URI metadata', function () {
    expect(
      extractImageSources(
        '<p>First</p><img src="/api/images/file/one">',
        '<img alt="" src="data:image/png;base64,cGFnZQ==">'
      )
    ).to.deep.equal(['/api/images/file/one', 'data:image/png;base64,cGFnZQ==']);
    expect(imageDataToBase64('data:image/png;base64,cGFnZQ==')).to.equal(
      'cGFnZQ=='
    );
  });
});
