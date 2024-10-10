This are notes taken as I attempt to upgrade Encompass to Ember 4.4

# Backstory

There has been various attempts to upgrade this app to modern Ember (Octane, Ember 4.4, Glimmer components) over the past several years. There has been a great deal of progress, but each developer only got so far. As a result, there is a great deal of incomplete upgrades, so the app consists of Ember elements that were the "proper" way to do things at different periods of time.

This file is an attempt to document what has and has not been done, as well as suggestions for future developers if I (like all others) leave an incomplete upgrade process.

# Upgrades needed globally

## Removal of Mixins

A fair number of mixins have been removed, replaced by services. There are still more mixins on some legacy components and elsewhere. The plan is to step through all mixins in app/mixins, replacing them with existing or new services everywhere they are used.

## Data down, actions up

A number of components used two-way data binding, which is discouraged in modern Ember. In two-way data binding, it's possible to mutate the value of a property and have that property's value be changed in the property of the original component. Difficulties arise because it's tricky to recognize when two-way data binding is being used and therefore tricky for a new developer to see how (or that) certain property values are being updated.

Instead, modern Ember uses the Data down, actions up pattern. Parent components send data down to their child components. A parent also sends actions (functions) to the child when updates are needed. When the child wants to update the property's value, it uses the appropriate action (essentially a callback to the parent). In this way, the parent is responsible for all of its properties' values, both getting and setting them.

## Placement of files

1. **Template and Component files** should be co-located in the app/components folder rather than in the app/templates/components folder. The app/templates folder should be for route templates only.
2.

## Imports

Currently, ember-cli-build.js and the vendor/ folder reflects an older-style of imports. Wouldn't it be better to include the necessary packages and import them as needed in the various components?

## Move from built-in Ember components (Input, TextArea, Select, etc.) to the plain HTML versions

As possible, I will be replacing <Input> with <input>, and so forth. Although the Ember built-ins provide some convenience for assessibility options, they also encourage older-style approachs such as two-way data binding.

# Possible future upgrades

## Removal or reduction of lodash & underscore

Both lodash and underscore are used extensively throughout the app. These cases may be found by searching for where 'underscore' is imported or by searching for an underscore followed by a period. The latter is important because app.js sets the underscore to be a global ("window.\_").

## Removal of jQuery

Modern Ember recommends removing jQuery, using standard DOM access routines instead. Our file app.js sets $ globally to jQuery, so finding all instances will involve both searching for imports of jQuery and for $ (whether "$." or "$(").

## Removal of moment

Moment as a package has a fairly large footprint and is considered a legacy project. Because Encompass uses only uncomplicated pieces of moment, all of the app's usage could be replaced by modern JS or more lightweight, modular packages (e.g., date-fns).

## Avoid runtime errors through use of optional chaining and nullish coalescing

Through the use of ?. and ??, we can avoid runtime errors if an attempt is made to get a property from undefined.
