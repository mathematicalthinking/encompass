// AI SERVICE MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI SERVICE MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI SERVICE MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const he = require('he');
const sharp = require('sharp');
const { Parser } = require('htmlparser2');
const logger = require('log4js').getLogger('ai');
const models = require('../datasource/schemas');

/**
 * AI Service modified for A/B testing with variant support
 * Will need tweaking once preferred input combination is finalized
 */

/**
 * Strip HTML tags and decode HTML entities from text
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags or entities
 */
const stripHtml = (html) => {
  if (!html) return '';
  return he
    .decode(html.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
};

const looksLikeId = (value) =>
  typeof value === 'string' &&
  (/^[a-f0-9]{24}$/i.test(value) || /^[0-9]+$/.test(value.trim()));

const resolveStudentName = (submission) => {
  const creator = submission?.creator || {};
  const candidates = [
    creator.fullName,
    creator.safeName,
    creator.name,
    creator.username,
  ];

  for (const candidate of candidates) {
    const clean = stripHtml(candidate || '');
    if (clean && !looksLikeId(clean)) {
      return clean;
    }
  }

  return 'the student';
};

const { resolveProblemText } = require('./problemText');

const normalizeApiPath = (path = '') => {
  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

const STAGE_NAMES = new Set(['prod', 'dev', 'test', 'stage', 'staging']);
const AI_DRAFT_HTTP_TIMEOUT_MS = 300000;
const AI_DRAFT_POLL_MAX_MS = 300000 * 4;
const AI_DRAFT_POLL_INTERVAL_MS = 1000;
const DEFAULT_OCR_CONSENSUS_N = 1;
const MAX_OCR_SOURCE_BYTES = 20 * 1024 * 1024;

const getStagePrefix = (path = '') => {
  const segments = normalizeApiPath(path).split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && STAGE_NAMES.has(firstSegment.toLowerCase())) {
    return `/${firstSegment}`;
  }

  return '';
};

const buildStatusPath = (requestPath, ticketId) => {
  const stagePrefix = getStagePrefix(requestPath);
  return `${stagePrefix}/api/status/${encodeURIComponent(ticketId)}`;
};

const extractDraft = (payload = {}) => payload.draft_feedback || null;

const extractImageSources = (...htmlValues) => {
  const sources = [];

  htmlValues.forEach((html) => {
    if (typeof html !== 'string' || !html.includes('<')) {
      return;
    }

    const parser = new Parser({
      onopentag(name, attributes) {
        if (name === 'img' && attributes.src) {
          sources.push(attributes.src);
        }
      },
    });
    parser.write(html);
    parser.end();
  });

  return sources;
};

const imageDataToBase64 = (imageData) => {
  if (typeof imageData !== 'string' || imageData.length === 0) {
    return null;
  }

  const marker = 'base64,';
  const markerIndex = imageData.indexOf(marker);
  return markerIndex >= 0
    ? imageData.slice(markerIndex + marker.length)
    : imageData;
};

const imageSourceKey = (source) => {
  if (typeof source !== 'string' || source.length === 0) {
    return null;
  }

  if (source.startsWith('data:')) {
    return `data:${crypto.createHash('sha256').update(source).digest('hex')}`;
  }

  try {
    const url = new URL(source, 'http://encompass.local');
    return `${url.pathname}${url.search}`;
  } catch (error) {
    return source;
  }
};

const imageIdFromSource = (source) => {
  if (typeof source !== 'string') {
    return null;
  }

  const match = source.match(/\/api\/images\/file\/([a-f0-9]{24})(?:[/?#]|$)/i);
  return match ? match[1] : null;
};

const fetchBinary = (source, redirectCount = 0) =>
  new Promise((resolve, reject) => {
    let url;
    try {
      url = new URL(source);
    } catch (error) {
      reject(new Error(`Invalid image URL: ${source}`));
      return;
    }

    const protocol = url.protocol === 'http:' ? http : https;
    const request = protocol.get(url, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location &&
        redirectCount < 3
      ) {
        response.resume();
        resolve(
          fetchBinary(
            new URL(response.headers.location, url).toString(),
            redirectCount + 1
          )
        );
        return;
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        response.resume();
        reject(
          new Error(
            `Image request failed (${
              response.statusCode
            }) for ${url.toString()}`
          )
        );
        return;
      }

      const chunks = [];
      let totalBytes = 0;
      response.on('data', (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > MAX_OCR_SOURCE_BYTES) {
          request.destroy(
            new Error(`Image exceeds ${MAX_OCR_SOURCE_BYTES} byte OCR limit`)
          );
          return;
        }
        chunks.push(chunk);
      });
      response.on('end', () => resolve(Buffer.concat(chunks)));
    });

    request.on('error', reject);
    request.setTimeout(AI_DRAFT_HTTP_TIMEOUT_MS, () => {
      request.destroy(new Error('Image request timed out'));
    });
  });

const imagePageFromBuffer = async (buffer, key, pageNumber = null) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return null;
  }

  const metadata = await sharp(buffer).metadata();
  if (!(metadata.width > 0) || !(metadata.height > 0)) {
    return null;
  }

  return {
    key,
    base64: buffer.toString('base64'),
    width: metadata.width,
    height: metadata.height,
    pageNumber,
  };
};

