/** Collections we expect the DB to have */
var COLLECTIONS = [
  "users",
  "workspaces",
  "folders", 
  "submissions", 
  "selections",
  "comments",
  "taggings",
  "responses",
];

/** Relationship Types: DO NOT EDIT */
var REL_TYPES = {
  OneToOne: 0,
  OneToMany: 1, 
  ManyToOne: 2,
  ManyToMany: 3
};

/** Relationships we want to check
  * order: Relationship Type (deprecated) - useful if further computation is needed on type 
  * objects: The objects in the relationship i.e the collections
      Here a {key: value} corresponds to {origin -> endpoint}
  * fields: The fields within the objects that store the relationship i.e foreign keys
  *   origin: foreign key field in the endpoint that points back to the origin
  *   endpoint: foreign key field in the origin object that points to the endpoint 
  */
var RELATIONSHIPS = [
  {
    order: REL_TYPES.OneToMany,
    objects: {"workspaces": "folders"},
    fields: {
      origin: 'workspace',
      endpoint: 'folders'
    },
  },
  {
    order: REL_TYPES.ManyToMany,
    objects: {"workspaces": "submissions"},
    fields: {
      origin: 'workspaces',
      endpoint: 'submissions'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"workspaces": "selections"},
    fields: {
      origin: 'workspace',
      endpoint: 'selections'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"workspaces": "comments"},
    fields: {
      origin: 'workspace',
      endpoint: 'comments'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"workspaces": "responses"},
    fields: {
      origin: 'workspace',
      endpoint: 'responses'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"workspaces": "taggings"},
    fields: {
      origin: 'workspace',
      endpoint: 'taggings'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"folders": "taggings"},
    fields: {
      origin: 'folder',
      endpoint: 'taggings'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"submissions": "selections"},
    fields: {
      origin: 'submission',
      endpoint: 'selections'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"submissions": "comments"},
    fields: {
      origin: 'submission',
      endpoint: 'comments'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"submissions": "responses"},
    fields: {
      origin: 'submission',
      endpoint: 'responses'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"selections": "comments"},
    fields: {
      origin: 'selection',
      endpoint: 'comments'
    },
  },
  {
    order: REL_TYPES.OneToMany,
    objects: {"selections": "taggings"},
    fields: {
      origin: 'selection',
      endpoint: 'taggings'
    },
  },
];
