const { seed } = require('../seeders/seed');

return seed().then(() => {
  console.log('Done seeding encompass_seed');
});