const imagePageFromDocument = async (image, key = null) => {
  if (!image?.imageData) {
    return null;
  }

  const base64 = imageDataToBase64(image.imageData);
  if (!base64) {
    return null;
  }

  const buffer = Buffer.from(base64, 'base64');
  const page = await imagePageFromBuffer(
    buffer,
    key || `image:${String(image._id)}`,
    image.pdfPageNum || null
  );

  if (page && image.width > 0 && image.height > 0) {
    page.width = image.width;
    page.height = image.height;
  }

  return page;
};

const resolveImagePage = async (source) => {
  if (typeof source !== 'string' || source.length === 0) {
    return null;
  }

  const key = imageSourceKey(source);
  const imageId = imageIdFromSource(source);
  if (imageId) {
    const image = await models.Image.findById(imageId).lean().exec();
    return imagePageFromDocument(image, key);
  }

  if (source.startsWith('data:')) {
    const base64 = imageDataToBase64(source);
    return imagePageFromBuffer(Buffer.from(base64, 'base64'), key);
  }

  if (/^https?:\/\//i.test(source)) {
    return imagePageFromBuffer(await fetchBinary(source), key);
  }

  return null;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildSelectedBox = (selection, page, pageIndex) => {
  if (!selection || !page || !Number.isInteger(pageIndex)) {
    return null;
  }

  const relativeCoords = selection.relativeCoords || {};
  const relativeSize = selection.relativeSize || {};
  const relativeValues = [
    relativeCoords.tagLeftPct,
    relativeCoords.tagTopPct,
    relativeSize.widthPct,
    relativeSize.heightPct,
  ].map(Number);

  let x;
  let y;
  let width;
  let height;

  if (relativeValues.every(Number.isFinite)) {
    x = Math.round(clamp(relativeValues[0], 0, 1) * page.width);
    y = Math.round(clamp(relativeValues[1], 0, 1) * page.height);
    width = Math.round(clamp(relativeValues[2], 0, 1) * page.width);
    height = Math.round(clamp(relativeValues[3], 0, 1) * page.height);
  } else {
    const coordinates = String(selection.coordinates || '')
      .trim()
      .split(/\s+/);
    if (coordinates.length !== 5) {
      return null;
    }
    [x, y, width, height] = coordinates.slice(1).map(Number);
    if (![x, y, width, height].every(Number.isFinite)) {
      return null;
    }
  }

  x = clamp(x, 0, page.width - 1);
  y = clamp(y, 0, page.height - 1);
  width = clamp(width, 1, page.width - x);
  height = clamp(height, 1, page.height - y);

  return { x, y, width, height, page: pageIndex };
};

const buildOcrRequestBody = ({
  images,
  variant,
  problemStatement,
  studentWork,
  studentName,
  requestRows,
  consensusN = DEFAULT_OCR_CONSENSUS_N,
}) => ({
  images,
  variant,
  async_ticket: true,
  ocr_consensus_n: consensusN,
  problem: {
    statement: problemStatement,
  },
  student_work: studentWork || {
    short_answer: '',
    long_answer: '',
    student_name: studentName,
  },
  student_name: studentName,
  mentor_teacher_context: {
    selections_and_observations: requestRows,
  },
});

const summarizeResponseBody = (value, maxLength = 400) => {
  if (value === null || value === undefined) {
    return '';
  }

  const text =
    typeof value === 'string' ? value : JSON.stringify(value, null, 2);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

const buildAIServiceError = ({
  message,
  statusCode = null,
  requestOptions = {},
  responseBody = null,
}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.host = requestOptions.hostname || null;
  error.port = requestOptions.port || null;
  error.path = requestOptions.path || null;
  error.method = requestOptions.method || null;
  error.responseBodyPreview = summarizeResponseBody(responseBody);

  if (statusCode === 403) {
    error.hint =
      'Upstream AI service denied the request. Check API Gateway stage/path, API-key authorization, resource policy, or source-network restrictions.';
  } else if (statusCode === 404) {
    error.hint =
      'Upstream AI endpoint was not found. Check AI_DRAFT_HOST, AI_DRAFT_PATH, and deployed stage routing.';
  } else if (statusCode && statusCode >= 500) {
    error.hint =
      'Upstream AI service failed after receiving the request. Check the external service logs.';
  }

  return error;
};

/**
 * Generate an AI draft response based on submission
 * @param {string} targetSubmissionId - The ID of the target submission
 * @param {string} variant - Upstream variant key ('A', 'B', 'C', 'D')
 * @param {string} workspaceId - Optional workspace ID to filter selections/comments
 * @param {string} teacherId - Teacher user ID to scope selections/comments
 * @param {object} options - Variant options from config
 * @param {string} options.inputType - Input context mode (work_only, work_all, etc.)
 * @param {boolean} options.useRag - Whether upstream should use RAG
 * @returns {Promise<object>} Generated draft payload including draft text and response time
 *
 * Active storage variants:
 * A: Student work only (RAG on)
 * B: Student work + teacher selections + teacher comments (RAG on)
 * E: Student work only (RAG off; maps upstream to C)
 * F: Student work + teacher selections + teacher comments (RAG off; maps upstream to D)
 */
const generateDraft = async (
  targetSubmissionId,
  variant = 'A',
  workspaceId = null,
  teacherId = null,
  options = {}
) => {
  const inputType = options.inputType || 'work_only';
  const useRag = Boolean(options.useRag);

  // Step 1: Fetch submission with all related data
  const targetSubmission = await models.Submission.findById(targetSubmissionId)
    .populate({
      path: 'answer',
      populate: [
        {
          path: 'assignment',
          populate: { path: 'problem', select: 'text title' },
        },
        {
          path: 'explanationImage',
          select: 'imageData width height pdfPageNum',
        },
        {
          path: 'additionalImage',
          select: 'imageData width height pdfPageNum',
        },
      ],
    })
    .select(
      'shortAnswer longAnswer answer creator clazz publication pdSet uploadedFile'
    )
    .lean()
    .exec();

  if (!targetSubmission) {
    throw new Error(`Submission ${targetSubmissionId} not found`);
  }

  // Step 2: Extract problem statement
  const problemStatement = await resolveProblemText(targetSubmission, models);

  // Step 3: Extract and clean student work
  const rawShortAnswer = targetSubmission.shortAnswer || '';
  const rawLongAnswer = targetSubmission.longAnswer || '';
  const rawAnswer = targetSubmission.answer?.answer || '';
  const rawExplanation = targetSubmission.answer?.explanation || '';
  let shortAnswer = stripHtml(rawShortAnswer);
  let longAnswer = stripHtml(rawLongAnswer);

  // If no direct student work, check the answer relationship (for VMT submissions)
  if (
    (!shortAnswer || shortAnswer.trim().length === 0) &&
    (!longAnswer || longAnswer.trim().length === 0)
  ) {
    if (targetSubmission.answer) {
      shortAnswer = stripHtml(rawAnswer);
      longAnswer = stripHtml(rawExplanation);
    }
  }

  // Step 4: Determine student name
  const studentName = resolveStudentName(targetSubmission);

  // Step 5: Build request body matching backend expected format
  const cleanProblemStatement = stripHtml(problemStatement);

  const requestBody = {
    variant,
    use_rag: useRag,
    async_ticket: true,
    problem: {
      statement: cleanProblemStatement,
    },
    student_work: {
      short_answer: shortAnswer,
      long_answer: longAnswer,
      student_name: studentName,
    },
    mentor_teacher_context: {
      selections_and_observations: [],
    },
  };

  const { rows, sentAnnotations } = await buildSelectionsAndObservations(
    targetSubmissionId,
    inputType,
    workspaceId,
    teacherId
  );
  const ocrContext = await buildOcrContext(targetSubmission, rows, [
    rawShortAnswer,
    rawLongAnswer,
    rawAnswer,
    rawExplanation,
  ]);
  const hasTextWork = Boolean(shortAnswer.trim() || longAnswer.trim());

  if (!hasTextWork && ocrContext.images.length === 0) {
    throw new Error(
      'No student work found. Students must provide text or an image.'
    );
  }
  const loggedAnnotations = sentAnnotations.map((annotation, index) => ({
    ...annotation,
    selectedBox: ocrContext.selectedBoxes[index] || null,
  }));

  let aiResult;
  if (ocrContext.images.length > 0) {
    // Image submissions still send the OCR-shaped payload (images + selected_box
    // coordinates), but to the default generate-draft endpoint — no OCR URL.
    const ocrRequestBody = buildOcrRequestBody({
      images: ocrContext.images,
      variant,
      problemStatement: cleanProblemStatement,
      studentWork: requestBody.student_work,
      consensusN: getOcrConsensusN(),
      studentName,
      requestRows: ocrContext.requestRows,
    });
    aiResult = await makeAIRequest(ocrRequestBody);
  } else {
    requestBody.mentor_teacher_context.selections_and_observations =
      rows.map(toTextRequestRow);
    aiResult = await makeAIRequest(requestBody);
  }
  const draft =
    typeof aiResult === 'object' && aiResult?.draft ? aiResult.draft : aiResult;
  const responseTime =
    typeof aiResult === 'object' && Number.isFinite(aiResult?.responseTime)
      ? aiResult.responseTime
      : null;

  return {
    draft,
    sentAnnotations: loggedAnnotations,
    responseTime,
  };
};

/**
 * Helper: Get teacher selections for a submission
 * @param {string} submissionId - The submission ID
 * @param {string} workspaceId - The workspace ID to filter selections
 * @param {string} teacherId - The teacher user ID to filter selections
 * @returns {Promise<Array>} Array of selection objects
 */
const getTeacherSelections = async (submissionId, workspaceId, teacherId) => {
  try {
    const selectionQuery = {
      submission: submissionId,
      isTrashed: { $ne: true },
    };
    if (teacherId) {
      selectionQuery.createdBy = teacherId;
    }
    if (workspaceId) {
      selectionQuery.workspace = workspaceId;
    }
    const selections = await models.Selection.find(selectionQuery)
      .populate('createdBy', 'username')
      .select(
        'text coordinates relativeCoords relativeSize imageSrc imageTagLink createDate createdBy'
      )
      .lean()
      .exec();
    return selections.map((sel) => ({
      selection_id: String(sel._id),
      selected_text: stripHtml(sel.text),
      coordinates: sel.coordinates || '',
      relativeCoords: sel.relativeCoords || null,
      relativeSize: sel.relativeSize || null,
      imageSrc: sel.imageSrc || null,
      selector_username: sel.createdBy?.username || '',
      selector_date: sel.createDate || null,
      comments: [],
    }));
  } catch (error) {
    logger.error('Error fetching teacher selections:', error);
    return [];
  }
};

/**
 * Helper: Get teacher comments for a submission
 * @param {string} submissionId - The submission ID
 * @param {string} workspaceId - The workspace ID to filter comments
 * @param {string} teacherId - The teacher user ID to filter comments
 * @returns {Promise<Array>} Array of comment objects
 */
const getTeacherComments = async (submissionId, workspaceId, teacherId) => {
  try {
    const commentQuery = {
      submission: submissionId,
      isTrashed: { $ne: true },
    };
    if (teacherId) {
      commentQuery.createdBy = teacherId;
    }
    if (workspaceId) {
      commentQuery.workspace = workspaceId;
    }
    const comments = await models.Comment.find(commentQuery)
      .populate(
        'selection',
        'text coordinates relativeCoords relativeSize imageSrc imageTagLink'
      )
      .populate('createdBy', 'username')
      .select('text label selection createDate createdBy')
      .lean()
      .exec();
    return comments.map((comment) => ({
      selection_id: comment.selection?._id
        ? String(comment.selection._id)
        : comment.selection
        ? String(comment.selection)
        : null,
      selected_text: stripHtml(comment.selection?.text || ''),
      coordinates: comment.selection?.coordinates || '',
      relativeCoords: comment.selection?.relativeCoords || null,
      relativeSize: comment.selection?.relativeSize || null,
      imageSrc: comment.selection?.imageSrc || null,
      type: comment.label, // notice, wonder, feedback
      text: stripHtml(comment.text),
      annotator_username: comment.createdBy?.username || '',
      annotator_date: comment.createDate || null,
    }));
  } catch (error) {
    logger.error('Error fetching teacher comments:', error);
    return [];
  }
};

/**
 * Build mentor_teacher_context.selections_and_observations payload
 * based on requested variant.
 */
const buildSelectionsAndObservations = async (
  submissionId,
  inputType,
  workspaceId,
  teacherId
) => {
  const includeSelections =
    inputType === 'work_selections' || inputType === 'work_all';
  const includeComments =
    inputType === 'work_comments' || inputType === 'work_all';

  const [selections, comments] = await Promise.all([
    includeSelections
      ? getTeacherSelections(submissionId, workspaceId, teacherId)
      : Promise.resolve([]),
    includeComments
      ? getTeacherComments(submissionId, workspaceId, teacherId)
      : Promise.resolve([]),
  ]);

  const selectionMap = new Map();
  const list = [];

  selections.forEach((selection) => {
    const key = selection.selection_id || `sel_${list.length}`;
    const row = {
      selection_id: selection.selection_id || null,
      selected_text: selection.selected_text || '',
      coordinates: selection.coordinates || '',
      relativeCoords: selection.relativeCoords || null,
      relativeSize: selection.relativeSize || null,
      imageSrc: selection.imageSrc || null,
      selector_username: selection.selector_username || '',
      selector_date: selection.selector_date || null,
      comments: [],
    };
    selectionMap.set(key, row);
    list.push(row);
  });

  comments.forEach((comment) => {
    const key = comment.selection_id || `comment_only_${list.length}`;
    let row = selectionMap.get(key);

    if (!row) {
      row = {
        selection_id: comment.selection_id || null,
        selected_text: comment.selected_text || '',
        coordinates: comment.coordinates || '',
        relativeCoords: comment.relativeCoords || null,
        relativeSize: comment.relativeSize || null,
        imageSrc: comment.imageSrc || null,
        selector_username: '',
        selector_date: null,
        comments: [],
      };
      selectionMap.set(key, row);
      list.push(row);
    }

    row.comments.push({
      type: comment.type || '',
      text: comment.text || '',
      annotator_username: comment.annotator_username || '',
      annotator_date: comment.annotator_date || null,
    });
  });

  return {
    rows: list,
    sentAnnotations: list.map((row) => ({
      selectedText: row.selected_text || '',
      selectedBox: null,
      selectorUsername: row.selector_username || '',
      selectorDate: row.selector_date || null,
      comments: row.comments.map((comment) => ({
        type: comment.type || '',
        text: comment.text || '',
        annotatorUsername: comment.annotator_username || '',
        annotatorDate: comment.annotator_date || null,
      })),
    })),
  };
};

const toRequestComments = (comments = []) =>
  comments.map((comment) => ({
    type: comment.type || '',
    text: comment.text || '',
  }));

const toTextRequestRow = (row) => ({
  selected_text: row.selected_text || '',
  comments: toRequestComments(row.comments),
});

const getOcrConsensusN = () => {
  const value = Number.parseInt(process.env.AI_DRAFT_OCR_CONSENSUS_N, 10);
  return Number.isInteger(value) && value > 0 ? value : DEFAULT_OCR_CONSENSUS_N;
};

const getTextEndpointConfig = () => ({
  hostname: process.env.AI_DRAFT_HOST,
  port: process.env.AI_DRAFT_PORT,
  path: process.env.AI_DRAFT_PATH,
  apiKey: process.env.AI_DRAFT_API_KEY,
  protocol: process.env.AI_DRAFT_HOST === 'localhost' ? 'http:' : 'https:',
});

const buildOcrContext = async (
  targetSubmission,
  rows,
  studentWorkHtml = []
) => {
  const pages = [];
  const pagesByKey = new Map();

  const addPage = (page) => {
    if (!page?.key || pagesByKey.has(page.key)) {
      return;
    }
    pagesByKey.set(page.key, page);
    pages.push(page);
  };

  const directImages = [
    targetSubmission.answer?.explanationImage,
    targetSubmission.answer?.additionalImage,
  ].filter(Boolean);

  for (const image of directImages) {
    try {
      addPage(
        await imagePageFromDocument(
          image,
          imageSourceKey(`/api/images/file/${String(image._id)}`)
        )
      );
    } catch (error) {
      logger.warn('Unable to prepare answer image for OCR:', error.message);
    }
  }

  const sources = extractImageSources(...studentWorkHtml);
  rows.forEach((row) => {
    if (row.imageSrc) {
      sources.push(row.imageSrc);
    }
  });

  const savedFileName = targetSubmission.uploadedFile?.savedFileName;
  if (savedFileName) {
    sources.push(
      `http://mathforum.org/encpows/uploaded-images/${encodeURIComponent(
        savedFileName
      )}`
    );
  }

  for (const source of sources) {
    const key = imageSourceKey(source);
    if (!key || pagesByKey.has(key)) {
      continue;
    }

    try {
      addPage(await resolveImagePage(source));
    } catch (error) {
      logger.warn(`Unable to prepare OCR image ${key}:`, error.message);
    }
  }

  const requestRows = rows.map((row) => {
    const comments = toRequestComments(row.comments);
    const pageKey = imageSourceKey(row.imageSrc);
    const page = pageKey ? pagesByKey.get(pageKey) : null;
    const pageIndex = page ? pages.indexOf(page) : -1;
    const selectedBox = buildSelectedBox(row, page, pageIndex);

    if (selectedBox) {
      return { selected_box: selectedBox, comments };
    }

    return { selected_text: row.selected_text || '', comments };
  });

  return {
    images: pages.map((page) => page.base64),
    requestRows,
    selectedBoxes: requestRows.map((row) => row.selected_box || null),
  };
};

/**
 * Makes an HTTP POST request to the AI service
 * @param {Object} requestBody - The structured request body
 * @returns {Promise<string>} The draft text from AI service
 */
const makeAIRequest = async (
  requestBody,
  endpointConfig = getTextEndpointConfig()
) => {
  const postData = JSON.stringify(requestBody);
  const options = {
    hostname: endpointConfig.hostname,
    port: endpointConfig.port,
    path: endpointConfig.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  // Add API key if provided
  if (endpointConfig.apiKey) {
    options.headers['x-api-key'] = endpointConfig.apiKey;
  }

  return new Promise((resolve, reject) => {
    const protocol = endpointConfig.protocol === 'http:' ? http : https;
    const requestJson = (requestOptions, body = null) =>
      new Promise((resolveRequest, rejectRequest) => {
        const req = protocol.request(requestOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            let response = {};
            try {
              response = data ? JSON.parse(data) : {};
            } catch (e) {
              rejectRequest(
                buildAIServiceError({
                  message: `Invalid response from AI service: ${e.message}`,
                  statusCode: res.statusCode,
                  requestOptions,
                  responseBody: data,
                })
              );
              return;
            }

            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolveRequest(response);
              return;
            }

            rejectRequest(
              buildAIServiceError({
                message: `AI error (${res.statusCode}): ${
                  response.error || response.message || 'Unknown'
                }`,
                statusCode: res.statusCode,
                requestOptions,
                responseBody: data || response,
              })
            );
          });
        });

        req.on('error', (e) =>
          rejectRequest(
            buildAIServiceError({
              message: `Connection failed: ${e.message}`,
              requestOptions,
            })
          )
        );
        req.setTimeout(AI_DRAFT_HTTP_TIMEOUT_MS, () => {
          req.destroy();
          rejectRequest(
            buildAIServiceError({
              message: 'Request timeout',
              requestOptions,
            })
          );
        });

        if (body) {
          req.write(body);
        }
        req.end();
      });

    requestJson(options, postData)
      .then((response) => {
        const ticketId = response.ticketId || response.ticket_id || null;
        if (!ticketId) {
          reject(new Error('No ticket ID found in AI response'));
          return;
        }

        const startedAt = Date.now();
        const statusPath = buildStatusPath(options.path, ticketId);
        const statusOptions = {
          hostname: options.hostname,
          port: options.port,
          path: statusPath,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        if (endpointConfig.apiKey) {
          statusOptions.headers['x-api-key'] = endpointConfig.apiKey;
        }

        const poll = () => {
          if (Date.now() - startedAt >= AI_DRAFT_POLL_MAX_MS) {
            reject(new Error('Draft generation timed out. Please retry.'));
            return;
          }

          requestJson(statusOptions)
            .then((statusResponse) => {
              const status = String(statusResponse.status || '').toLowerCase();

              if (status === 'completed' || status === 'ready') {
                const draft = extractDraft(statusResponse);
                if (!draft) {
                  reject(new Error('No draft_feedback found in AI response'));
                  return;
                }
                resolve({
                  draft,
                  responseTime: Date.now() - startedAt,
                });
                return;
              }

              if (status === 'failed' || status === 'error') {
                reject(
                  new Error(
                    statusResponse.error || 'Failed to generate AI draft'
                  )
                );
                return;
              }

              setTimeout(poll, AI_DRAFT_POLL_INTERVAL_MS);
            })
            .catch(reject);
        };

        poll();
      })
      .catch(reject);
  });
};

module.exports.generateDraft = generateDraft;
module.exports._test = {
  buildOcrRequestBody,
  buildSelectedBox,
  buildStatusPath,
  extractImageSources,
  imageDataToBase64,
  imageSourceKey,
};
