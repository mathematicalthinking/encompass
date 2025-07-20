These are notes taken as I attempt to upgrade Encompass to Ember 4.5. Note that there is a fair bit of redundancy in this file as these notes are being created as I do the work.

# Backstory

There has been various attempts to upgrade this app to modern Ember (Octane, Ember 4.4, Glimmer components) over the past several years. There has been a great deal of progress, but each developer only got so far. As a result, there is a great deal of incomplete upgrades, so the app consists of Ember elements that were the "proper" way to do things at different periods of time.

This file is an attempt to document what has and has not been done, as well as suggestions for future developers if I (like all others) leave an incomplete upgrade process.

# Notes about the current state (1 Dec 2024)

Enc-test has been updated with the latest version of the work that I've done over the last couple of months, as represented in this file. Of course, there is plenty that does not work; mostly parts of the system that have not yet been upgraded, upgrades that have not been adequately tested, and a few items that I document below that represent my current work when this contracted ended. To help the next developer, there are two files beyond this one:

1. component audit.xls -- contains notes about all components in the Encompass system, including which have been upgraded or deleted.
2. componentFinder.js -- script (run with "node componentFinder") that produces a report of all the components used in the different routes, all the components used by other components, etc. This should help the next developer in understanding how the Encompass app is organized.

## Items in progress

1. user-info component -- mostly works except for a few of the updates: seen tour, authorized, etc.
2. problem-list-container and related components -- trashed problems might not be showing up correctly. Deleting and some actions might not be working.
3. workspace-list-container and related components -- trashed and hidden workspaces might not be showing up correctly. Many of the actions in the three-dot (more) menu are not working.

# Upgrades needed globally

## Use of this.model or @model

There are several components (js or template) that reference the model. In standard Ember practice, only the route templates should access the model and pass along the specific bits of the model needed by each component. That way, there's a single source of model truth (from the route) and we don't have components knowing about what's in the model.

## Use to 'toXXX' methods

There are several, largely unused, methods throughout the codebase such as 'toProblemInfo' that seem to be intended to transition to certain routes. It seems like these are legacy code so should be removed because the more modern approach -- using LinkTo in templates -- seems to be used throughout the app. The use of LinkTo is much better than prop-drilling these 'toXXX' methods.

## Removal of Mixins

A fair number of mixins have been removed, replaced by services or component superclasses. There are still more mixins on some legacy components and elsewhere. The plan is to step through all mixins in app/mixins, replacing them with existing or new services everywhere they are used. See below: on 11/10/2024 I deleted most of them and identified just three that need refactoring before removal.

## Error handling service

The error handling service was previously implemented incorrectly. The ErrorHandling superclass worked, but was a bit obscure in terms of creating properties for the component behind-the-scenes. The corrected error handling service is more explict in how it works and how components should use it. Note that all components that use this service should create a getter to access the errors generated. Also, the component should clean up those errors when it unmounts or at least regularly clean out the errors when we have a successful action. (In January 2025, I added a timer to the ErrorHandling service such that errors automatically clear after 3 minutes.)

Note that there are many classic components that use the error handling service but it does not exactly behave as these components expect, so this needs to be fixed.

But the above is not enough! Apparently the display of errors was a work-in-progresss. There are several components (e.g., workspace-list-container, problem-list-container) that incorporate either the error-handling service, superclass, or mixin, but don't display the errors (albiet they do nicely keep track of them).

## .slice() replaces .toArray()

To convert a RecordArray to a plain JS array, Ember docs now recommend using .slice() because .toArray() has been deprecated. As of 1/2/2025 I've made this replacement in selectize-input.js and troubleshooting.md, but still have to change it in about 55 places among 31 files.

## Store

Store is a service, so there is no need for it to be passed as an argument to a component, route, or controller. This has been corrected for many cases (selectize-input, various aspects of the workspace and problem subsystems), but there are several more uses of @store={{this.store}} that need to be refactored.

## Triple curly braces

These should be replaced with usage of htmlSafe().

## Data down, actions up

