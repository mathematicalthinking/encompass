const mongoose = require('mongoose');
const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/encompass', {useMongoClient: true});

function hasBadData(docArray) {
  if (!Array.isArray(docArray)) {
    return [];
  }
  return docArray.filter((doc) => {
    return !doc || doc.isTrashed;
  }).length > 0;
}

function doesPopulatedWorkspaceHaveBadData(ws) {
  let { submissions, selections, comments, responses, folders, taggings } = ws;

  return hasBadData(submissions) ||  hasBadData(selections) || hasBadData(comments) || hasBadData(responses) || hasBadData(folders) || hasBadData(taggings);
}
function doesPopulatedSubmissionHaveBadData(sub) {
  let { responses, comments, selections } = sub;
  return hasBadData(selections) || hasBadData(comments) || hasBadData(responses);
}

function doesPopulatedSelectionHaveBadData(sel) {
  let { taggings, comments } = sel;
  return hasBadData(taggings) || hasBadData(comments);

}

function doesPopulatedResponseHaveBadData(response) {
  let { selections, comments } = response;
  return hasBadData(selections) || hasBadData(comments);

}
function doesPopulatedFolderHaveBadData(folder) {
  let { children, taggings } = folder;

  return hasBadData(taggings) || hasBadData(children);
}

function doesPopulatedCommentHaveBadData(comment) {
  let { children, ancestors } = comment;

  return hasBadData(ancestors) || hasBadData(children);
}


function findSubmissions() {
  let numProcessed = 0;

  return models.Submission.find({}).populate('selections comments responses').lean()
    .then((submissions) => {
      console.log(`There are ${submissions.length} submissions in total`);
      return submissions.filter((submission) => {
        numProcessed++;
        if (numProcessed % 10000 === 0) {
          console.log(`Processed ${numProcessed} / ${submissions.length} submissions`);
        }
        return doesPopulatedSubmissionHaveBadData(submission);
      });
    })
    .then((submissionsWithBadData) => {
      console.log(`There are ${submissionsWithBadData.length} submissions with bad data`);
      return submissionsWithBadData.map((sub) => {
        return {
          submission: sub._id,
          hasBadResponses: hasBadData(sub.responses),
          hasBadComments: hasBadData(sub.comments),
          hasBadSelections: hasBadData(sub.selections)
        };
      });
    })
    .then((detailObjects) => {
      let withBadResponses = detailObjects.filter(obj => obj.hasBadResponses);
      let withBadComments = detailObjects.filter(obj => obj.hasBadComments);
      let withBadSelections = detailObjects.filter(obj => obj.hasBadSelections);
      return {
        subsWithBadResponsesCount: withBadResponses.length,
        subsWithBadCommentsCount: withBadComments.length,
        subsWithBadSelectionsCount: withBadSelections.length
      };
    })
    .then((stats) => {
      console.log({stats});
    })
    .catch((err) => {
      throw(err);
    });
}

function findWorkspaces() {

  let numProcessed = 0;

  return models.Workspace.find({}).populate('submissions selections responses comments folders taggings').lean()
    .then((workspaces) => {
      console.log(`There are ${workspaces.length} in total`);
      return workspaces.filter((workspace) => {

        numProcessed++;
        if (numProcessed % 100 === 0) {
          console.log(`Processed ${numProcessed} / ${workspaces.length}`);
        }
        return doesPopulatedWorkspaceHaveBadData(workspace);
      });
    })
    .then((workspacesWithBadData) => {
      console.log(`There are ${workspacesWithBadData.length} workspaces who have bad Data`);

    })
    .catch((err) => {
      throw(err);
    });
}

function findSelections() {
  let numProcessed = 0;

  return models.Selection.find({}).populate('taggings comments').lean()
    .then((selections) => {
      console.log(`There are ${selections.length} in total`);
      return selections.filter((selection) => {
        numProcessed++;
        if (numProcessed % 10000 === 0) {
          console.log(`Processed ${numProcessed} / ${selections.length}`);
        }
        return doesPopulatedSelectionHaveBadData(selection);
      });
    })
    .then((selectionsWithBadData) => {
      console.log(`There are ${selectionsWithBadData.length} selections with bad data`);

    })
    .catch((err) => {
      throw(err);
    });
}

function findResponses() {
  let numProcessed = 0;

  return models.Response.find({}).populate('selections comments').lean()
    .then((responses) => {
      console.log(`There are ${responses.length} responses in total`);
      return responses.filter((response) => {
        numProcessed++;
        if (numProcessed % 10000 === 0) {
          console.log(`Processed ${numProcessed} / ${responses.length}`);
        }
        return doesPopulatedResponseHaveBadData(response);
      });
    })
    .then((responsesWithBadData) => {
      console.log(`There are ${responsesWithBadData.length} responses with bad data: ${responsesWithBadData.map(r => r._id)}`);
    })
    .catch((err) => {
      throw(err);
    });
}
function findFolders() {
  let numProcessed = 0;

  return models.Folder.find({}).populate('chilren taggings').lean()
    .then((folders) => {
      console.log(`There are ${folders.length} folders in total`);
      return folders.filter((folder) => {
        numProcessed++;
        if (numProcessed % 10000 === 0) {
          console.log(`Processed ${numProcessed} / ${folders.length}`);
        }
        return doesPopulatedFolderHaveBadData(folder);
      });
    })
    .then((foldersWithBadData) => {
      console.log(`There are ${foldersWithBadData.length} folders with bad data`);

    })
    .catch((err) => {
      throw(err);
    });
}
function findComments() {
  let numProcessed = 0;

  return models.Comment.find({}).populate('children ancestors').lean()
    .then((comments) => {
      console.log(`There are ${comments.length} comments in total`);
      return comments.filter((comment) => {
        numProcessed++;
        if (numProcessed % 10000 === 0) {
          console.log(`Processed ${numProcessed} / ${comments.length}`);
        }
        return doesPopulatedCommentHaveBadData(comment);
      });
    })
    .then((commentsWithBadData) => {
      console.log(`There are ${commentsWithBadData.length} comments with bad data`);

    })
    .catch((err) => {
      throw(err);
    });
}






// findWorkspaces();
// findSubmissions();
// findSelections();

function audit() {
  return Promise.all([
    findWorkspaces(),
    findSubmissions(),
    findSelections(),
    findResponses(),
    findFolders(),
    findComments(),
  ])
  .then(() => {
    mongoose.connection.close();
    console.log('done!');
  })
  .catch((err) => {
    mongoose.connection.close();
    throw(err);
  });
}
audit();