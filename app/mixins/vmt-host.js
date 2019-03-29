Encompass.VmtHostMixin = Ember.Mixin.create({
  getVmtHost() {
    let hostname = window.location.hostname;
    let vmtUrl;

    if (hostname === 'localhost') {
      vmtUrl = 'localhost:3000';
    } else if (hostname === 'enc-test.mathematicalthinking.org') {
      vmtUrl = 'vmt-test.mathematicalthinking.org';
    } else if (hostname === 'encompass.mathematicalthinking.org') {
      vmtUrl = 'vmt.mathematicalthinking.org';
    } else {
      return;
    }
    return vmtUrl;

  },
});