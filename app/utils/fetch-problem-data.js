import { hash } from 'rsvp';

export default async function fetchProblemData(store, problemId, currentUser) {
  const problem = await store.findRecord('problem', problemId);
  const organization = await currentUser.organization;
  const recommendedProblems = organization
    ? await organization.recommendedProblems
    : [];

  let flaggedBy, flaggedDate;
  if (problem.flagReason?.flaggedBy) {
    flaggedBy = await store.findRecord('user', problem.flagReason.flaggedBy);
    flaggedDate = new Date(problem.flagReason.flaggedDate);
  }

  return hash({
    problem,
    sectionList: store.findAll('section'),
    orgList: store.findAll('organization'),
    recommendedProblems,
    flaggedBy,
    flaggedDate,
  });
}
