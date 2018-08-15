
const resetTokenEmail = function(recipient, host, token) {
  if (! recipient) {
    return;
  }
  return {
    to: recipient,
    from: 'encompassmath@gmail.com',
    subject: 'Request to reset your EnCoMPASS password',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process: http://${host}/#/auth/reset/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`,
  };
};

const confirmEmailAddress = function(recipient, host, token) {
  if (! recipient) {
    return;
  }
  return {
    to: recipient,
    from: 'encompassmath@gmail.com',
    subject: 'Please confirm your EnCoMPASS email address',
    text: `You are receiving this because you (or someone else) have signed up for an EnCOMPASS account.
    Please click on the following link, or paste it into your browser to confirm your email address: http://${host}/#/auth/confirm/${token}

    Once your email address is confirmed, the final step is for an administrator to approve and authorize your account.

    If you did not sign up for an EnCOMPASS account, please contact an administrator at admin@mathematicalthinking.org.`,
  };
};



module.exports.resetTokenEmail = resetTokenEmail;
module.exports.confirmEmailAddress = confirmEmailAddress;