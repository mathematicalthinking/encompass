const data = require('./index');
const mongoose = require('mongoose');

const dbURI = `mongodb://localhost:27017/encompass_seed`;

const clearDB = () => {
  return mongoose
    .connect(dbURI, { useNewUrlParser: true })
    .then(() => mongoose.connection.db.dropDatabase());
};

const seedCollection = (db, collectionName, data) => {
  return db.collection(collectionName).insertMany(data);
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

    let results = await Promise.all(seededCollections);

    console.log('Seed Results: ', results);
    mongoose.connection.close();
  } catch (err) {
    console.log('Error seeding: ', err);
  }
};

module.exports.seed = seed;