A number of components used two-way data binding, which is discouraged in modern Ember. In two-way data binding, it's possible to mutate the value of a property and have that property's value be changed in the property of the original component. Difficulties arise because it's tricky to recognize when two-way data binding is being used and therefore tricky for a new developer to see how (or that) certain property values are being updated.

Instead, modern Ember uses the Data down, Actions up pattern. Parent components send data down to their child components. A parent also sends actions (functions) to the child when updates are needed. When the child wants to update the property's value, it uses the appropriate action (essentially a callback to the parent). In this way, the parent is responsible for all of its properties' values, both getting and setting them.

One way this comes into play is when we update DB objects via editing. Right now, the update to the DB occurs at the component level. I need to think about whether the components should do the updating of those objects or if we should have a service that provides creation and updating methods (deleting is an update in our system). This allows for all DB operations to be centralized rather than spread over components, with a lot of duplicated code.

## Template and Component files

Should be co-located in the app/components folder rather than in the app/templates/components folder. The app/templates folder should be for route templates only. Note that many of the still-to-be upgraded components are split between the folders; the upgraded ones have their hbs files in app/components.

## Vendor imports

Currently, ember-cli-build.js and the vendor/ folder reflects an older-style of imports. Wouldn't it be better to include the necessary packages and import them as needed in the various components?

