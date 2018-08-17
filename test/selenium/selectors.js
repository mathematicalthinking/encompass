module.exports = {
  general: {
    successMessage: '.success-message',
    errorMessage: '.error-message',
  },
  topBar: {
    login: 'a.menu.login',
    signup: 'a.menu.signup',
    workspaces: 'a.menu.workspaces',
    responses: 'a.menu.responses',
    users: '#users-home',
    logout: 'a.menu.logout',
    problems: '#problems-home',
    workspacesNew: 'a.workspaces-new',
    home: 'a.menu.home',
    problemsNew: 'a.menu.problems-new',
    sections: '#sections-home',
    sectionsNew: 'a.menu.sections-new',
    usersNew: 'a.menu.users-new'

  },
  login: {
    username: 'input[name=username]',
    password: 'input[name=password]',
    submit: 'button[type=submit]',
    google: 'a[href="/auth/google"]',
    signup: 'a.signup-link'
  },
  signup: {
    form: 'form.form-signup',
    inputs: {
      name: 'input[name=name]',
      email: 'input[name=email]',
      confirmEmail: 'input[name=confirmEmail]',
      organization: 'input[name=organization]',
      location: 'input[name=location]',
      username: 'input[name=username]',
      password: 'input[name=password]',
      confirmPassword: 'input[name=confirmPassword]',
      requestReason: 'input[name=requestReason]',
      terms: 'input[name=terms]'
    },
    submit: 'button[type=submit]'
  },
  newProblem: {
    form: 'form#newproblemform',
    inputs: {
      name: 'input#title',
      question: 'input#text',
      category: 'input#categories',
      additionalInfo: 'input#additionalInfo',
      // isPublicYes: 'input.public',
      // isPublicNo: 'input.private',
      justMe: 'input.justMe',
      myOrg: 'input.myOrg',
      everyone: 'input.everyone',
      file: 'input.image-upload'
    },
    imageUpload: 'form.image-upload',
    submit: 'button.action_button'
  },
  greeting: '#current-username',
  errorMessage: '.error-message',
  successMessage: '.success-message',

  newSection: {
    form: 'form#newsectionform',
    inputs: {
      name: 'input#newSectionName',
      teachers: 'input#teacher'
    },
    create: 'button.action_button'
  },
  resetPassword: {
    resetForm: 'form.form-reset',
    inputs: {
      password: 'input#password',
      confirmPassword: 'input#confirmPassword'
    },
    submit: '#reset-password',
    invalidToken: 'p.error-message',
  },

  forgotPassword: {
    forgotForm: 'form.form-forgot',
    inputs: {
      email: 'input#email',
      username: 'input#username'
    },
    submit: 'button#request-reset-link',
  },

  confirmEmail: {
    submit: '#reset-password',
    invalidToken: 'p.error-message',
    successMessage: 'p.success-message',
    loginLink: 'a.login-link',
    infoMessage: 'p.info',
    newEmailButton: 'button.action_button',
    resentConfirm: 'p#resent-confirm',
  }
};