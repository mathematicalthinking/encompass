
module('Workspaces', {
  //setup: function() {
    //Encompass.reset(); 
    // Resetting is apparently sometimes causing issues where 
    // certain tests fail when run altogether but when the failing tests are rerun, they pass
  //},
  teardown: function() {
    Encompass.reset(); 
  }
});

//this started acting up after working on ENC-286
test('visiting the homepage', function() {
  visit('/').then(function() {
    ok(find('a[href^="/workspaces"]').length, 'has a link to the workspaces area');
    ok(find('#al_welcome:contains("Amir T")').length, 'welcomes the user');
  });
});

test('clicking homepage workspaces link and then visiting a workspace', function() {
  visit('/').then(function() {
    click('span.al_link>a:contains("workspaces")').then(function() {
      ok(find('a[href="/"]').length, "has a link to the homepage");
      equal(find('a.workspace').length, 2, "has links to 2 workspaces");
      ok(find('span.workspace_name:contains("Period 3")').length, "has a link to the period 3 workspace");
      click('span.workspace_name:contains("Period 3")').wait().then(function() {
        ok(find('h2:contains("Period 3 Triangle Tops Workspace")').length, "the workspace title should display");
        //Submissions are now sorted on the front-end, we can no longer assume sort order
        // this wasn't assuming sort order, it was assuming we're on the "first" submission
        // does this mean we might get dropped off in submission number 7 when we first visit? -Amir
        ok(find('.submission_index:contains("1")').length, "we should be on the first submission");
        ok(find('.submission_count:contains("2")').length, "there should be two submissions");
        ok(find('div#al_submission div.short:contains("short 1")').length, "the first submission should be showing");
        ok(find('header>#studentList>li:first:contains("Student 1")').length, "the first submission should be Student 1"); //ENC-391, ENC-392
        ok(find('header>#studentList>li:last:contains("Ztudent 2")').length, "the last submission should be Ztudent 2");   //ENC-391, ENC-392
        equal(currentRouteName(), "workspace.submission.index", "we should be looking at a submission");
        click('div.al_controller>a>span.al_arrow_right').then(function(){
          ok(find('.submission_index:contains("2")').length, "after clicking the right arrow we should be on the second submission");
          ok(find('div#al_submission div.short:contains("222")').length, "the second submission should be showing");
        });
      });
    });
  });
});

//test('visiting a selection', function() {
//  visit('/workspaces/1/submissions/1').wait().then(function() {
//    click('a.selection_text').wait().then(function() {
//      ok(find('header.can-comment').length, 'the notice/wonder header should be active');
//      ok(find('header.notice.can-comment #noticeTab').length, 'the notice tab should be active');
//      fillIn('#commentTextarea', 'AbcXyz123')
//      .click('#al_comments button:contains("SAVE")').then(function(){
//        equal(find('#commentTextarea')[0].value, '', 
//          'and the textarea should clear out');
//        //TODO - for some reason these stopped working around r31358
//        // they do work in the browser
//        //ok(find('li.notice>p:contains("AbcXyz123")').length,
//        //  'after making a comment it should show up below');
//        //equal(find('li.notice>a:contains("+")').length, 1, 'the comment reuse link should be a plus sign when its not been reused');
//      });
//    });
//  });
//});

test('making a selection in a workspace', function() {
  visit('/workspaces/1/submissions/1').wait().then(function() {
    var selectionHighlighting = new SelectionHighlighting({
      selectableContainerId: 'submission_container' 
    });
    selectionHighlighting.init();
    selectionHighlighting.createSelectionWithoutMouse('node-1 2 0 node-1 2 5');
    equal(selectionHighlighting.getSelection(0).text, 'short',
      'selecting the first five letters of short answer equals "short"');
    selectionHighlighting.destroy();
  }).then(function() {
    var selectionHighlighting = new SelectionHighlighting({
      selectableContainerId: 'submission_container'
    });
    selectionHighlighting.init();
    selectionHighlighting.createSelectionWithoutMouse('node-1 2 5 node-2 2 1');
    equal(selectionHighlighting.getSelection(0).coords, 'node-1 2 5 node-2 2 1',
      'can select across multiple elements');
    selectionHighlighting.destroy();
  }).then(function() {
    // jshint camelcase:false
    Encompass.__container__.lookup('controller:workspaceSubmission').send('addSelection', {
      id: 5,
      coords: 'node-3 1 2 node-3 1 4',
      comments: [],
      text: 'bogus selection',
      selectionType: 'selection'
    });
  }).wait().then(function(){
    ok(find('a.selection_text:contains("bogus selection")').length, 
      'after making a selection the selection shows up');
  });
});

