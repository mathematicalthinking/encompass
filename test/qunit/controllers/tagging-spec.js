/* global emq, moduleFor, sinon */

emq.globalize();
emq.setResolver(Ember.DefaultResolver.create({ namespace: Encompass }));

moduleFor('controller:comments', 'Comments Controller Tagging', {
  needs: ['controller:folders', 'controller:workspaceSubmissions', 'controller:workspaceSubmission', 'controller:workspace', 'controller:application', 'controller:comments']
});

test('A plain comment', function() {
  var controller = this.subject();
  controller.set('text', 'Good reasoning!');

  ok(!controller.get('textContainsTag'), 'does not contain a tag');

});

test('A comment ending in a tag', function() {
  var controller = this.subject();
  controller.set('text', 'Good reasoning! #reasonable');

  ok(controller.get('textContainsTag'), 'contains a tag');

  var tags = controller.get('tags');
  ok(tags.contains('reasonable'), 'contains the tag');

});

test('Whitespace does not matter', function() {
  var controller = this.subject();
  controller.set('text', 'Good   reasoning!\nReally\tGood! :-) !  #reasonable #correct');

  var tags = controller.get('tags');
  ok(tags.contains('reasonable'), 'contains the first tag');
  ok(tags.contains('correct'), 'contains the second tag');

});

test('A comment ending in several tags', function() {
  var controller = this.subject();
  controller.set('text', 'Good reasoning! #reasonable #correct');

  ok(controller.get('textContainsTag'), 'contains a tag');

  var tags = controller.get('tags');
  ok(tags.contains('reasonable'), 'contains the first tag');
  ok(tags.contains('correct'), 'contains the second tag');

});

test('A comment of only tags', function() {
  var controller = this.subject();
  controller.set('text', '#reasonable #correct');

  ok(controller.get('textContainsTag'), 'contains a tag');

  var tags = controller.get('tags');
  ok(tags.contains('reasonable'), 'contains the first tag');
  ok(tags.contains('correct'), 'contains the second tag');

});

test('A comment with in several tags embedded', function() {
  var controller = this.subject();
  controller.set('text', 'Good reasoning! #reasonable hi #correct cool');

  ok(controller.get('textContainsTag'), 'contains a tag');

  var tags = controller.get('tags');
  ok(tags.contains('reasonable'), 'contains the first tag');
  ok(tags.contains('correct'), 'contains the second tag');

});

test('Tags are case-insensitive', function() {
  var controller = this.subject();
  controller.set('text', 'Good reasoning! #Reasonable #cORRect');

  var tags = controller.get('tags');
  ok(tags.contains('reasonable'), 'contains the first tag');
  ok(tags.contains('correct'), 'contains the second tag');

});

test('Tags keep special marks', function() {
  var controller = this.subject();
  controller.set('text', 'Good reasoning! #reasonable! #correct? #use#ofthings #$100');

  var tags = controller.get('tags');
  ok(tags.contains('reasonable!'), 'contains the first tag');
  ok(tags.contains('correct?'), 'contains the second tag');
  ok(tags.contains('use#ofthings'), 'contains the third tag');
  ok(tags.contains('$100'), 'contains the fourth tag');
});

//test('When a comment is created with tags, an action is sent', function() {
//  var controller = this.subject();
//  var workspaceController = controller.get('controllers.workspace');
//  var selection  = 'fake selection';
//
//  controller.set('model', []);
//  controller.set('text', 'Good reasoning! #reasonable #correct');
//  controller.set('selection', selection);
//  Ember.run(function() {
//    workspaceController.set('currentSelection', selection);
//    controller.set('currentSelection', selection);
//  });
//
//  var mockStore = {
//    createRecord: function(){
//      return {
//        save: function() {
//          return {
//            then: function(){}
//          };
//        }
//      };
//    }
//  };
//
//  controller.store = mockStore;
//
//  sinon.spy(controller, "send");
//  var args = ['tagSelection', selection, ['reasonable', 'correct']];
//  controller.send.withArgs(args);
//
//  controller.send('createComment');
//
//  ok(controller.send.withArgs(args).calledOnce);
//  controller.send.restore();
//  
//});
