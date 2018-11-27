module.exports = {
  general: {
    successMessage: ".success-message",
    errorMessage: ".error-message",
    newErrorMessage: ".error-box"
  },
  topBar: {
    login: "a.menu.login",
    signup: "a.menu.signup",
    workspaces: "a.menu.workspaces",
    responses: "a.menu.responses",
    users: "#users-home",
    logout: "a.menu.logout",
    problems: "#problems-home",
    workspacesNew: "a.workspaces-new",
    home: "a.menu.home",
    problemsNew: "a.menu.problems-new",
    sections: "#sections-home",
    sectionsNew: "a.menu.sections-new",
    usersNew: "a.menu.users-new"
  },
  login: {
    username: "input[name=username]",
    password: "input[name=password]",
    submit: "button[type=submit]",
    google: 'a[href="/auth/google"]',
    signup: "a.signup-link"
  },
  signup: {
    form: "form.form-signup",
    inputs: {
      name: "input[name=name]",
      email: "input[name=email]",
      confirmEmail: "input[name=confirmEmail]",
      organization: 'div.selectize-input input[type="select-one"]',
      location: "input[name=location]",
      username: "input[name=username]",
      password: "input[name=password]",
      confirmPassword: "input[name=confirmPassword]",
      requestReason: "input[name=requestReason]",
      terms: "input[name=terms]"
    },
    submit: "button[type=submit]"
  },
  newProblem: {
    form: "form#newproblemform",
    inputs: {
      name: "input#title",
      question: "div.ql-editor",
      category: "#add-category",
      additionalInfo: "textarea.additional-info-area",
      copyrightNotice: "#copyright",
      sharingAuth: "#sharing",
      author: "#author",
      // isPublicYes: 'input.public',
      // isPublicNo: 'input.private',
      justMe: "input.justMe",
      myOrg: "input.myOrg",
      everyone: "input.everyone",
      file: "input.image-upload"
    },
    imageUpload: "form.image-upload",
    submit: "button.action_button"
  },
  greeting: "#current-username",
  errorMessage: ".error-message",
  successMessage: ".success-message",

  newSection: {
    form: "form#newsectionform",
    inputs: {
      name: "input#newSectionName",
      teacher: "input.typeahead"
    },
    fixedInputs: {
      teacher: "p.section-new-info.teacher",
      organization: "p.section-new-info org"
    },
    create: "button.action_button"
  },
  resetPassword: {
    resetForm: "form.form-reset",
    inputs: {
      password: "input#password",
      confirmPassword: "input#confirmPassword"
    },
    submit: "#reset-password",
    invalidToken: "p.error-message"
  },

  forgotPassword: {
    forgotForm: "form.form-forgot",
    inputs: {
      email: "input#email",
      username: "input#username"
    },
    submit: "button#request-reset-link"
  },

  confirmEmail: {
    submit: "#reset-password",
    invalidToken: "p.error-message",
    successMessage: "p.success-message",
    loginLink: "a.login-link",
    infoMessage: "p.info",
    newEmailButton: "button.action_button",
    resentConfirm: "p#resent-confirm"
  },

  newWorkspaceEnc: {
    form: "#encImportForm",
    create: "button.create-ws",
    clear: "i.fa.fa-times",
    filterCriteria: {
      list: "ol.filter-criteria",
      inputs: {
        teacher: "li.ws-filter.teacher select",
        assignment: "li.ws-filter.assignment select",
        problem: 'li.ws-filter input[type="select-one"]',
        section: "li.ws-filter.section select",
        date: "#dateRange"
      },
      fixedInputs: {
        teacher: "li.ws-filter.teacher p"
      }
    },
    workspaceSettings: {
      list: "ol.workspace-settings",
      inputs: {
        owner: "li.ws-settings.owner select",
        name: "li.ws-settings.name",
        folders: "li.ws-settings.folders select",
        modePrivate: 'input[value="private"]',
        modePublic: 'input[value="public"]'
      },
      fixedInputs: {
        owner: "li.ws-settings.owner p"
      }
    }
  },
  errorPage: {
    div: ".error-page"
  },
  sectionInfo: {
    details: {
      name: "div.section-info-detail.name p",
      assignments: "div.section-info-detail.assignments ul",
      teachers: "div.section-info-detail.teachers ul",
      students: "div.section-info-detail.students ul"
    },
    newSectionButton: "#new-section-link"
  },

  sectionHome: "div#section-home",

  problemPageSelectors: {
    problemContainer: "#problem-list-container",
    sideFilterOptions: ".filter-options",
    problemsListing: ".list-view"
  },


  resultsMesasage: 'div.results-message',
  noResultsMsg: 'No results found. Please try expanding your filter criteria.',

  problemFilterList: {
    primaryFilters: [
      { primaryFilterList: ".primary-filter-list" },
      {
        all: "li.filter-all",
        adminOnly: true,
        children: [
          { adminProblemFilters: "#admin-problem-filter" },
          { adminSelectSearch: "#admin-filter-select" },
          { orgFilterSearch: "#all-org-filter" },
          { creatorFilterSearch: "#all-user-filter" }
        ]
      },
      { mine: "li.filter-mine" },
      {
        myOrg: "li.filter-myOrg",
        children: [
          { recommended: "li.recommended"},
          { createdOrg: "li.fromOrg" }
        ]
      },
      { public: "li.filter-everyone" },
      { categoryHeader: ".category-header" },
      {
        moreHeader: ".more-header",
        adminOnly: true,
        children: [
          { moreFilterList: "ul.more-filter-list" },
          { trashedProblems: "#toggle-trashed" }
        ]
      }
    ],
    categoryFilters: [
      { categoryHeader: ".category-header" },
      { categoryFilterList: "ul.category-filter-list" },
      { showCategoryBtn: ".show-category-btn" },
      { includeSubCategories: "#toggle-sub-cats" },
    ]
  },

  sweetAlert: {
    heading: 'h2#swal2-title',
    confirmBtn: 'button.swal2-confirm',
    select: 'select.swal2-select'
  },

  problemNew: {
    problemNewHeading: '#problem-new .side-info-menu .info-details .info-main .heading',
    problemNewBtn: 'div.searchbar #problem-new-link',
    menuTab: '#problem-new .side-info-menu .info-details .info-menu button.tab-name.',
    inputLabel: '#problem-new .side-info-menu .info-content .info-content-label.',
    inputTextbox: '#problem-new .side-info-menu .info-content .info-content-block .input-container input',
    inputQuill: '#problem-new .side-info-menu .info-content .info-content-block .quill-container section',
    inputContentBlock: '#problem-new .side-info-menu .info-content .info-content-block',
    privacySetting: '#problem-new .side-info-menu .info-content .info-content-block.privacy ul li.radio-item label.radio-label input.everyone',
    selectedCatsList: '#problem-new .side-info-menu .info-content .info-content-block.categories ul.problem-info li.category-item',
    removeCategoryBtn: '#problem-new .side-info-menu .info-content .info-content-block.categories ul.problem-info li.category-item:first-child button.remove-cat',
    showCatsBtn: 'button.show-cats-btn',
    hideCatsBtn: 'button.hide-cats-btn',
    inputSelectize: '#problem-new .side-info-menu .info-content .info-content-block .selectize-comp',
    inputSelectizeType: '#problem-new .side-info-menu .info-content .info-content-block .selectize-comp  .selectize-control .selectize-input input',
    errorMsgGeneral: 'Please provide all required fields',
    errorMsgLegal: 'Please verify that you have permission to post this problem',
    errorMsgTitle: 'There is already an existing public problem with that title',
    errorBoxDismiss: '.error-box p button i.fa-times',
    primaryButton: 'section.info-actions .buttons-container .right-buttons button.primary-button',
    cancelButton: 'section.info-actions .buttons-container .right-buttons button.cancel-button',
  },

  problemInfo: {
    privacySettingParent: '#problem-info .info-header span.top-left-icon',
    privacySetting: '#problem-info .info-header span.top-left-icon i.',
    problemName: '#problem-info .side-info-menu .info-details .info-main .heading',
    problemDate: '#problem-info .side-info-menu .info-details .info-main .subheading',
    problemMenuTab: '#problem-info .side-info-menu .info-details .info-menu button.tab-link.',
    problemStatement: '#problem-info .side-info-menu .info-details .info-content .info-content-block p',
    problemStatementCont: '#problem-info .side-info-menu .info-details .info-content .info-content-block.statement',
    problemAuthor: '#problem-info .side-info-menu .info-details .info-content .info-content-block.author',
    problemOrg: '#problem-info .side-info-menu .info-details .info-content .info-content-block.org',
    problemStatus: '#problem-info .side-info-menu .info-details .info-content .info-content-block .status-text',
    flagReasonBtn: '#problem-info .side-info-menu .info-details .info-content .info-content-block .show-reason',
    flagReasonCont: '#problem-info .side-info-menu .info-details .info-content .info-content-block div.flag-reason',
    flagReason: '#problem-info .side-info-menu .info-details .info-content .info-content-block div.flag-reason p.reason',
    flagReasonDetails: '#problem-info .side-info-menu .info-details .info-content .info-content-block div.flag-reason p.details',
    problemCategory: '#problem-info .side-info-menu .info-details .info-content .info-content-block ul li.category-item a',
    problemCategoryNone: '#problem-info .side-info-menu .info-details .info-content .info-content-block.categories',
    problemCategoryItem: '#problem-info .side-info-menu .info-details .info-content .info-content-block ul li.category-item',
    problemCategoryHeader: '#problem-info .side-info-menu .info-details .info-content .info-content-block.categories',
    problemKeyword: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords ul li',
    problemKeywordNone: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords',
    problemKeywordHeader: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords',
    additionalInfo: '#problem-info .side-info-menu .info-details .info-content .info-content-block.additional',
    additionalImage: '#problem-info .side-info-menu .info-details .info-content .info-content-block.image',
    origin: '#problem-info .side-info-menu .info-details .info-content .info-content-block.origin',
    creator: '#problem-info .side-info-menu .info-details .info-content .info-content-block.creator',
    copyright: '#problem-info .side-info-menu .info-details .info-content .info-content-block.copyright p',
    copyrightNone: '#problem-info .side-info-menu .info-details .info-content .info-content-block.copyright',
    sharingAuth: '#problem-info .side-info-menu .info-details .info-content .info-content-block.sharing',
    assignButton: 'section.info-actions .buttons-container .right-buttons button.primary-button.assign',
    editButton: 'section.info-actions .buttons-container .right-buttons button.primary-button.edit',
    copyButton: 'section.info-actions .buttons-container .left-buttons span button i.fa-copy',
    recommendButton: 'section.info-actions .buttons-container .left-buttons span button.star-icon',
  },

  problemEdit: {
    privacySettingIcon: '#problem-info .info-header span.top-left-icon i',
    privacySettingSelect: '#problem-info .info-header div.select-container select#privacy-select',
    problemNameInput: '#problem-info .side-info-menu .info-details .info-main .heading input#title',
    problemDate: '#problem-info .side-info-menu .info-details .info-main .subheading',
    problemMenuTab: '#problem-info .side-info-menu .info-details .info-menu button.tab-link.',
    problemStatement: '#problem-info .side-info-menu .info-details .info-content .info-content-block div.quill-container section#editor div.ql-editor',
    problemAuthor: '#problem-info .side-info-menu .info-details .info-content .info-content-block.author div.input-container input#author',
    problemStatus: '#problem-info .side-info-menu .info-details .info-content .info-content-block #my-select',
    problemStatusFixed: '#problem-info .side-info-menu .info-details .info-content .info-content-block .status-text',
    problemCategoryItem: '#problem-info .side-info-menu .info-details .info-content .info-content-block ul li.category-item',
    problemCategoryRemove: 'button.remove-cat',
    problemCategoryAdd: '#problem-info .side-info-menu .info-details .info-content .info-content-block.categories div button.cancel-button',
    problemCategoryList: '#problem-info .side-info-menu .info-details .info-content .info-content-block.categories ul li',
    keywordParent: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords .selectize-comp #select-edit-keywords div.selectize-control.multi',
    keywordInput: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords .selectize-comp div.selectize-control.multi div.selectize-input input#select-edit-keywords-selectized',
    keywordsListing: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords ul li',

    // additionalInfo: '#problem-info .side-info-menu .info-details .info-content .info-content-block.additional',
    // additionalImage: '#problem-info .side-info-menu .info-details .info-content .info-content-block.image',
    // origin: '#problem-info .side-info-menu .info-details .info-content .info-content-block.origin',
    // creator: '#problem-info .side-info-menu .info-details .info-content .info-content-block.creator',

    copyright: '#problem-info .side-info-menu .info-details .info-content .info-content-block.copyright input#copyright',
    sharingAuth: '#problem-info .side-info-menu .info-details .info-content .info-content-block.sharing input#sharing',
    deleteButton: 'section.info-actions .buttons-container .left-buttons button.button-icon i.fa-trash',
    cancelButton: 'section.info-actions .buttons-container .right-buttons button.cancel-button',
    saveButton: 'section.info-actions .buttons-container .right-buttons button.save',
  },


  longString: "Pellentesque suscipit efficitur turpis, ut auctor nisl gravida vitae. Aliquam venenatis, lacus id tristique placerat, est diam vehicula magna, nec ultricies nunc massa sit amet tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec dignissim, ipsum a congue pulvinar, arcu tellus aliquam velit, sit amet dictum dui elit at ligula. Morbi sed felis et diam tincidunt efficitur. Pellentesque vehicula vehicula iaculis. Ut aliquam urna metus. Vestibulum metus purus, dignissim in vestibulum.",
};