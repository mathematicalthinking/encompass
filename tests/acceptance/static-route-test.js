// import { module, test } from 'qunit';
// import { visit, currentURL } from '@ember/test-helpers';
// import { setupApplicationTest } from 'ember-qunit';

// module('Acceptance | Static Routes', function (hooks) {
//   setupApplicationTest(hooks);

//   const urls = [
//     '/',
//     '/auth/login',
//     '/auth/signup',
//     '/auth/forgot',
//     '/problems',
//     '/problems/new',
//     '/sections',
//     '/sections/new',
//     '/workspaces',
//     '/workspaces/new',
//     '/workspaces/copy',
//     '/responses/new',
//     '/users',
//     '/users/new',
//     '/import',
//     '/vmt/import',
//     '/assignments',
//     '/assignments/new',
//     '/logout',
//     '/unconfirmed',
//     '/unauthorized',
//     '/metrics/folders',
//     '/welcome',
//     '/terms',
//     '/faq',
//     '/error',
//   ];

//   hooks.beforeEach(async () => {
//     await visit('/devonly/fakelogin/casper'); // Use the fakelogin URL to log in
//   });

//   urls.forEach((url) => {
//     test(`visiting ${url}`, async function (assert) {
//       await visit(url);
//       assert.strictEqual(currentURL(), url, `Successfully visited ${url}`);
//     });
//   });
// });