This has been done for randomcolor, jQuery (older versions), typeahead.js, and selectize. Imports that were unused were deleted, including ajax (it's already part of Ember so no need to import it), daterangePicker, error, ie_hacks, and jquery.mousewheel.

Changing these vendor imports involved installing the corresponding packages (selectize and typeahead.js), then importing those packages into the wrapping components (selectize-input and twitter-typeahead).

There are also several packages that are essentially polyfills for outdated browsers, such as IE.

## Move from built-in Ember components (Input, TextArea, Select, etc.) to the plain HTML versions

As possible, I will be replacing <Input> with <input>, and so forth. Although the Ember built-ins provide some convenience for assessibility options, they also encourage older-style approachs such as two-way data binding. [NOTE: I'm not certain this is always a good idea.]

## Helpers

There were several unused helpers, which have been deleted (10/13/2024 commit). I left in two of them: debug (expect it to be used only for debugging and seems useful) and is-unread-response (not used, but might contain useful logic to help people understand how responses work).

Some of the helpers could be replaced in a future upgrade with built-in helpers: is-in and is-equal.

In Ember 4.5, helpers can now be regular functions rather than wrapped in a manager.

11/14/2024: Upgraded to 4.5 and simplified all helpers.

## Controllers

Controllers may be slated for deprecation. Best practice is to refactor the logic and properties in the controller, distributing them as appropriate to the route (for building the model), a service (for application state that will be used elsewhere), and a component (for everything else). The idea is that a route templates should be simple and reference just one or more components that contain much of the work that had been done by the controller.

## Route Templates

Route templates should refer to the model via @model rather than this.model as per the Ember Octane upgrade guide.

## EmberTable

There are other packages that are more aligned with Glimmer and Octane approaches to Ember. However, depending on the needs, perhaps the 5 uses of EmberTable could be replaced with vanilla JS.

## Independent Components

Each component should have one clearly defined set of responsibilities. Components should be as independent of each other as is feasible. This promotes easing modifications, for example, as we don't need to worry as much about changes having consequences throughout the code or the need to implement new functionality across several components. This approach also limits prop drilling and makes each component easier to understand because it has one job.

The current code includes several subsystems of components that are tightly coupled. Some examples:

- workspace-list-container defined the menu options that were displayed in workspace-list-item. The latter contained all the actions for that menu. In the redesign, the menu options have been defined inside workspace-list-item.
- the way that filtering worked in the workspace subsystem required the different filters to have deep understanding of how the filtering (options and their states) are structured. This has been changed so that each type of filter receives specific options, selections, and the actions to change the selections.

# Possible future upgrades

## Use of window.location.href =

This is a hard reset of the location. We should instead be using the router service to do a transition to a particular route as per router.js.

## Model definitions

All hasMany and belongsTo relationships should specify inverse and async options explicitly. Not doing so is deprecated.

## DB document timestamps

Currently, all timestamping of db documents (users, problems, workspaces, etc.) appears to be done manually primarily on the client side. This approach could cause issues because the clients clocks might be wrong. Also, because the dates are updated manually (all over the codebase), there is a higher likelihood of errors.

Instead, we could leverage the {timestamps: true} option when defining all the Mongoose Schemas. This option has the db (a single source of truth) automatically insert and maintain createdAt and updatedAt fields.

## Route organization

There are several routes directly under the routes/ folder that have corresponding subfolders. For example, there is app/routes/assignments.js as well as app/routes/assignments/assignment.js and app/routes/assignments/new.js. A more consistent naming scheme would be to move these top-level routes to be index.js files in their corresponding folders (e.g., assignments.js file would become app/routes/assignments/index.js). That way, all the related routing files are grouped together.

Another argument for this approach is that this is how the corresponding template files are organized. For example, there is a app/templates/assignments/ folder with index.hbs, assignment.hbs, and new.hbs.

On the other hand, the current structure reflects a parent / child route structure because there are also files such as app/templates/assignments.hbs in addition to app/templates/assignments/index.hbs. On the other hand, we have to ask if the complexity is needed, but that is an issue for another day.

## Component organization

### UI Elements

There is now the folder app/components/ui that contains the form-field and expandable-cell components. The purpose of this folder is a place for generic UI components. Other generic UI components include: my-select, selectize-input, twitter-typeahead, radio-group (and radio-group-item), toggle-control, checkbox-list (and checkbox-list-item), collapsible-list, and quill-container. Once these get moved into that folder, every usage must reference the "Ui" namespace, such as <Ui::ToggleControl /> or <Ui::MySelect />.

### Other components

Similar to the Ui example above, usage of Namespaces is encouraged in Ember moving forward. Thus, we should reorganize the app/components folder with subfolders representing the distinct subsystems of Encompass. The components in the folders would then be referenced in templates via namespaces, such as <Users::UserList> which refers to app/components/users/user-list.js and user-list.hbs.

## New Workspaces

The components workspace-new, workspace-new-enc, and workspace-new-pows are currently not used. They seem to reflect some type of new functionality (rather than template/workspaces/new.hbs and workspace-new-container, which are used) that Pedro was working on but never finished. I'm leaving these files in the codebase with the hope that someday someone will use them to figure out what was being done and to finish the work. Likely the intent was to have tempalte/workspaces/new.hbs use the workspace-new component.

## Removal of underscore and reduction of lodash

Both lodash and underscore are used extensively throughout the app. These cases may be found by searching for where 'underscore' is imported or by searching for an underscore followed by a period. The latter is important because app.js sets the underscore character to be a global ("window.\_").

Underscore is not as well maintained as is lodash, so lodash should be used as needed. Note that underscore is used extensively in the app_server. It is used in about 15 files in the client code.

There are certainly cases where lodash is helpful, but uses of underscore could be replaced by lodash. Also, rather than globally making the underscore character a reference to the entire lodash library, it would be better to import just the lodash functions needed.

Also, rather than lodash, using native JS functions such as map, filter, etc. would be good.

5/5/2025: Lodash global has been replaced by pulling out individual functions from lodash-es. Also, underscore has been removed entirely from the client side.

## Removal of jQuery

Modern Ember recommends removing jQuery, using standard DOM access routines instead. Our file app.js sets $ globally to jQuery, so finding all instances will involve both searching for imports of jQuery and for $ (whether "$." or "$(").

Note that we cannot completely remove jQuery because it's a dependency of selectize. But we can eliminate its use in our own code to be conistent with modern Ember best practices.

## Removal of moment

Moment as a package has a fairly large footprint and is considered a legacy project. Because Encompass uses only uncomplicated pieces of moment, all of the app's usage could be replaced by modern JS or more lightweight, modular packages (e.g., date-fns).

5/24/2025: Changed format-date helper to use date-fns. Removed redundant 'dates' helper and changed its one use in a component. Also removed moment in components/models that I already had upgrade.

## Avoid runtime errors through use of optional chaining and nullish coalescing

Through the use of ?. and ??, we can avoid runtime errors if an attempt is made to get a property from undefined.

## Creation of an api service

Right now, http methods are implemented using $.get(), $.post(), etc. or, on the server side, via axios.get(), axios.post(), etc. Modern Ember encourages the use of the ember-fetch package. With that package, we could make an api service so that client components could do api.get(), api.post(), etc. (A similar centralization could be done on the server side as well.) By centralizing all http requests into a service, it becomes easier to change how http requests are done if ember-fetch ever gets upgraded or a new approach is introduced.

## Superclasses

There are a variety of superclasses

- Component - UserSignUp, ErrorHandling
- Model - Auditable
- Route - Authenticated

I need to figure out if something needs to be done about this. I know that the Component superclasses should be made into services.

In particular, the ErrorHandling superclass works, but it obscures how errors are accumulated (i.e., handleErrors creates a new property in the component that typically the template accesses). See earlier notes on the ErrorHandling service.

## Cleaning up packages and unused elements

I've used ember-unused-components to determine that we do not have any unused components as of late 2024.

npm-check reveals quite a lot of packages that are either unused, in need of upgrade (minor or major). There are several packages listed as missing, but I believe that almost all of these are Ember packages that are automatically loaded elsewhere.

ember-cli-dependency-checker is already installed and it never mentions anything out of the ordinary. Nevertheless, I've manually found a few packages that aren't used (g, gm, gm-reload, express-session) and removed them.

## Simplify the testing frameworks

The codebase currently has tests written in qunit, mocha, chai, jasmine, selenium, and casper.

Overview: (from ChatGPT)

- QUnit - Ember's default framework for unit, integration, and application tests. RECOMMENDED
- Mocha - Alternative to QUnit with a different syntax. Used if your team prefers Mocha's style. REFACTOR TO QUNIT
- Chai - Assertion library often used with Mocha or Jasmine for more expressive tests. REFACTOR TO QUNIT
- Jasmine - Older test framework, largely replaced by Mocha. Sometimes used for legacy projects. REFACTOR TO QUNIT
- Selenium - Browser automation tool, often used for end-to-end (E2E) tests. KEEP OR REFACTOR TO CYPRESS
- CasperJS - Another E2E testing framework, based on PhantomJS. Deprecated and no longer maintained. REFACTOR TO CYPRESS OR SELENIUM

There are several README.md files scattered through the /test folder.

# Incomplete functionality

- **error handling**: Although there is an error-handling service (and previously a mixin and a superclass), error handling is generally incompletely and inconsistently implemented throughout the codebase. Sometimes UI::Errorbox is used; sometimes just plain text. Sometimes errors are arrays of information text; sometimes flags. Sometimes they are distinctly named; sometimes different types of errors and lumped together. Often, a couple of errors are handled by the js file but never displayed in template. Rarely the reverse happens because I've been eliminating or implementing those cases. Overall, I think a more consistent approach is needed, perhaps something even more centralized and less dependent on the same code repeated across many components.
- **imports and vmt**: At some point, all the components related to imports and vmt were switched off (i.e., the routes that would lead the user to those components were emptied out; see router.js). I did not upgrade these components because they weren't currently being used, but I did leave them in place for a future developer.
- **workspace-new-XX**: These components seem like they were the beginning of a refactoring of the creation of new workspaces. However, they were never completed. I've left them in the codebase for futue developers.
- **sockets**: It seems that sockets were going to be used for some type of live notifications. However, none of this doesn't seem like it was used because it the socket connection was never actually set up. I found this out when I fixed service/socket-io.js to use the socket.io-client package and saw that I was getting messages about the socket being connected. I'd never seen them before. I have removed the <SocketLoader /> in application.hbs until a time where we actually use sockets.

## Other upgrades

- **Routes** Many of the routes are in the classic style, so should be upgraded to JS classes, although they all seem to work fine in Ember 4.5.
- **Services** Most of the services are still in the classic style.
- **Models** Several models include component-specific logic, including both derived properties (via get) and functions. Modern Ember encourages leaner models that focus on the data and their relationships. It would be best to trim down several of the models, pushing the specific logic out into the components.

# Gotchas

- For the built-in component <Input>, the id argument should be id= rather than @id=. If you do "@id", the component will not respond to clicks.
- If a classic component receives @store={{this.store}} but this.store (i.e., the argument) is undefined, then that component will see this.store as undefined even if you added store as a service.
- "Error: Expected a dynamic component definition, but received an object or function that did not have a component manager associated with it. The dynamic invocation was <(result of a unknown helper)> or {{(result of a unknown helper)}}, and the incorrect definition is the value at the path (result of a unknown helper), which was: Object". This error has nothing to do with helpers. For some reason, a template file didn't like that I used the standard <input> tag. When I switched to the Ember <Input> tag, the problem went away.
- Occasionally, Ember will fail quietly. For example,

                    this.store
                    .query('workspace', queryParams)
                    .then((results) => {
                        this.removeMessages('workspaceLoadErrors');
                        this.workspaces = results;
                        ... more lines
                    })

If this.removeMessages is undefined, Ember might **not** show an error in the console or indicate anywhere that it failed. Subsequent lines will simply not execute but the app will continue running as if everything is fine.

- Be careful around the use of objects that are being tracked. One must be careful to update their references so that they are reactive. Just setting a property won't be enough unless you use TrackedObject from tracked-built-ins.
- The error "Error while processing route: assignments.new Assertion Failed: Expected hash or Mixin instance, got [object Function]" was just caused by a syntax error in a model. The assertion failed because when hydrating a model, trying get all the documents from the store in that model failed.
- Not really a gotcha, just something about Ember. If there is an async relationship in the route when the model is being put together, there are cases where you'll need to `await` a property access to ensure that the value has arrived.
- a gotcha related to above: 'hash' waits for the resolution of regular Promises but not Ember ProxyPromises. Thus, if there's an async relationship in a model, if you use dot notation you must wait for that access to fully resolve (i.e., use await). 'hash' will not wait for that type of Promise. You'll see this via an error message such as:

`Error while processing route: problems.problem.index Assertion Failed: You attempted to access the recommendedProblems property (of <(unknown):ember236>).
Since Ember 3.1, this is usually fine as you no longer need to use .get() to access computed properties. However, in this case, the object in question is a special kind of Ember object (a proxy). Therefore, it is still necessary to use .get('recommendedProblems') in this case.`

- related to above, in components, dot notation might result in a PromiseProxy. However, if it's used in a template, Ember will re-render once the value is fully resolved, so you don't have to worry about it. However, if you are using the value in js, such as wanting to loop over an array, you need to use await. (Of course, if you are just defining a convenience getter that uses dot notiation for use by a template, you don't have to await.)

- if you forget to put the @action decorator on a function then call it from your template, 'this' will not be defined.

# Current Progress

## CurrentUser service

Today (Feb 10, 2025) I upgraded the currentUser service so that clients don't have to always dig in to the user object it provides. Now you can do this.currentUser.isAdmin, etc., instead of this.currentUser.user.isAdmin. In other words, you can get directly to the most popular properties of user, most of which are getters in the model. Really, though, the model should be simply the specs of the data and the currentUser service should be calculating all the things that right now the user model is doing. Before I do that, I need to make sure that I replace accessing the user object (e.g., this.user.XXX) with accessing the service (e.g., this.currentUser.XXX, but really we could name the service 'user' in the components) in the entire codebase for those calculated properties.

## Upgrade of elements

- **Components** - most of the discussion in this file focuses on the upgrading of components from classic to modern (Glimmer, Octane, Ember 4.5).
- **Adapters** - Upgraded
- **Controllers** - Controllers might be slated to be deprecated in favor of using components. That is, the template for a route would simply contain invocations of one or ore components. Thus, working through the controllers and refactoring to remove them all is another goal of the upgrade.
- **Helpers** - as document elsewhere in this document, all upgraded.
- **Initializers** - only one and I believe it's not needed for production. I upgraded it, however.
- **Mixins** - as documented elsewhere, I'm in the process of eliminating these and double-checking others' work on removing these from components, etc.
- **Routes** - haven't upgraded these as yet (11/22/2024). They seem to work fine but should be upgraded to modern Ember.
- **Serializers** - upgraded
- **Services** - Some are upgraded; some were removed. Some still need to be upgraded.
- **Styles** - everything seems to work, although they could be upgraded to more modern best practices. I'll leave that work for someone with more expertise in CSS and related technologies.
- **Templates** - as documented elsewhere, I've been moving the component templates into app/components as they are upgraded. I've also been deleting templates that are unused. Other types of templates are still in need of upgrading.

## Removal of mixins

The following mixins have been deleted (11/10/2024)

- addable_problems - had been used in one place (workspace-new-enc), however this usage appears to be a no-op. Perhaps someone didn't fully implement some change?
- cacheable_models - not used on the current main branch
- categories_list - usage is commented out on the main branch
- mt_auth - this has been made into a service and is used on the main branch
- user_signup - made into a component superclass on the main branch. The mixin is deleted and the component superclass should be made into a service.

These mixins are slated to be removed:

- current_user -- this is now a service. However, several classic components still use the mixin.
- error_handling -- this is both a service and a component superclass. It should really be only a service. Several classic components still use the mixin.
- vmt-host -- still be used as a mixin on the main branch.

## Upgrade of Helpers

With the upgrade to Ember 4.5 (11/14/2024), all helpers have been simplified to regular functions.

## .gitkeep

Removed all the unnecessary .gitkeep files that were created when the project began 6 years ago. This empty file is just a convention so that git will keep an otherwise empty folder in the history.

## UI folder

As of 12/9, the components/ui folder contains the following:

- checkbox-list, checkbox-list-item
- error-box
- expandable-cell
- form-field
- radio-group, radio-group-item
- twitter-typeahead
- wordcloud-container

Components potentially to include in the ui folder:

- bread-crumbs, bread-crumbs-item
- draggable-selection, DragNDrop, Droppable
- my-select
- pagination-control
- quill-container
- radio-filter
- selectize-input
- toggle-control

The following components, included above, are actually wrappers for third-party packages, so might go into their own folder: (uiwrappers?):

- quill-container
- selectize-input
- twitter-typeahead
- wordcloud-container

## New Routes

- I upgraded the problems parent route:

  - problems/problem/<id>
  - problems/problem/<id>/edit
  - problems/problem/<id>/assignment

  Previously, edit and assignment were handled by flags in the db inside of a problem. When we transitioned to the problem, we first set the correct flag so that <ProblemInfo> would render correctly. With this change, we don't use the db for local application state, which is poor practice.

## Quill upgrades

I upgraded the loading and use of the Quill (enhanced text editing) package:

- Quill is now loaded as any other third party package, rather than via the vendor folder and manual install.
- The Ember component, quill-container, has been upgraded to modern Ember (v4.5 at least).
- The quill-container component has been moved to the components/ui folder.
- In all quill-container clients, the reference has been updated (<<Ui::QuillContainer ...>>)
- TODO: in response-submission-view.hbs, the use of quill-container has always had an incorrect signature. I need to figure out what would be the correct signature should be.

## Validate.js

This package's loading has also been upgrading to the modern approach. TODO -- consider whether a custom utility function should replace using a 3rd party package.

## Twitter typeahead

This package has been removed from the system in favor of a simpler, custom component. The new component is contained within the file twitter-typeahead.js/hbs just to simplify references throughout the system. I tested all clients of the new component and they appear to work. Still need to test the usage in the signup-google component (TODO). Note that getting typeahead to work in some components (section-new, user-info, and user-new) involved upgrades to those components because of various old-style Ember idioms, such as the use of two-way binding.

## lodash-es

loadash-es is now loaded. I did this because some of the regular lodash subpackages (e.g., lodash/isEqual) are being deprecated. Thus, the correct thing to do now is to use lodash-es/isEqual, for example. Eventually, I should change all uses of lodash to lodash-es.

# dropzone.js

(6/4/2025) Removed from the vendor folder. It barely appeared in the codebase and nowadays is handled natively in Javascript.
