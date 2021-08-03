import Mixin from '@ember/object/mixin';






export default Mixin.create({
  getVmtHost() {
    let hostname = window.location.hostname;
    let vmtUrl;

    if (hostname === 'localhost') {
      vmtUrl = 'http://localhost:3001';
    } else if (hostname === 'enc-test.mathematicalthinking.org') {
      vmtUrl = 'https://vmt-test.mathematicalthinking.org';
    } else if (hostname === 'encompass.mathematicalthinking.org') {
      vmtUrl = 'https://vmt.mathematicalthinking.org';
    } else {
      return;
    }
    return vmtUrl;

  },
});