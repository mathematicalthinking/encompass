import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';

export default class WorkspaceListItemComponent extends Component {
  @service('sweet-alert') alert;
  @service('workspace-permissions') permissions;
  @service router;
  @service store;

  @tracked showMoreMenu = false;

  _isDestroyed = false;

  menuOptions = [
    {
      label: 'Copy',
      value: 'copy',
      action: 'copyWorkspace',
      icon: 'fas fa-copy',
    },
    {
      label: 'Assign',
      value: 'assign',
      action: 'assignWorkspace',
      icon: 'fas fa-list-ul',
    },
    {
      label: 'Hide',
      value: 'hide',
      action: 'hideWorkspace',
      icon: 'fas fa-archive',
    },
    {
      label: 'Delete',
      value: 'delete',
      action: 'deleteWorkspace',
      icon: 'fas fa-trash',
    },
  ];

  constructor() {
    super(...arguments);
    registerDestructor(this, () => {
      this._isDestroyed = true;
      document.removeEventListener('click', this.handleDocumentClick);
    });
  }

  get ellipsisMenuOptions() {
    const ws = this.args.workspace;
    const currentUser = this.args.currentUser;
    const hiddenWorkspaces = currentUser.get('hiddenWorkspaces');
    const deleted = ws.get('isTrashed');
    const canDelete = this.permissions.canDelete(ws);
    const canCopy = this.permissions.canCopy(ws);
    let options = this.menuOptions.slice();

    if (currentUser.isStudent) {
      options = options.filter((option) => option.value !== 'assign');
    }
    if (!canDelete || deleted) {
      options = options.filter((option) => option.value !== 'delete');
    }
    if (!canCopy) {
      options = options.filter((option) => option.value !== 'copy');
    }
    if (
      hiddenWorkspaces.length >= 1 &&
      hiddenWorkspaces.includes(ws.get('id'))
    ) {
      options = options.filter((option) => option.value !== 'hide');
    }
    if (deleted) {
      options = [
        {
          label: 'Restore',
          value: 'restore',
          action: 'restoreWorkspace',
          icon: 'fas fa-undo',
        },
      ];
    }
    return options;
  }

  // close the menu when clicking anywhere else on the page
  handleDocumentClick = () => {
    this.showMoreMenu = false;
    document.removeEventListener('click', this.handleDocumentClick);
  };

  closeMenu() {
    if (!this._isDestroyed && this.showMoreMenu) {
      this.showMoreMenu = false;
    }
    document.removeEventListener('click', this.handleDocumentClick);
  }

  @action
  toggleShowMoreMenu(event) {
    // don't let this click reach the document listener that closes the menu
    event?.stopPropagation();
    this.showMoreMenu = !this.showMoreMenu;
    if (this.showMoreMenu) {
      document.addEventListener('click', this.handleDocumentClick);
    } else {
      document.removeEventListener('click', this.handleDocumentClick);
    }
  }

  @action
  runMenuOption(option, event) {
    // keep the click off the .more toggle (was `bubbles=false`)
    event?.stopPropagation();
    this.closeMenu();
    switch (option.action) {
      case 'copyWorkspace':
        return this.copyWorkspace();
      case 'assignWorkspace':
        return this.assignWorkspace();
      case 'hideWorkspace':
        return this.hideWorkspace();
      case 'deleteWorkspace':
        return this.deleteWorkspace();
      case 'restoreWorkspace':
        return this.restoreWorkspace();
      default:
        return undefined;
    }
  }

  copyWorkspace() {
    this.router.transitionTo('workspaces.copy', {
      queryParams: { workspace: this.args.workspace.get('id') },
    });
  }

