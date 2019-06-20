module.exports = {
  user: {
    username: 'perryz',
    password: 'apple%1',
    email: 'encmath2@gmail.com',
    name: 'Perry Zeller',
    badEmail: 'nonexistant@fake.com',
    badUsername: 'fakeusername'
  },

  student: {
    username: 'tracyc'
  },

  messages: {
    errors: {
      missing: 'Missing Required Fields',
      tooMuch: 'Please provide only one of username or password.',
      noEmail: 'There is no EnCoMPASS account associated with that email address',
      noUsername: 'There is no EnCoMPASS account associated with that username',
      noAssociatedEmail: 'You must have an email address associated with your EnCoMPASS account in order to reset your password'
    },
    success: {
      completed: 'An email with further instructions has been sent to the email address on file.'
    }
  }
};