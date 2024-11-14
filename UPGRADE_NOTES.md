This are notes taken as I attempt to upgrade Encompass to Ember 4.4

# Backstory

There has been various attempts to upgrade this app to modern Ember (Octane, Ember 4.4, Glimmer components) over the past several years. There has been a great deal of progress, but each developer only got so far. As a result, there is a great deal of incomplete upgrades, so the app consists of Ember elements that were the "proper" way to do things at different periods of time.

This file is an attempt to document what has and has not been done, as well as suggestions for future developers if I (like all others) leave an incomplete upgrade process.

# Upgrades needed globally

## Removal of Mixins

A fair number of mixins have been removed, replaced by services or component superclasses. There are still more mixins on some legacy components and elsewhere. The plan is to step through all mixins in app/mixins, replacing them with existing or new services everywhere they are used. See below: on 11/10/2024 I deleted most of them and identified just three that need refactoring before removal.

## Store

Store is a service, so there is no need for it to be passed as an argument to a comopnent, route, or controller. This has been done for many cases (selectize-input, various aspects of the workspace and problem subsystems), but there are several more uses of @store={{this.store}} that need to be refactored.

## Triple curly braces

These should be replaced with usage of htmlSafe().

## Data down, actions up

A number of components used two-way data binding, which is discouraged in modern Ember. In two-way data binding, it's possible to mutate the value of a property and have that property's value be changed in the property of the original component. Difficulties arise because it's tricky to recognize when two-way data binding is being used and therefore tricky for a new developer to see how (or that) certain property values are being updated.

Instead, modern Ember uses the Data down, actions up pattern. Parent components send data down to their child components. A parent also sends actions (functions) to the child when updates are needed. When the child wants to update the property's value, it uses the appropriate action (essentially a callback to the parent). In this way, the parent is responsible for all of its properties' values, both getting and setting them.

## Placement of files

**Template and Component files** should be co-located in the app/components folder rather than in the app/templates/components folder. The app/templates folder should be for route templates only. Note that many of the still-to be upgraded components are split between the folders; the upgraded ones have their hbs files in app/components.

## Imports

Currently, ember-cli-build.js and the vendor/ folder reflects an older-style of imports. Wouldn't it be better to include the necessary packages and import them as needed in the various components?

This has been done for randomcolor, jQuery, and selectize.

## Move from built-in Ember components (Input, TextArea, Select, etc.) to the plain HTML versions

As possible, I will be replacing <Input> with <input>, and so forth. Although the Ember built-ins provide some convenience for assessibility options, they also encourage older-style approachs such as two-way data binding.

## Helpers

There were several unused helpers, which have been deleted (10/13/2024 commit). I left in two of them: debug (expect it to be used only for debugging and seems useful) and is-unread-response (not used, but might contain useful logic to help people understand how responses work).

Some of the helpers could be replaced in a future upgrade with built-in helpers: is-in and is-equal.

In Ember 4.5, helpers can now be regular functions rather than wrapped in a manager.

11/14/2024: Upgraded to 4.5 and simplified all helpers.

## EmberTable

There are other packages that are more aligned with Glimmer and Octane approaches to Ember. However, depending on the needs, perhaps the 5 uses of EmberTable could be replaced with vanilla JS.

## Independent Components

Each component should have one clearly defined set of responsibilities. Components should be as independent of each other as is feasible. This promotes easing modifications, for example, as we don't need to worry as much about changes having consequences throughout the code or the need to implement new functionality across several components. This approach also limits prop drilling and makes each component easier to understand because it has one job.

The current code includes several subsystems of components that are tightly coupled. Some examples:

- workspace-list-container defined the menu options that were displayed in workspace-list-item. The latter contained all the actions for that menu. In the redesign, the menu options have been defined inside workspace-list-item.
- the way that filtering worked in the workspace subsystem required the different filters to have deep understanding of how the filtering (options and their states) are structured. This has been changed so that each type of filter receives specific options, selections, and the actions to change the selections.

# Possible future upgrades

## Removal of underscore and reduction of lodash

Both lodash and underscore are used extensively throughout the app. These cases may be found by searching for where 'underscore' is imported or by searching for an underscore followed by a period. The latter is important because app.js sets the underscore character to be a global ("window.\_").

Underscore is not as well maintained as is lodash, so lodash should be used as needed. Note that underscore is used extensively in the app_server. It is used in about 15 files in the client code.

There are certainly cases where lodash is helpful, but uses of underscore could be replaced by lodash. Also, rather than globally making the underscore character a reference to the entire lodash library, it would be better to import just the lodash functions needed. Also, rather than lodash, using native JS functions such as map, filter, etc. would be good.

Also, of course, as possible we should replace the use of lodash functions with native JS equivalents.

## Removal of jQuery

Modern Ember recommends removing jQuery, using standard DOM access routines instead. Our file app.js sets $ globally to jQuery, so finding all instances will involve both searching for imports of jQuery and for $ (whether "$." or "$("). Note that we cannot completely eliminate jQuery because the selectize package depends on it.

Note that we cannot completely remove jQuery because it's a dependency of selectize. But we can eliminate its use in our own code to be conistent with modern Ember best practices.

## Removal of moment

Moment as a package has a fairly large footprint and is considered a legacy project. Because Encompass uses only uncomplicated pieces of moment, all of the app's usage could be replaced by modern JS or more lightweight, modular packages (e.g., date-fns).

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

## Cleaning up packages and unused elements

I've used ember-unused-components to determine that we do not have any unused components as of late 2024.

npm-check reveals quite a lot of packages that are either unused, in need of upgrade (minor or major). There are several packages listed as missing, but I believe that almost all of these are Ember packages that are automatically loaded elsewhere.

ember-cli-dependency-checker is already installed and it never mentions anything out of the ordinary. Nevertheless, I've manually found a few packages that aren't used (g, gm, gm-reload, express-session) and removed them.

# Gotchas

- For the built-in component <Input>, the id argument should be id= rather than @id=. If you do "@id", the component will not respond to clicks.
- If a classic component receives @store={{this.store}} but this.store is undefined, then that component will see this.store as undefined even if you added store as a service.
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

# Current Progress

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
