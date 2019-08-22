const data = require('./index');
const mongoose = require('mongoose');

const dbURI = `mongodb://localhost:27017/encompass_seed`;

const indexes = require('./indexes');

mongoose.Promise = Promise;

const clearDB = () => {
  return mongoose
    .connect(dbURI, { useMongoClient: true })
    .then(() => {
      mongoose.connection.db.dropDatabase();
    })
    .catch(err => {
      console.log('db drop err: ', err);
    });
};

const seedCollection = (db, collectionName, data) => {
  return db.collection(collectionName).insertMany(data);
};

const createIndexes = db => {
  let collectionNames = Object.keys(indexes);
  return Promise.all(
    collectionNames.map(name => {
      let ixes = indexes[name];
      return Promise.all(
        ixes.map(ix => {
          return db.collection(name).createIndex(ix.keys, ix.options);
        })
      );
    })
  ).catch(err => {
    console.log({ ixCreationErr: err });
  });
};
const seed = async (collections = Object.keys(data)) => {
  try {
    await clearDB();

    let db = mongoose.connection;

    let seededCollections = collections.map(collectionName => {
      return seedCollection(db, collectionName, data[collectionName]).then(
        writeResults => {
          return `${collectionName}: ${writeResults.result.n}`;
        }
      );
    });

    await Promise.all(seededCollections);
    await createIndexes(db);
    mongoose.connection.close();
  } catch (err) {
    console.log('Error seeding: ', err);
  }
};

module.exports.seed = seed;