  async assignWorkspace() {
    const initialRequest = this.store.createRecord('copyWorkspaceRequest');
    const sections = await this.store.findAll('section');
    const workspace = this.args.workspace;
    const workspaceName = workspace.get('name');
    const options = {};
    for (const section of sections.slice()) {
      options[section.id] = section.name;
    }
    const { value } = await this.alert.showPromptSelect(
      'Assign Workspace to class',
      options,
      'Choose a class'
    );
    if (!value) return;
    const section = await this.store.findRecord('section', value);
    const { value: mode } = await this.alert.showPromptSelect(
      'Assign to groups, individuals, or both?',
      { group: 'Groups', individual: 'Individuals', both: 'Both' },
      'Select'
    );
    const { value: parentChoice } = await this.alert.showModal(
      'info',
      'Make Parent Workspace?',
      null,
      'Yes',
      'No'
    );
    const currentUser = this.args.currentUser;
    const request = {
      batchClone: {
        mode,
        section,
        sectionId: section.id,
        createParent: !!parentChoice,
      },
      createDate: new Date(),
      name: `${workspaceName} / ${section.name}`,
      isTrashed: false,
      lastModifiedDate: new Date(),
      mode: 'private',
      submissionOptions: { all: true },
      folderOptions: {
        folderSetOptions: { doCreateFolderSet: false },
        none: true,
      },
      selectionOptions: { none: true },
      commentOptions: { none: true },
      responseOptions: { none: true },
      permissionOptions: {},
      copyWorkspaceError: null,
      createdBy: currentUser,
      lastModifiedBy: currentUser,
      owner: currentUser,
      originalWsId: workspace,
      createdWorkspace: null,
      createdFolderSet: null,
    };
    for (const key in request) {
      initialRequest[key] = request[key];
    }
    await initialRequest.save();
  }

  deleteWorkspace() {
    const workspace = this.args.workspace;
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to delete this workspace?',
        null,
        'Yes, delete it'
      )
      .then((result) => {
        if (!result.value) {
          return;
        }
        workspace.set('isTrashed', true);
        workspace
          .save()
          .then(() => {
            this.closeMenu();
            this.alert
              .showToast(
                'success',
                'Workspace Deleted',
                'bottom-end',
                5000,
                true,
                'Undo'
              )
              .then((toastResult) => {
                if (toastResult.value) {
                  workspace.set('isTrashed', false);
                  workspace.save().then(() => {
                    this.alert.showToast(
                      'success',
                      'Workspace Restored',
                      'bottom-end',
                      3000,
                      false,
                      null
                    );
                  });
                }
              });
          })
          .catch((err) => {
            console.log('error', err);
          });
      });
  }

  hideWorkspace() {
    const workspaceId = this.args.workspace.get('id');
    const user = this.args.currentUser;
    this.alert
      .showModal(
        'question',
        'Are you sure you want to hide this workspace?',
        'This will remove this workspace from your view, you can always restore this later',
        'Yes, hide it'
      )
      .then((result) => {
        if (!result.value) {
          return;
        }
        const hiddenWorkspaces = user.get('hiddenWorkspaces');
        hiddenWorkspaces.pushObject(workspaceId);
        user.set('hiddenWorkspaces', hiddenWorkspaces);
        user
          .save()
          .then(() => {
            this.closeMenu();
            this.alert
              .showToast(
                'success',
                'Workspace Hidden',
                'bottom-end',
                5000,
                true,
                'Undo'
              )
              .then((toastResult) => {
                if (toastResult.value) {
                  const hidden = user.get('hiddenWorkspaces');
                  hidden.removeObject(workspaceId);
                  user.set('hiddenWorkspaces', hidden);
                  user.save().then(() => {
                    this.alert.showToast(
                      'success',
                      'Workspace Restored',
                      'bottom-end',
                      3000,
                      false,
                      null
                    );
                  });
                }
              });
          })
          .catch((err) => {
            console.log('error', err);
          });
      });
  }

  restoreWorkspace() {
    const workspace = this.args.workspace;
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to restore this workspace?',
        null,
        'Yes, restore it'
      )
      .then((result) => {
        if (!result.value) {
          return;
        }
        workspace.set('isTrashed', false);
        workspace
          .save()
          .then(() => {
            this.closeMenu();
            this.alert.showToast(
              'success',
              'Workspace Restored',
              'bottom-end',
              5000,
              false,
              null
            );
          })
          .catch((err) => {
            console.log('error', err);
          });
      });
  }
}