test('the make selection checkbox is on by default', function() {
  visit('/workspaces/1/submissions/1');
  andThen(function() {
    ok(find('label.makingSelection>input:checked').length, 'make selections is on');
  });
});

test('the make selection checkbox stays on after for other submissions', function() {
  visit('/workspaces/1/submissions/1');
  click('.al_arrow_right');
  click('.al_arrow_right');
  andThen(function() {
    ok(find('label.makingSelection>input:checked').length, 'make selections is on');
    ok(find('#node-3:contains("italics")').length, 'the sub-elements of the long answer have been given id attributes'); //ENC-450
  });
});

//re-enable once teardown/reset is in place - something is off
//test('the make selection checkbox is sticky (keeps state across workspaces)', function() {
//  visit('/workspaces/1/submissions/1');
//  click('label.makingSelection');
//  visit('/workspaces/2/submissions/1');
//  andThen(function() {
//    equal(0, find('label.makingSelection>input:checked').length, 'make selections is off');
//  });
//});

test('playing with folders: popup and cancel', function() {
  visit('/workspaces/1/submissions/1').then(function() {
    ok(find('span.al_remove_folder').length, 'there should be an edit folder button');
    ok(find('span.al_folder').length, 'there should be some folders');
  })
  .click('span.al_remove_folder').then(function() {
    ok(find('span.al_folder.al_remove').length,
      'there should be delete buttons for the folders after clicking edit');
    ok(find('span.al_wtf.move_up').length,
      'there should be move up arrows for the folders after clicking edit');
    ok(find('span.al_wtf.move_down').length,
      'there should be move down arrows for the folders after clicking edit');
  })
  .click('span.al_folder.al_remove').then(function() {
    ok(find('form#al_remove_folder:contains("Remove this folder")').length,
      'there should be a dialog asking you to remove the folder');
  })
  .click('form#al_remove_folder a.al_popup_close')
  .click('span.al_remove_folder.al_cancel').then(function() {
    ok(find('span.al_folder').length,
      'after canceling the removal and remove folder mode we should be back to normal with folder icons');
  });
});

test('playing with folders: moving', function() {
  var folderA = "Kyle Folder 1";
  var folderB = "Kyle Folder 2";
  var up = "li[title='" + folderA + "'] span.al_wtf.move_up"; 
  var down = "li[title='" + folderA + "'] span.al_wtf.move_down"; 

  visit('/workspaces/1/submissions/1').then(function() {

    click('span.al_remove_folder').then(function() {  
      var folders = find('#al_folders .folderItem');
      equal(folders.eq(0).attr('title'), folderA,
        'Before moving, the first folder should be Kyle Folder 1');
    })
    .click(down).then(function() {
      var folders = find('#al_folders .folderItem');
      equal(folders.eq(0).attr('title'), folderB,
        'After moving down, Kyle Folder 1 should be the second folder');
      equal(folders.eq(1).attr('title'), folderA,
        'and, Kyle Folder 2 should be the first folder');
    })
    .click(up).then(function() {
      var folders = find('#al_folders .folderItem');
      equal(folders.eq(0).attr('title'), folderA,
        'After moving down, Kyle Folder 1 should be the second folder');
      equal(folders.eq(1).attr('title'), folderB,
        'and, Kyle Folder 2 should be the first folder');
    });
  });
});
