import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | vmt-replayer', function (hooks) {
  setupRenderingTest(hooks);

  // Safety net: make sure a failed test can't leak injected tags into later ones.
  hooks.afterEach(function () {
    document.getElementById('vmt-enc-replayer')?.remove();
    document.getElementById('vmt-enc-replayer-css')?.remove();
  });

  test('renders the mount point and injects the replayer script + stylesheet on insert', async function (assert) {
    await render(hbs`<VmtReplayer />`);

    assert.dom('#root').exists('renders the replayer mount point');

    const script = document.getElementById('vmt-enc-replayer');
    assert.ok(script, 'appends the replayer script');
    assert.strictEqual(script.tagName, 'SCRIPT', 'it is a script element');
    assert.ok(
      script.src.includes('/enc/replayer/js'),
      'script points at the replayer js endpoint'
    );

    const link = document.getElementById('vmt-enc-replayer-css');
    assert.ok(link, 'appends the replayer stylesheet');
    assert.strictEqual(link.rel, 'stylesheet', 'it is a stylesheet link');
    assert.ok(
      link.href.includes('/enc/replayer/css'),
      'link points at the replayer css endpoint'
    );
  });

  test('removes the injected script and stylesheet on teardown', async function (assert) {
    await render(hbs`<VmtReplayer />`);
    assert.ok(
      document.getElementById('vmt-enc-replayer'),
      'script present while rendered'
    );

    await clearRender();

    assert.notOk(
      document.getElementById('vmt-enc-replayer'),
      'script removed on teardown'
    );
    assert.notOk(
      document.getElementById('vmt-enc-replayer-css'),
      'stylesheet removed on teardown'
    );
  });
});
