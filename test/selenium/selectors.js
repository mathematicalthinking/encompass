module.exports = {
  topBar: {
    login: 'a.menu.login',
    signup: 'a.menu.signup',
    workspaces: 'a.menu.workspaces',
    responses: 'a.menu.responses',
    users: 'a.menu.users',
    logout: 'a.menu.logout',
    problems: 'a.menu.problems',
    workspacesNew: 'a.workspaces-new',
    home: 'a.menu.home',
    problemsNew: 'a.menu.problems-new',
    sections: 'a.menu.sections',
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
      organization: 'input[name=organization]',
      location: 'input[name=location]',
      username: 'input[name=username]',
      password: 'input[name=password]',
      requestReason: 'input[name=requestReason]',
      terms: 'input[name=terms]'
    },
    submit: 'button[type=submit]'
  },
  newProblem: {
    form: 'form#problem',
    inputs: {
      name: 'input#title',
      question: 'input#text',
      category: 'input#categories',
      additionalInfo: 'input#additionalInfo',
      isPublicYes: 'input.public',
      isPublicNo: 'input.private',
      file: 'input.image-upload'
    },
    imageUpload: 'form.image-upload',
    submit: 'button.action_button'
  },
  greeting: '#current-username',
  errorMessage: '.error-message',
  successMessage: '.success-message',

  newSection: {
    form: 'form#section',
    inputs: {
      name: 'input#newSectionName',
      teachers: 'input#teacher',
    },
    create: 'button.action_button'
  }
};