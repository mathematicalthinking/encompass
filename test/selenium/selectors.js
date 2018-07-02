module.exports = {
  topBar: {
    login: 'a.menu.login',
    signup: 'a.menu.signup',
    workspaces: 'a.menu.workspaces',
    responses: 'a.menu.responses',
    users: 'a.menu.users',
    logout: 'a.menu.logout',
    problems: 'a.menu.problems',
    workspacesNew: 'a[href="#/workspaces/new"',
    home: 'a.menu.home'

  },
  login: {
    username: 'input[name=username]',
    password: 'input[name=password]',
    submit: 'button[type=submit]'
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
  greeting: '#al_welcome'
};