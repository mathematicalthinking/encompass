module('Workspace Info', {
  teardown: function() {
    Encompass.reset(); 
    // Resetting is apparently sometimes causing issues where 
    // certain tests fail when run altogether but when the failing tests are rerun, they pass
  }
});

////this started acting up after working on ENC-286 and ENC-450
//and again when upgrading ember/ember-data in the 1.0.4 branch
//test('on the workspace working area', function() {
//  visit('/workspaces/1/submissions/1').then(function() {
//    ok(find('a[href^="/workspaces/1/info"]').length, 'there is a link to the workspace info page');
//    click('a[href^="/workspaces/1/info"]').then(function() {
//      ok(find('a[href^="/workspaces/1/work"]').length, 'there is a link back to the workspaces area');
//    });
//  });
//});

test('when visiting your own workpace info page', function() {
  visit('/workspaces/1/info').then(function() {
    ok(find('span.owner:contains("amir")').length, 'the owner username is displayed');
    ok(find('button.action_button:contains("Edit")').length, 'there is an edit button');
    equal(find('section.attributes input').length, 0, 'there are no editable fields');
    click(find('button.action_button:contains("Edit")')).then(function() {
      ok(find('section.attributes input').length, 'until you click edit');
      fillIn('input.search', 'am').then(function(){
        equal(find('button.addEditor').length, 2, 'after starting to search buttons will appear to allow you to add the editor');
        click(find('button.addEditor:first')).then(function() {
          equal(find('li.editor').length, 1, 'after adding an editor, there should be one editor');
          click(find('span.remove_editor:first')).then(function() {
            equal(find('li.editor').length, 0, 'after removing an editor, there should be zero editors');
            click(find('button.action_button:contains("Save")')).then(function() {
              equal(find('section.attributes input').length, 0, 'after clicking save there are no editable fields');
            });
          });
        });
      });
    });
  });
});

test('when visiting someone else\'s workpace info page', function() {
  Encompass.User.FIXTURES[0].isAdmin = false;
  //and you aren't an admin
  visit('/workspaces/2/info').then(function() {
    ok(find('span.owner:contains("some_trial_user")').length, 'the owner username is displayed');
    equal(find('button.action_button:contains("Edit")').length, 0, 'there is no edit button');
  });
});

test('visiting one workspace and then another (ENC-424)', function() {
  visit('/workspaces/2/info').then(function() {
    visit('/workspaces/1/info').then(function() {
      ok(find('button.action_button:contains("Edit")').length, 'there is an edit button');
    });
  });
  
});

test('private should be the default option for workspaces (ENC-425)', function() {
  visit('/workspaces/1/info').wait().then(function() {
    click(find('button.action_button:contains("Edit")')).then(function() {
      equal(find('select.workspaceMode>option')[0].value, 'private');
    });
  });
});
