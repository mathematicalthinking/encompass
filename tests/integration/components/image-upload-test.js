import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

const MB = 1024 * 1024;

// Build a File whose `size`/`type` we control. The component only reads
// `f.size`, `f.type`, and `f.name`, so we can fake large files without
// allocating real megabytes of data.
function makeFile(name, type, size) {
  const file = new File(['x'], name, { type });
  if (typeof size === 'number') {
    Object.defineProperty(file, 'size', { value: size });
  }
  return file;
}

// Set a real FileList on the <input> and fire the change event the same way
// a user picking files would. updateFiles reads from the input's `files`.
async function selectFiles(files) {
  const input = document.querySelector('input.image-upload');
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
  await triggerEvent(input, 'change');
}

class ErrorBoxStub extends Component {
  get isStub() {
    return true;
  }
}

module('Integration | Component | image-upload', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // fetch is overridden per-test; default to a benign image response.
    this.originalFetch = window.fetch;
    this.fetchCalls = [];
    this.setFetch = (handler) => {
      window.fetch = (url, options) => {
        this.fetchCalls.push({ url, options });
        return handler(url, options);
      };
    };
    this.setFetch(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ images: [{ _id: 'img-1' }] }),
      })
    );

    const test = this;

    this.toastCalls = [];
    this.owner.register(
      'service:sweet-alert',
      class extends Service {
        showToast(type, message) {
          test.toastCalls.push({ type, message });
        }
      }
    );

    this.pushPayloadCalls = [];
    this.owner.register(
      'service:store',
      class extends Service {
        pushPayload(payload) {
          test.pushPayloadCalls.push(payload);
        }
      }
    );

    this.handleErrorsCalls = [];
    this.owner.register(
      'service:error-handling',
      class extends Service {
        handleErrors(err, key) {
          test.handleErrorsCalls.push({ err, key });
        }
      }
    );

    this.owner.register(
      'service:current-user',
      class extends Service {
        user = { id: 'user-1' };
      }
    );

    // Deterministic, inspectable error output instead of the real component.
    this.owner.register('component:ui/error-box', ErrorBoxStub);
    this.owner.register(
      'template:components/ui/error-box',
      hbs`
        <div class='error-box-stub'>
          <span class='error-text'>{{@error}}</span>
          {{#if @resetError}}
            <button
              type='button'
              class='dismiss-error'
              {{on 'click' @resetError}}
            >
              Dismiss
            </button>
          {{/if}}
        </div>
      `
    );
  });

  hooks.afterEach(function () {
    window.fetch = this.originalFetch;
  });

  async function renderComponent(context, overrides = {}) {
    context.setProperties({
      isPdfOnly: false,
      acceptMultiple: false,
      hideSubmit: false,
      doResetFilesAfterUpload: false,
      handleUploadResults: undefined,
      storeFiles: undefined,
      ...overrides,
    });

    await render(hbs`
      <ImageUpload
        @isPdfOnly={{this.isPdfOnly}}
        @acceptMultiple={{this.acceptMultiple}}
        @hideSubmit={{this.hideSubmit}}
        @doResetFilesAfterUpload={{this.doResetFilesAfterUpload}}
        @handleUploadResults={{this.handleUploadResults}}
        @storeFiles={{this.storeFiles}}
      />
    `);
  }

  test('it renders the upload form and file input', async function (assert) {
    await renderComponent(this);

    assert.dom('#image-upload').exists('wrapper id selenium/SCSS rely on');
    assert
      .dom('#image-upload form')
      .hasAttribute('enctype', 'multipart/form-data');
    assert.dom('input.image-upload[type="file"]').exists('file input renders');
  });

  test('accept attribute allows images and pdf by default', async function (assert) {
    await renderComponent(this);

    assert
      .dom('input.image-upload')
      .hasAttribute('accept', 'image/png,image/jpeg,application/pdf');
  });

  test('accept attribute is pdf-only when @isPdfOnly is true', async function (assert) {
    await renderComponent(this, { isPdfOnly: true });

    assert.dom('input.image-upload').hasAttribute('accept', 'application/pdf');
  });

  test('the file input is multiple only when @acceptMultiple is true', async function (assert) {
    await renderComponent(this, { acceptMultiple: false });
    assert.dom('input.image-upload').doesNotHaveAttribute('multiple');

    await renderComponent(this, { acceptMultiple: true });
    assert.dom('input.image-upload').hasAttribute('multiple');
  });

  test('the Upload Files button appears only after files are chosen', async function (assert) {
    await renderComponent(this);

    assert
      .dom('input[type="button"][value="Upload Files"]')
      .doesNotExist('no submit button before any file is selected');

    await selectFiles([makeFile('a.png', 'image/png', 1024)]);

    assert
      .dom('input[type="button"][value="Upload Files"]')
      .exists('submit button shows once a file is selected');
  });

  test('@hideSubmit hides the internal Upload Files button', async function (assert) {
    await renderComponent(this, { hideSubmit: true });

    await selectFiles([makeFile('a.png', 'image/png', 1024)]);

    assert
      .dom('input[type="button"][value="Upload Files"]')
      .doesNotExist('parent owns the submit when @hideSubmit is set');
  });

  test('@storeFiles is invoked with the chosen files on change', async function (assert) {
    let received = null;
    await renderComponent(this, {
      storeFiles: (files) => {
        received = files;
      },
    });

    await selectFiles([makeFile('a.png', 'image/png', 1024)]);

    assert.ok(received, 'storeFiles callback fired');
    assert.strictEqual(received.length, 1, 'received the selected FileList');
    assert.strictEqual(received[0].name, 'a.png');
  });

  test('a successful image upload posts to /image and reports results', async function (assert) {
    let uploadResults = null;
    this.setFetch((url) => {
      assert.strictEqual(url, '/image', 'posts image files to /image');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ images: [{ _id: 'img-1' }] }),
      });
    });

    await renderComponent(this, {
      handleUploadResults: (results) => {
        uploadResults = results;
      },
    });

    await selectFiles([makeFile('a.png', 'image/png', 1024)]);
    await click('input[type="button"][value="Upload Files"]');

    assert.ok(Array.isArray(uploadResults), 'handleUploadResults received array');
    assert.strictEqual(uploadResults.length, 1);
    assert.strictEqual(this.pushPayloadCalls.length, 1, 'images pushed to store');
    assert.strictEqual(this.toastCalls[0].type, 'success', 'success toast shown');
    assert
      .dom('.upload-results')
      .hasText('1 file uploaded successfully!', 'singular results message');
  });

  test('a successful pdf upload posts to /pdf', async function (assert) {
    let uploadResults = null;
    this.setFetch((url) => {
      assert.strictEqual(url, '/pdf', 'posts pdf files to /pdf');
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ images: [{ _id: 'page-1' }, { _id: 'page-2' }] }),
      });
    });

    await renderComponent(this, {
      handleUploadResults: (results) => {
        uploadResults = results;
      },
    });

    await selectFiles([makeFile('doc.pdf', 'application/pdf', 2048)]);
    await click('input[type="button"][value="Upload Files"]');

    assert.strictEqual(uploadResults.length, 2, 'both pages returned');
    assert
      .dom('.upload-results')
      .hasText('2 files uploaded successfully!', 'plural results message');
  });

  test('an over-sized single file is rejected before any upload', async function (assert) {
    await renderComponent(this);

    await selectFiles([makeFile('huge.png', 'image/png', 16 * MB)]);
    await click('input[type="button"][value="Upload Files"]');

    assert.strictEqual(this.fetchCalls.length, 0, 'no request is sent');
    assert
      .dom('.error-text')
      .hasText(
        'The file huge.png (16.0MB) was not accepted due to exceeding the size limit of 15.0MB'
      );
  });

  test('exceeding the total image size limit blocks the upload', async function (assert) {
    await renderComponent(this);

    await selectFiles([
      makeFile('a.png', 'image/png', 30 * MB),
      makeFile('b.png', 'image/png', 30 * MB),
    ]);
    await click('input[type="button"][value="Upload Files"]');

    assert.strictEqual(this.fetchCalls.length, 0, 'no request is sent');
    assert
      .dom('.error-text')
      .hasText(
        'Sorry, the total size of your image uploads (60.0MB) exceeds the maximum of 50.0MB'
      );
  });

  test('a server error surfaces a message and is handed to errorHandling', async function (assert) {
    this.setFetch(() =>
      Promise.resolve({
        ok: false,
        status: 413,
        text: () =>
          Promise.resolve(
            JSON.stringify({ errors: [{ detail: 'too large' }] })
          ),
      })
    );

    await renderComponent(this);

    await selectFiles([makeFile('a.png', 'image/png', 1024)]);
    await click('input[type="button"][value="Upload Files"]');

    assert
      .dom('.error-message')
      .hasText(
        'Upload is too large for the server limit. Try fewer/smaller files, or ask an admin to increase the upload limit.'
      );
    assert.strictEqual(
      this.handleErrorsCalls.length,
      1,
      'errorHandling.handleErrors invoked'
    );
    assert.strictEqual(this.handleErrorsCalls[0].key, 'uploadErrors');
  });

  test('@doResetFilesAfterUpload clears the input after a successful upload', async function (assert) {
    await renderComponent(this, { doResetFilesAfterUpload: true });

    await selectFiles([makeFile('a.png', 'image/png', 1024)]);
    assert.dom('input[type="button"][value="Upload Files"]').exists();

    await click('input[type="button"][value="Upload Files"]');

    assert
      .dom('input[type="button"][value="Upload Files"]')
      .doesNotExist('files cleared, so the submit button disappears again');
    assert.strictEqual(
      document.querySelector('input.image-upload').value,
      '',
      'the real file input is reset'
    );
  });
});
