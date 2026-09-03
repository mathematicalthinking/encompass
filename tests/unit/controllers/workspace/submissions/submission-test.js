import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module(
  'Unit | Controller | workspace/submissions/submission',
  function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
      this.created = [];
      this.saved = [];
      this.selection = { id: 'sel1' };
      this.folder = {
        id: 'f1',
        name: 'Interesting Strategies',
        hasSelection: () => false,
      };
      this.workspace = { id: 'w1', folders: Promise.resolve([this.folder]) };

      const controllerContext = this;

      class StoreService extends Service {
        peekRecord(modelName, id) {
          return id === 'sel1' ? controllerContext.selection : null;
        }
        createRecord(modelName, attrs) {
          const record = {
            modelName,
            ...attrs,
            save() {
              controllerContext.saved.push(record);
              return Promise.resolve(record);
            },
            deleteRecord() {
              record.isDeleted = true;
            },
          };
          controllerContext.created.push(record);
          return record;
        }
      }

      class CurrentUserService extends Service {
        user = { id: 'u1' };
        id = 'u1';
      }

      class AlertService extends Service {
        toastCalls = [];
        showToast(...args) {
          this.toastCalls.push(args);
        }
      }

      this.owner.register('service:store', StoreService);
      this.owner.register('service:current-user', CurrentUserService);
      this.owner.register('service:sweet-alert', AlertService);
      this.owner.register(
        'service:workspace-permissions',
        class extends Service {
          canEdit() {
            return true;
          }
        }
      );
      this.owner.register(
        'service:current-selection',
        class extends Service {}
      );
      this.owner.register('service:utility-methods', class extends Service {});
      this.owner.register('service:guiders-create', class extends Service {});

      // the submission controller reads its workspace off the parent controller
      this.owner.lookup('controller:workspace').model = this.workspace;
      this.controller = this.owner.lookup(
        'controller:workspace/submissions/submission'
      );
    });

    test('filing a selection in a folder creates a tagging', async function (assert) {
      await this.controller.fileSelectionInFolder('sel1', this.folder);

      assert.strictEqual(this.created.length, 1, 'one record is created');

      const tagging = this.created[0];
      assert.strictEqual(tagging.modelName, 'tagging', 'it is a tagging');
      assert.strictEqual(tagging.selection, this.selection);
      assert.strictEqual(tagging.folder, this.folder);
      assert.strictEqual(tagging.workspace, this.workspace);
      assert.deepEqual(this.saved, [tagging], 'the tagging is saved');
    });

    test('a selection already in the folder is not filed twice', async function (assert) {
      this.folder.hasSelection = (id) => id === 'sel1';

      await this.controller.fileSelectionInFolder('sel1', this.folder);

      assert.deepEqual(this.created, [], 'no tagging is created');
    });

    test('an unknown selection is ignored', async function (assert) {
      await this.controller.fileSelectionInFolder('nope', this.folder);

      assert.deepEqual(this.created, [], 'no tagging is created');
    });

    test('a comment tag files the selection in the matching folder', async function (assert) {
      await this.controller.tagSelection(this.selection, [
        'interestingstrategies',
        'nosuchfolder',
      ]);

      assert.strictEqual(this.created.length, 1, 'only the match is filed');
      assert.strictEqual(this.created[0].folder, this.folder);
    });
  }
);
