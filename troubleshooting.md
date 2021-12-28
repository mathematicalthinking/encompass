# Props not appearing in child components

- `@<propname>` in .hbs templates
- `this.args.<propname>` in component class

# Props not loading on route change (i.e. a component is expecting a username but is getting `undefined`) make sure the model data is loading correctly

- if the route is creating a hash for the model, all props must include `this.model.<propname>`
- to force the model to reload when clicking a link, pass the id instead of the whole model to the link `@model={{<item>.id}}`

# Passing arguments to a component action from the template

- use the `fn` helper: `{{on 'click' (fn this.<actionName> <arg1> <arg2> ...)}}`

# Migrating a component from classic to Octane

- there's probably a lot of dead code, so simplify as much as possible first
- see if you can move things in the lifecycle hooks to the component itself
- check out migrating the `{{action}}` helper to `{{on}}`

# store query is immutable

- convert to array with `.toArray()`

# tables use [Ember Table](https://opensource.addepar.com/ember-table/docs)

- needs array of objects for columns and array of objects for row values
- see docs for more

# nav drawer is [Ember CLI MDC Drawer](https://www.npmjs.com/package/ember-cli-mdc-drawer)

# error like `expected <Workspace.id-number> in adapter payload but not found`

- the server automatically paginates and won't send more than 20 workspaces at a time. sometimes a template needs more than 20 workspaces but only receives 20, throwing an error for Ember Data. I haven't yet tracked down where pagination is handled

- the server also handles user permissions. if a template needs something the user doesn't have permission to view, the server will not send any data back, throwing an error
