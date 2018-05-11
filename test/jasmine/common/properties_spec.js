describe("Properties", function() {

  var Properties = window.Properties;
  var jsAdmin = { id: 1, username: 'alice', isAdmin: true };
  var jsAlice = { id: 1, username: 'alice' };
  var jsBob   = { id: 2, username: 'bob' };
  var jsWorkspace = { owner: jsAlice, editors: [ jsBob ] };

  // should this test for throwing error if
  // hard is truthy and else warning if
  it("can resolveProperty() for a standard javascript object", function() {
    expect(Properties.resolveProperty('username', jsAlice)).toBe('alice');
    expect(Properties.resolveProperty('id', jsAlice)).toBe(1);
    expect(Properties.resolveProperty('isAdmin', jsAdmin)).toBe(true);
  });

  // should we test passing an ember array?
  describe("can resolveUsername() for a standard javascript user", function() {
    it("if passed a user, it get's the username property", function() {
      expect(Properties.resolveUsername(jsAlice)).toBe('alice');
    });
    it("if passed a string it returns the string", function() {
      expect(Properties.resolveUsername('alice')).toBe('alice');
    });
    it("if passed a list, it resolves the username property for each", function() {
      expect(Properties.resolveUsername(['alice', jsBob, jsAlice])).toEqual(['alice', 'bob', 'alice']);
    });
  });

});
