module('Workspace New', {
  setup: function() {
    Encompass.reset(); 
    // Resetting is apparently sometimes causing issues where 
    // certain tests fail when run altogether but when the failing tests are rerun, they pass
  }
});

//this started acting up after working on ENC-286
test('on the workspace list page', function() {
  visit('/workspaces').then(function() {
    ok(find('a[href^="/workspaces/new"]').length, 'there is a link to the workspace info page');
    click('a[href^="/workspaces/new"]').then(function() {
      ok(find('a[href^="/workspaces"]').length, 'there is a link back to the workspaces listing page');
    });
  });
});

test('when visiting the new workpace', function() {
  visit('/workspaces/new').then(function() {
    equal(find('section.submissions input.pdImport').val(), "pd", 'by default the PD option is selected');
    equal(find('section.submissions>select>option').length, 2, 'there is the default PD set listed (but the prompt is showing)');
    equal(find('#powImportForm').length, 0, 'the pow input form should not be showing');
    click('section.submissions input.powImport').then(function() {
      equal(find('#powImportForm').length, 1, 'the pow input form should now be showing');
      equal(find('section.submissions>select').length, 0, 'the PD dropdown should no longer be showing');
    });
  });
});

test('when creating a new workspace', function() {
  visit('/workspaces/new').then(function() {
    click('section.submit button.action_button').then(function() {
      // Do something
      ok(true);
    });
  });
});

