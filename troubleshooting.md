### Props not appearing in child components

- `@<propname>` in .hbs templates
- `this.args.<propname>` in component class

### Props not loading on route change

## i.e. a component is expecting a username but is getting `undefined`

# make sure the model data is loading correctly

- if the route is creating a hash for the model, all props must include `this.model.<propname>`
- to force the model to reload when clicking a link, pass the id instead of the whole model to the link `@model={{<item>.id}}`
