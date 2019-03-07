
const resetTokenEmail = function(recipient, host, token, user) {
  if (!recipient) {
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

const confirmEmailAddress = function(recipient, host, token, user) {
  if (!recipient) {
    return;
  }
  return {
    to: recipient,
    from: 'encompassmath@gmail.com',
    subject: 'Please confirm your EnCoMPASS email address',
    text: `You are receiving this because you (or someone else) have signed up for an EnCOMPASS account.
    Please click on the following link, or paste it into your browser to confirm your email address: http://${host}/#/auth/confirm/${token}

    Once your email address is confirmed, the final step is for an administrator to approve and authorize your account.

    If you did not sign up for an EnCOMPASS account, please contact an administrator at encompassmath@gmail.com.`,
  };
};

const newlyAuthorized = function(recipient, host, token, user) {
  if (!recipient) {
    return;
  }
  return {
    to: recipient,
    from: 'encompassmath@gmail.com',
    subject: 'You have been authorized as an EnCoMPASS user!',
    text: `Congratulations! Your EnCoMPASS account has been authorized. Please visit http://${host}/ to login and begin exploring the software.

    If you did not sign up for an EnCOMPASS account, please contact an administrator at encompassmath@gmail.com.`,
  };
};

const newUserNotification = function(recipient, host, token, user) {
  if (!recipient) {
    return;
  }
  let username;


  if (user) {
    username = user.username;
  } else {
    username = '';
  }


  return {
    to: recipient,
    from: 'encompassmath@gmail.com',
    subject: 'A new user has registered an EnCoMPASS account',
    text: `A new user (username: ${username}) just signed up for an EnCoMPASS account and is waiting to be authorized. Please visit http://${host}/ to login and navigate to the users portal to view users that are waiting for authorization.`
  };
};



module.exports.resetTokenEmail = resetTokenEmail;
module.exports.confirmEmailAddress = confirmEmailAddress;
module.exports.newlyAuthorized = newlyAuthorized;
module.exports.newUserNotification = newUserNotification;