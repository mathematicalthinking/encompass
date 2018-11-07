module.exports = {
  general: {
    successMessage: '.success-message',
    errorMessage: '.error-message',
    newErrorMessage: '.error-box',
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
      organization: 'div.selectize-input input[type="select-one"]',
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
      question: 'div.ql-editor',
      category: '#add-category',
      additionalInfo: 'textarea.additional-info-area',
      copyrightNotice: "#copyright",
      sharingAuth: "#sharing",
      author: "#author",
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
      teacher: 'input.typeahead',
    },
    fixedInputs: {
      teacher: 'p.section-new-info.teacher',
      organization: 'p.section-new-info org'
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
  },

  newWorkspaceEnc: {
    form: '#encImportForm',
    create: 'button.create-ws',
    clear: 'i.fa.fa-times',
    filterCriteria: {
      list: 'ol.filter-criteria',
      inputs: {
        teacher: 'li.ws-filter.teacher select',
        assignment: 'li.ws-filter.assignment select',
        problem: 'li.ws-filter input[type="select-one"]',
        section: 'li.ws-filter.section select',
        date: '#dateRange'
      },
      fixedInputs: {
        teacher: 'li.ws-filter.teacher p'
      }
    },
    workspaceSettings: {
      list: 'ol.workspace-settings',
      inputs: {
        owner: 'li.ws-settings.owner select',
        name: 'li.ws-settings.name',
        folders: 'li.ws-settings.folders select',
        modePrivate: 'input[value="private"]',
        modePublic: 'input[value="public"]'
      },
      fixedInputs: {
        owner: 'li.ws-settings.owner p',
      }
    }
  },
  errorPage: {
    div: '.error-page'
  },
  sectionInfo: {
    details: {
      name: 'div.section-info-detail.name p',
      assignments: 'div.section-info-detail.assignments ul',
      teachers: 'div.section-info-detail.teachers ul',
      students: 'div.section-info-detail.students ul'
    },
    newSectionButton: '#new-section-link'
  },

  sectionHome: 'div#section-home',

  problemPageSelectors: {
    problemContainer: '#problem-list-container',
    sideFilterOptions: '.filter-options',
    problemsListing: '.list-view',
  },

  primaryFilters: {
    primaryFilterList: '.primary-filter-list',
    mine: 'li.filter-mine',
    myOrg: 'li.filter-myOrg',
    recommended: 'li.recommended',
    createdOrg: 'li.fromOrg',
    public: 'li.filter-everyone',
  },

  adminFilters: {
    all: 'li.filter-all',
    adminProblemFilters: '#admin-problem-filter',
    adminSelectSearch: '#admin-filter-select',
    orgFilterSearch: '#all-org-filter',
    creatorFilterSearch: '#all-user-filter',
    moreHeader: '.more-header',
    moreFilterList: 'ul.more-filter-list',
    trashedProblems: '#toggle-trashed',
  },

  categoryFilter: {
    categoryHeader: '.category-header',
    categoryFilterList: 'ul.category-filter-list',
    searchCategory: '#categories-filter',
    showCategoryBtn: '.show-category-btn',
    includeSubCategories: '#toggle-sub-cats',
    categoryList: 'ul.selected-cat-list',
  },
};