const he = require('he');

const DEFAULT_STATEMENT =
  'The student is sharing their mathematical thinking and work.';

const stripHtml = (html) => {
  if (!html) return '';
  return he
    .decode(String(html).replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildLooseTitleRegex = (title) => {
  if (!title) return null;
  const clean = stripHtml(title)
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return null;
  const words = clean.split(' ');
  const pattern = words
    .map((word) => {
      const escaped = escapeRegex(word);
      if (escaped.length <= 2) return escaped;
      if (escaped.endsWith('s')) return escaped;
      return `${escaped}s?`;
    })
    .join('\\s+');
  return new RegExp(pattern, 'i');
};

const resolveProblemText = async (submission, models, cache = {}) => {
  if (!submission || !models) {
    return DEFAULT_STATEMENT;
  }

  const problemById = cache.problemById || new Map();
  const problemByPuzzleId = cache.problemByPuzzleId || new Map();

  const getProblemById = async (id) => {
    if (!id) return null;
    const key = id.toString();
    if (problemById.has(key)) return problemById.get(key);
    const problem = await models.Problem.findById(id)
      .select('text title')
      .lean()
      .exec();
    problemById.set(key, problem || null);
    return problem;
  };

  const getProblemByPuzzleId = async (puzzleId) => {
    if (!puzzleId) return null;
    const key = String(puzzleId);
    if (problemByPuzzleId.has(key)) return problemByPuzzleId.get(key);
    const problem = await models.Problem.findOne({
      puzzleId,
      isTrashed: { $ne: true },
    })
      .select('text title')
      .lean()
      .exec();
    problemByPuzzleId.set(key, problem || null);
    return problem;
  };

  let statement =
    submission?.answer?.assignment?.problem?.text ||
    submission?.answer?.assignment?.problem?.title;

  if (!statement && submission?.answer?.problem) {
    const problem = await getProblemById(submission.answer.problem);
    if (problem) statement = problem.text || problem.title;
  }

  if (!statement && submission?.publication?.publicationId) {
    const problem = await getProblemByPuzzleId(
      submission.publication.publicationId
    );
    if (problem) statement = problem.text || problem.title;
  }

  if (!statement && submission?.publication?.puzzle?.problemId) {
    const problem = await getProblemById(
      submission.publication.puzzle.problemId
    );
    if (problem) statement = problem.text || problem.title;
  }

  if (!statement && submission?.publication?.puzzle?.title) {
    statement = submission.publication.puzzle.title;
  }

  const pdSetTitle = submission?.pdSet
    ? stripHtml(submission.pdSet).split(' - ')[0].trim()
    : '';

  if (!statement && pdSetTitle) {
    const titleRegex =
      buildLooseTitleRegex(pdSetTitle) ||
      new RegExp(escapeRegex(pdSetTitle), 'i');
    const matchedProblem = await models.Problem.findOne({
      title: titleRegex,
      isTrashed: { $ne: true },
    })
      .select('text title')
      .lean()
      .exec();
    if (matchedProblem) {
      statement = matchedProblem.text || matchedProblem.title;
    }
  }

  if (!statement && pdSetTitle) {
    const fallbackParts = [pdSetTitle];
    const powId = submission?.publication?.publicationId;
    if (powId) fallbackParts.push(`PoW ID: ${powId}`);
    const className = stripHtml(submission?.clazz?.name || '');
    if (className) fallbackParts.push(`Class: ${className}`);
    statement = `${fallbackParts.join('. ')}. ${DEFAULT_STATEMENT}`;
  }

  return statement || DEFAULT_STATEMENT;
};

module.exports = {
  resolveProblemText,
};
