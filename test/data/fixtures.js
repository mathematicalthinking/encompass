Encompass.Workspace.FIXTURES = [
  {
    id: 1,
    name: 'Kyle\'s Period 3 Triangle Tops Workspace',
    submissions: [1,2],
    responses: [1, 2],
    folders: [1,2,3],
    owner: 1,
    mode: 'private'
  },
  {
    id: 2,
    name: 'Kyle\'s Period 2 Across Australia Workspace',
    submissions: [],
    responses: [],
    folders: [],
    mode: 'public',
    owner: 2
  }
];

Encompass.Folder.FIXTURES = [
  {
    id: 1,
    name: 'Kyle Folder 1',
    weight: 100,
    children: [2],
    parent: null,
    taggings: [1,2],
    workspaces: [1]
  },{
    id: 2,
    name: 'folder 2',
    weight: 101,
    parent: 1,
    children: [],
    taggings: [],
    workspaces: [1]
  },{
    id: 3,
    name:'Kyle Folder 2',
    weight: 200,
    children:[],
    parent: null,
    taggings: [],
    workspaces: [1]
  }
];

Encompass.Submission.FIXTURES = [
  {
    id: 1,
    creator: {
      safeName: 'Student 1'
    },
    powId: 1234,
    shortAnswer: 'short 1',
    longAnswer: 'long 1 <i>italics</i>',
    thread: {
      threadId: 1
    },
    responses: [1, 2],
    selections: [1,2]
  },{
    id: 2,
    creator: {
      safeName: 'Ztudent 2'
    },
    powId: 12345,
    shortAnswer: '222',
    longAnswer: 'long asfdasdfasdf',
    thread: {
      threadId: 2
    },
    responses: []
  }
];

Encompass.Selection.FIXTURES = [
  {
    id: 1,
    text: 'short',
    coordinates: 'node-2 1 0 node-2 1 5',
    submission: 1,
    workspace: 1,
    taggings: [1]
  },{
    id: 2,
    text: 'hort',
    coordinates: 'node-2 1 1 node-2 1 5',
    submission: 1,
    workspace: 1,
    taggings: [2]
  }
];


Encompass.Tagging.FIXTURES = [
  {
    id: 1,
    folder: 1,
    selection: 1
  },
  {
    id: 2,
    folder: 1,
    selection: 2
  }
];

Encompass.User.FIXTURES = [
  {
    id: 1,
    name: 'Amir T.esting',
    username: 'amir',
    isAdmin: true,
    isAuthorized: true,
    seenTour: new Date()
  },
  {
    id: 2,
    username: 'some_trial_user'
  }
];

Encompass.PdSet.FIXTURES = [
  {
    id: 'default',
    count: 2,
    submissions: [1, 2]
  }
];

Encompass.FolderSet.FIXTURES = [
  {
    id: 'none',
    name: 'None'
  }
];

Encompass.Comment.FIXTURES = [
  {
    id: 1,
    text: 'Hi',
    selection: 1,
    workspace: 1,
    origin: null,
    parent: null,
    children: [],
    ancestors: []
  }
];

Encompass.Response.FIXTURES = [
  {
    id: 1,
    text: 'Someone said: short \nHi',
    source: 'submission',
    submission: 1,
    workspace: 1,
    selections: [1,2],
    comments: [1]
  },
  {
    id: 2,
    text: 'Someone said: hort \nHi',
    source: 'submission',
    submission: 1,
    workspace: 1,
    selections: [1,2],
    comments: [1]
  },
];
