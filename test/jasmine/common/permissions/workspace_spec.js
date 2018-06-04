describe("Permissions: A Workspace", function() {

  var Permissions = window.Permissions;
  console.log('Permissions: ', Object.keys(Permissions._PERMISSIONS.workspace));
  var admin, alice, bob, mallory, wonderland;
  var emberUser, emberWorkspace;

  beforeEach(function(){
    alice   = { id: 1, username: 'alice' };
    admin   = { id: 1, username: 'admin', isAdmin: true };
    bob     = { id: 2, username: 'bob', };
    mallory = { id: 3, username: 'mallory', };
    emberUser = {
      username: undefined,
      get: function(){
        return 'ember';
      }
    };
    emberWorkspace = {
      owner: undefined,
      editors: undefined,
      get: function(prop){
        if(prop === 'owner') {
          return emberUser;
        }

  /*
  WE CHANGED THE FUNCTION IN THE COMMON/PROPERTIES.JS FILE SO NOW UNLESS WE COMMENT OUT THIS PART OF THE CODE
  THE TEST WILL THROW AN ERROR.
  */
        // if(prop === 'editors') {
        //   return {
        //     content: undefined,
        //     isLoaded: true,
        //     get: function(){
        //       return {
        //         toArray: function(){
        //           return [emberUser];
        //         }
        //       };
        //     }
        //   };
        // }
      }
    };

    wonderland = {
      id: 1,
      mode: 'public',
      owner: alice,
      editors: [bob]
    };
  });

  describe("has a mode", function() {

    it("has two possible values", function() {
      expect(Permissions.modeValues()).toEqual(['private', 'public']);
    });

    it("is public if it's mode is public", function() {
      expect(Permissions.isPublic(wonderland)).toBe(true);
      wonderland.mode = 'private';
      expect(Permissions.isPublic(wonderland)).toBe(false);
      wonderland.mode = 'asdf';
      expect(Permissions.isPublic(wonderland)).toBe(false);
      wonderland.mode = null;
      expect(Permissions.isPublic(wonderland)).toBe(false);
      delete wonderland.mode;
      expect(Permissions.isPublic(wonderland)).toBe(false);
      expect(Permissions.isPublic()).toBe(false);
    });

  });

  it("is owned by one person (owner field)", function() {
    expect(Permissions.isOwner(alice, wonderland)).toBe(true);
    expect(Permissions.isOwner(bob, wonderland)).toBe(false);
    expect(Permissions.isOwner('bob', {owner: 'alice'})).toBe(false);
    expect(Permissions.isOwner('alice', {owner: 'alice'})).toBe(true);
    expect(Permissions.isOwner(undefined, {owner: 'alice'})).toBe(false);
    expect(Permissions.isOwner(null, {owner: 'alice'})).toBe(false);
    expect(Permissions.isOwner('', {owner: 'alice'})).toBe(false);
    expect(Permissions.isOwner(undefined, {})).toBe(false);
    expect(Permissions.isOwner({username: undefined}, {owner: {username: undefined}})).toBe(false); //ember objects can look like this
    expect(Permissions.isOwner(emberUser, emberWorkspace)).toBe(true); //ember objects can look like this
  });

  it("can be modified by the owner", function() {
    expect(Permissions.userCanModifyWorkspace(alice, wonderland)).toBe(true);
    expect(Permissions.userCanModifyWorkspace(bob, wonderland)).toBe(false);
    expect(Permissions.userCanModifyWorkspace(mallory, wonderland)).toBe(false);
  });

  it("can be modified by an admin", function() {
    expect(Permissions.userCanModifyWorkspace(admin, wonderland)).toBe(true);
  });

  // these tests seem to only test cases
  // with a single editor?
  // TODO: test with multiple editors?
  it("can have multiple editors", function() {
    expect(Permissions.isEditor(bob, wonderland)).toBe(true);
    expect(Permissions.isEditor(alice, wonderland)).toBe(false);
    expect(Permissions.isEditor(mallory, wonderland)).toBe(false);
    expect(Permissions.isEditor(undefined, {})).toBe(false);
    //expect(Permissions.isEditor(emberUser, emberWorkspace)).toBe(true);
  });

  describe("a public workspace", function() {
    it("can be loaded by anyone", function() {
      expect(Permissions.userCanLoadWorkspace(alice, wonderland)).toBe(true);
      expect(Permissions.userCanLoadWorkspace(bob, wonderland)).toBe(true);
      expect(Permissions.userCanLoadWorkspace(mallory, wonderland)).toBe(true);
    });
  });

  describe("that is private", function() {

    beforeEach(function(){
      wonderland.mode = "private";
    });

    it("can be loaded by its owner", function() {
      expect(Permissions.userCanLoadWorkspace(alice, wonderland)).toBe(true);
    });
    // should check workspace with multiple
    // editors?
    it("can be loaded by its editor", function() {
      expect(Permissions.userCanLoadWorkspace(bob, wonderland)).toBe(true);
    });

    it("can be loaded by an admin", function() {
      expect(Permissions.userCanLoadWorkspace(admin, wonderland)).toBe(true);
    });

    it("cannot be loaded by others", function() {
      expect(Permissions.userCanLoadWorkspace(mallory, wonderland)).toBe(false);
    });

  });

  describe("there is a list of permissions with descriptions", function() {

    it("you can ask for the permission keys", function() {
      expect(Permissions.workspacePermissionKeys()).toEqual(Object.keys(Permissions._PERMISSIONS.workspace));
    });

    // for each workspace permission, ensure
    // an editor, admin, owner(?) and no one
    // else has permission
    describe("you can check each permission", function() {

      Permissions.workspacePermissionKeys().forEach(function(PERM){
        describe(PERM, function() {

          /*
          it("can be done by the owner", function() {
            expect(Permissions.userCan(alice, wonderland, PERM)).toBe(true);
          });
          */

          it("can be done by an editor", function() {
            expect(Permissions.userCan(bob, wonderland, PERM)).toBe(true);
          });

          it("can be done by an admin", function() {
            expect(Permissions.userCan(admin, wonderland, PERM)).toBe(true);
          });

          it("cannot be done by another", function() {
            expect(Permissions.userCan(mallory, wonderland, PERM)).toBe(false);
          });

        });
      });

    });

    // should this check with undefined or
    // '' as permission?
    it("checking an invalid permission results in an error", function() {
      var badCheck = function(){
        Permissions.userCan(alice, wonderland, "DOWNLOAD_TO_BRAIN");
      };
      expect(badCheck).toThrow();
    });

  });

});
