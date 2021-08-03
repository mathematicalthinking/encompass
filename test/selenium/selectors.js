module.exports = {
  general: {
    successMessage: ".success-message",
    errorMessage: ".error-message",
    newErrorMessage: ".error-box",
    boldFontWeight: '700',
    unreadReplyFill: 'rgb(57, 151, 238)',
    pendingFill: 'rgb(255, 210, 4)',
    errorBox: '.error-box',
    selectizeActiveEl : 'div.option.active',
    errorBoxDismiss: '.error-box p button i.fa-times',
    errorBoxText: 'div.error-box p span.error-text'
  },
  topBar: {
    login: "li[data-test=login]",
    signup: "li[data-test=signup]",
    workspaces: "a.workspaces",
    responses: "a.menu.responses",
    users: "#users-home",
    logout: `a[href="/logout"]`,
    problems: "#problems-home",
    workspacesNew: "a.workspaces-new",
    home: "a.home",
    problemsNew: "a.menu.problems-new",
    sections: "#sections-home",
    sectionsNew: "a.menu.sections-new",
    usersNew: "a.menu.users-new",
    assignments: "a.assignments",
    responseNtf: 'li[data-test="topbar-responses"] .circle-ntf span',
    vmtImport: 'a.menu.vmt-import',
  },
  login: {
    username: "input[name=username]",
    password: "input[name=password]",
    submit: "button[type=submit]",
    google: `a[href="http://localhost:3002/oauth/google?redirectURL=http://localhost:8081"]`,
    signup: "p[data-test=auth-signup] > a",
  },
  signup: {
    form: "form.form-signup",
    inputs: {
      firstName: "input[name=first-name]",
      lastName: "input[name=last-name]",
      email: "input[name=email]",
      confirmEmail: "input[name=confirmEmail]",
      organization: 'div.selectize-input input[type="select-one"]',
      location: "input[name=location]",
      username: "input[name=username]",
      password: "input[name=password]",
      confirmPassword: "input[name=confirmPassword]",
      requestReason: "input[name=requestReason]",
      terms: "input[name=terms]",
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
    resentConfirm: "p#resent-confirm",
    alreadyConfirmed: `p[data-test="already-confirmed"]`
  },

  newWorkspaceEnc: {
    form: "#encImportForm",
    create: "button.create-ws",
    clear: "i.fa.fa-times",
    filterCriteria: {
      list: "ol.filter-criteria",
      inputs: {
        teacher: "#select-add-teacher-selectized",
        assignment: "#select-add-assignment-selectized",
        problem: '#select-add-problem-selectized',
        section: "#select-add-section-selectized",
        date: "#startDate"
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
    container: 'form[data-test="section-info-form"]',
    details: {
      name: 'p[data-test="section-name-display"]',
      assignments: "div.section-info-detail.assignments ul",
      teachers: "div.section-info-detail.teachers ul",
      students: "div.section-info-detail.students ul"
    },
    newSectionButton: "#new-section-link",
    editButtons: {
      students: 'i[data-test="edit-students"]'
    }
  },

  sectionHome: "div#section-home",

  problemPageSelectors: {
    problemContainer: "#problem-list-container",
    sideFilterOptions: ".filter-options",
    problemsListing: ".list-view"
  },


  resultsMessage: 'div.results-message',
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
    cancelBtn: 'button.swal2-cancel',
    select: 'select.swal2-select',
    container: '.swal2-container',
    textInput: 'input.swal2-input[type=text]',
    modal: '.swal2-modal',
    toasts: {
      title: 'div.swal2-toast > .swal2-header > #swal2-title'
    }
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
    errorMsgTitle: 'There is already an existing public problem titled "Alphabetical Problem."',
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
    problemStatus: '#problem-info .side-info-menu .info-details .info-content .info-content-block .my-select',
    problemStatusFixed: '#problem-info .side-info-menu .info-details .info-content .info-content-block .status-text',
    problemCategoryItem: '#problem-info .side-info-menu .info-details .info-content .info-content-block ul li.category-item',
    problemCategoryRemove: 'button.remove-cat',
    problemCategoryAdd: '#problem-info .side-info-menu .info-details .info-content .info-content-block.categories div button.cancel-button',
    problemCategoryList: '#problem-info .side-info-menu .info-details .info-content .info-content-block.categories ul li',
    keywordParent: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords .selectize-comp #select-edit-keywords div.selectize-control.multi',
    keywordInput: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords .selectize-comp div.selectize-control.multi div.selectize-input input#select-edit-keywords-selectized',
    keywordsListing: '#problem-info .side-info-menu .info-details .info-content .info-content-block.keywords ul li',
    additionalInfo: '#problem-info .side-info-menu .info-details .info-content .info-content-block.additional div.input-container textarea.additional-info-area',
    additionalImage: '#problem-info .side-info-menu .info-details .info-content .info-content-block.image div.input-container div#image-upload',
    origin: '#problem-info .side-info-menu .info-details .info-content .info-content-block.origin p a',
    creator: '#problem-info .side-info-menu .info-details .info-content .info-content-block.creator p a',
    copyright: '#problem-info .side-info-menu .info-details .info-content .info-content-block.copyright input#copyright',
    sharingAuth: '#problem-info .side-info-menu .info-details .info-content .info-content-block.sharing input#sharing',
    deleteButton: 'section.info-actions .buttons-container .left-buttons button.button-icon i.fa-trash',
    cancelButton: 'section.info-actions .buttons-container .right-buttons button.cancel-button',
    saveButton: 'section.info-actions .buttons-container .right-buttons button.save',
    errorBox: '#problem-info .side-info-menu div.error-box',
    errorBoxText: '#problem-info .side-info-menu div.error-box p span.error-text',
    errorBoxDismiss: '#problem-info .side-info-menu div.error-box p button.dismiss i',
  },


  longString: "Pellentesque suscipit efficitur turpis, ut auctor nisl gravida vitae. Aliquam venenatis, lacus id tristique placerat, est diam vehicula magna, nec ultricies nunc massa sit amet tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec dignissim, ipsum a congue pulvinar, arcu tellus aliquam velit, sit amet dictum dui elit at ligula. Morbi sed felis et diam tincidunt efficitur. Pellentesque vehicula vehicula iaculis. Ut aliquam urna metus. Vestibulum metus purus, dignissim in vestibulum.",
  assignmentsStudent: {
    ownList: 'ul.your-assignments',
    infoPage: {
      container: 'section',
      submitBtn: 'button.primary-button',
      pastSubsHeader: '#past-submissions-header',
      subList: 'ol.submission-list'
    },
    newAnswerForm: {
      container: 'form#newanswerform',
      inputs: {
        briefSummary: 'textarea[name="brief-summary"]',
        explanation: 'div.new-answer-input.explanation div.ql-editor',
        studentList: 'div.student-list ul',
        contributors: 'div.new-answer-input.contributors input'
      },
      createBtn: 'button.primary-button.create',
     errors: {
      duplicateRevisionText: 'Revison cannot be exact duplicate of original'
     }
    },
    answerInfo: {
      container: '#answer-info',
      briefSummary: 'div.info-detail.brief-summary p',
      explanation: 'div.info-detail.explanation',
      studentList: 'div.info-detail.students ul'

    }
  },
  responsesList: {
    submitterTab: '#response-list-tabs span.submitter',
    mentoringTab: '#response-list-tabs span.mentoring' ,
    approvingTab: '#response-list-tabs span.approver',
    responseThreads: '.main-list .response-submission-thread',
    sortBar: {
      student: '.sort-bar-item.student',
      workspace: '.sort-bar-item.workspace',
      submissionDate: '.sort-bar-item.submission-date',
      problem: '.sort-bar-item.problem',
      mentor: '.sort-bar-item.mentor',
      replyDate: '.sort-bar-item.reply-date',
      status: '.sort-bar-item.status'
    },
    threadItemContainer: '.response-submission-thread .item-container',
    threadItems: {
      student: '.item-section.student',
      workspace: '.item-section.workspace span',
      submissionDate: '.item-section.submission-date span',
      problem: '.item-section.problem',
      mentors: '.item-section.mentor span',
      replyDate: '.item-section.reply-date span',
      statusText: '.item-section.status span.status-text',
      statusCircle: '#container > div.item-section.status > svg > circle',
      ntfBell: '#container > div.item-section.status > i.far.fa-bell'
    }
  },
  responseInfo: {
    submissionView: {
      studentIndicator: '#response-submission-view > div.submission-container > div.submission-student > span',
      reviseBtn: 'button[data-test="submitter-revise"]',
      submitRevision: 'button[data-test="submit-answer"]',
      revIndexItem: '.student-submissions .bread-crumbs-item'
    },
    mentorReplyView: {
      recipient: '.response-value.recipient',
      sender: 'div.response-users > p:nth-child(2) > span.response-value',
      saveButton: 'button.primary-button.save-response',
      saveAsDraft: 'button.primary-button.save-draft',
      statusText: '.status-text.mentor-reply',
      unreadIcon: 'span.response-read-unread i.far.fa-envelope'
    }
  },
  workspace: {
    newResponse: '.submission-row-item.new-response > button.new-response',
    studentsSelect: '.submission-row-item.students > .selectize-comp',
    studentItem: 'div.selectize-input.items.full.has-options.has-items > div',
    studentSelect: '#student-select',
    dropdownContent: '.selectize-dropdown-content',
    container: '#workspace-container',
    name: '.ws-meta .workspace-name',
    submissionNav: {
      count: '.submission_count',
      index: '.submission_index',
      rightArrow: '#rightArrow',
      leftArrow: '#leftArrow'
    },
    tour: {
      xBtn: 'div.guiders_x_button',
      overlay: '#guiders_overlay',
    },
    toggleSelectingInput: 'input[type=checkbox][name=is-selecting]',
    selectableArea: {
      container: '#selectable-area',
    },
    selections: {
      container: '#submission_selections',
      selectionLink: '.selectionLink > a',
      currentSelectionLink: '.selectionLink > a.active',
      draggable: 'draggable-selection',
      selectedDraggable: '.draggable-selection.is-selected',
    },
    folders: {
      add: '.folders-modify-item.add > span',
      showFolderCircle: '',
      edit: '.folders-modify-item.edit > span',
      doneEditingIcon: '.folders-modify-item.edit > span > .fas.fa-check',
      editNameInput: '.edit-folder-name',
    }

  },
  wsInfo: {
    container: '#workspace-info',
    settings: {
      container: '#workspace-info-settings',
      editBtn: 'span[data-test=ws-settings-edit]',
      cancelEdit: '#workspace-info-settings > div > div.card-content > div.card-row.button-row > button.primary-button.cancel-button',
      saveEdit: '#workspace-info-settings > div > div.card-content > div.card-row.button-row > button:nth-child(2)',
      editName: '#edit-name-input',
      nameText: '#workspace-info-settings > div > div.card-content > div:nth-child(1) > div.row-value',
      autoUpdateSelect: 'div[data-test="allow-updates"] > .my-select > select',
      autoUpdateText: 'div[data-test="allow-updates"]',
      updateSuccessText: 'Workspace Updated',
      linkedAssnInput: '#linked-assignment-select-selectized',
      linkedAssnText: 'div[data-test="linked-assn"]',
      updateParentWs: 'button[data-test=parent-ws-update]'
    },
    collabs: {
      container: '#workspace-info-collaborators',
      addBtn: '#workspace-info-collaborators > div > div.heading > span > i',
      usernameInput: '#collab-select-selectized',
      usernameText:'div.selectize-control.single',
      saveCollab: '#workspace-info-collaborators-new > div > div:nth-child(3) > div > button:nth-child(2)',
      collabItems: '#workspace-info-collaborators > div > div.card-content > div',
      permissionsList: {
        groupInput: 'input["name=globalPermissionValue"]',
        viewOnly: 'input["value=viewOnly"]'
      }

    },
    stats: {
      container: '#workspace-info-stats'
    }
  },
  assignmentsTeacher: {
    editAssignment: 'button[data-test="edit-assignment"]',
    trashBtn: 'button[data-test="trash-assn"]',
    confirmTrash: 'body > div.swal2-container.swal2-center.swal2-fade.swal2-shown > div > div.swal2-actions > button.swal2-confirm.swal2-styled',
    saveAssignment: 'button[data-test=assn-save]',
    cancelAssignment: 'button[data-test=assn-cancel]',
    container: '#assignment-info-teacher',
    sideList: {
      yours: 'ul.your-assignments'
    },
    linkedWorkspaces: {
      container: '#linked-workspaces-new',
      link: '.info-flex-item.linked-ws > ul > li > a',
      add: 'button[data-test=add-linked-ws]',
      nameInput: '#linked-ws-new-name',
      create: 'button[data-test=add-linked-ws-create]',
      cancel: 'button[data-test=add-linked-ws-cancel]',
      fullLinkedMsg: 'p[data-test=info-full-linked-ws]',
      namePreviews: '.name-previews > ul > li',
    },
    parentWorkspace: {
      container: '#parent-workspace-new',
      link: '.info-flex-item.parent-ws > a',
      add: 'button[data-test=add-parent-ws]',
      nameInput: '#parent-ws-new-name',
      create: 'button[data-test=add-parent-ws-create]',
      cancel: 'button[data-test=add-parent-ws-cancel]',
      noParentMsg: 'p[data-test=info-no-parent-ws]',
    },
    report: {
      table: 'table.report.rows.values',
      counts: 'td.count',
      usernames: 'td.username',
      dates: 'td.latest-date',
    }
  },
  wsComments: {
    save: '#comment-list > div.comments-group-1 > div.compose-comment > div > button.primary-button.save',
    cancel: '#comment-list > div.comments-group-1 > div.compose-comment > div > button.primary-button.cancel-button',
    commentText: 'div.comment-flex-item.text > p:nth-child(1) > a',
    commentActions: 'div.comment-flex-item.actions',
    textArea: '#commentTextarea',
    commentTypeSelect: 'div.label-select select',
    commentListItem: '.ws-comment-comp',
  },
  vmtImport: {
    search: {
      container: '.vmt-search',
      input: '.search-field',
    },
    wsOptions: {
      container: '#import-work-step5',
      createWsRadio: 'input[name=createWs][value=true]',
      doNotCreateWsRadio: 'input[name=createWs][value=false]',
      wsSettings: {
        container: '.create-ws-content',
        nameInput: '#ws-new-name',
        ownerInput: '#owner-select-selectized',
        folderSetInput: '#folderset-select-selectized'
      }

    },
    next: 'button[data-test="next"]',
    cancel: '.cancel-button',
    noRoomsError: 'Please select at least one room or activity to proceed',
    noRoomsResult: 'No rooms',
    noActivitiesResult: 'No activities',
    activityListItem: '.vmt-activity-list-item',
    roomListItem: '.vmt-room-list-item',
    activityNoRoomsError: 'This activity does not have any rooms',
    selectedRoomsDisplay: 'p.display-info',
    reviewStep: {
      container: '#vmt-import-step4',
      create: 'button[data-test=create]'
    },
    noRoomsItem: 'li[data-test=no-rooms]',
    noActivitiesItem: 'li[data-test=no-activities]',
  },
  assignmentsNew: {
    container: '#assignment-new',
    inputs: {
      section: {
        input: '#assn-new-section-select-selectized',
      },
      problem: {
        input: '#assn-new-problem-select-selectized',
      },
      linkedWorkspaces: {
        groupName: 'linkedWorkspaces',
        yes: {
          value: "true"
        },
        no: {
          value: "false"
        }
      },
      parentWorkspace: {
        groupName: 'parentWorkspace',
        yes: {
          value: 'true',
        },
        no: {
          value: 'false'
        }
      }

    },
    submitBtn: 'button[data-test=create]',
  },
  responsesNew: {
    saveBtn: 'button.save-response'
  }
};