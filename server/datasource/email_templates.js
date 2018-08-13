
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

module.exports.resetTokenEmail = resetTokenEmail;