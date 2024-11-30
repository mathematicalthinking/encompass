/**
 * This script is for doing an analysis of the Encompass app to help prioritize upgrades.
 * The script finds all components used in route templates, and to find all components used in other components.
 */

const fs = require('fs');
const path = require('path');

// Helper function to convert kebab-case to PascalCase
function kebabToPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Helper function to collect components from a given template file
function findComponentsInTemplate(templatePath) {
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  const componentMatches = templateContent.match(/<([A-Z][A-Za-z0-9]*)/g);
  if (componentMatches) {
    return [...new Set(componentMatches.map((tag) => tag.slice(1)))]; // Extract unique component names
  }
  return [];
}

// Recursive function to scan templates for components, avoiding repeats
function findComponentsInTemplates(
  dir,
  visitedFiles = new Set(),
  isComponent = false
) {
  const componentsByRoute = {};

  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(
        componentsByRoute,
        findComponentsInTemplates(
          fullPath,
          visitedFiles,
          isComponent || file === 'components' || file === 'folder'
        )
      );
    } else if (file.endsWith('.hbs') && !visitedFiles.has(fullPath)) {
      visitedFiles.add(fullPath); // Avoid processing the same file twice
      const components = findComponentsInTemplate(fullPath);
      if (components.length > 0 && !isComponent) {
        componentsByRoute[fullPath] = components;
      }
    }
  });

  return componentsByRoute;
}

// Function to map each component to the components it references
function mapComponentDependencies(componentsDir, visitedFiles = new Set()) {
  const dependencies = {};

  fs.readdirSync(componentsDir).forEach((file) => {
    const fullPath = path.join(componentsDir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(
        dependencies,
        mapComponentDependencies(fullPath, visitedFiles)
      );
    } else if (file.endsWith('.hbs') && !visitedFiles.has(fullPath)) {
      visitedFiles.add(fullPath); // Avoid processing the same file twice
      const componentName = kebabToPascalCase(path.basename(fullPath, '.hbs'));
      const referencedComponents = findComponentsInTemplate(fullPath);
      dependencies[componentName] = referencedComponents;
    }
  });

  return dependencies;
}

// Function to perform a full tree search and collect all unique components
function gatherAllComponents(
  component,
  componentDependencies,
  collected = new Set()
) {
  if (collected.has(component)) return; // Avoid repeats

  collected.add(component);

  const dependencies = componentDependencies[component] || [];
  dependencies.forEach((dep) =>
    gatherAllComponents(dep, componentDependencies, collected)
  );
}

// Function to map which components reference each component
function mapComponentReferences(componentDependencies) {
  const references = {};

  // Initialize the references map
  Object.keys(componentDependencies).forEach((component) => {
    references[component] = [];
  });

  // Populate the references
  Object.entries(componentDependencies).forEach(([component, dependencies]) => {
    dependencies.forEach((dep) => {
      if (references[dep]) {
        references[dep].push(component);
      }
    });
  });

  // Remove duplicates and sort the references
  Object.keys(references).forEach((component) => {
    references[component] = [...new Set(references[component])];
  });

  return references;
}

// Main execution
const routeTemplatesDir = './app/templates';
const componentsDir = './app/templates/components';
const componentTemplatesDir = './app/components';

// Step 1: Collect component dependencies from both component directories
const componentDependencies = {
  ...mapComponentDependencies(componentsDir),
  ...mapComponentDependencies(componentTemplatesDir),
};

// Step 2: Collect all components used in each route template
const routeComponents = findComponentsInTemplates(routeTemplatesDir);

// Step 3: Perform a full tree search for each route and gather all unique components
const componentUsageCount = {};
const allRouteComponents = {};

Object.entries(routeComponents).forEach(([filePath, components]) => {
  const allComponents = new Set();
  components.forEach((component) => {
    gatherAllComponents(component, componentDependencies, allComponents);
  });

  allRouteComponents[filePath] = Array.from(allComponents).sort();

  // Count usage for each component
  allComponents.forEach((component) => {
    componentUsageCount[component] = (componentUsageCount[component] || 0) + 1;
  });
});

// Step 4: Separate out repeated components and unique components
const repeatedComponents = Object.entries(componentUsageCount)
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]) // Sort from most frequent to least frequent
  .map(([component, count]) => `${component}: ${count} routes`);

const routesWithUniqueComponents = [];
const routesWithoutUniqueComponents = [];

Object.entries(allRouteComponents).forEach(([filePath, components]) => {
  const uniqueComponents = components.filter(
    (component) => componentUsageCount[component] === 1
  );
  if (uniqueComponents.length > 0) {
    routesWithUniqueComponents.push(
      `${filePath}:\n  - ${uniqueComponents.join('\n  - ')}`
    );
  } else {
    routesWithoutUniqueComponents.push(filePath);
  }
});

// Step 5: Map which components reference each component
const componentReferences = mapComponentReferences(componentDependencies);

// Step 6: Sort components by the number of references and format the output
const sortedComponentReferences = Object.entries(componentReferences)
  .sort((a, b) => b[1].length - a[1].length) // Sort by number of references, descending
  .map(([component, references]) =>
    references.length > 0
      ? `${component} (${references.length}):\n  - ${references.join('\n  - ')}`
      : `${component} (0)`
  );

// Step 7: Generate the output strings
const fullTreeOutput = Object.entries(allRouteComponents)
  .map(
    ([filePath, components]) => `${filePath}:\n  - ${components.join('\n  - ')}`
  )
  .join('\n\n');

const repeatedComponentsOutput = `Repeated Components (sorted by frequency):\n${repeatedComponents.join(
  '\n'
)}`;
const uniqueComponentsOutput = `Unique Components by Route:\n${routesWithUniqueComponents.join(
  '\n\n'
)}`;
const routesWithoutUniqueOutput = `Routes with No Unique Components:\n${routesWithoutUniqueComponents.join(
  '\n'
)}`;
const componentReferencesOutput = `Component References (sorted by number of references):\n${sortedComponentReferences.join(
  '\n\n'
)}`;

// Step 8: Write the outputs to componentFinder.txt
fs.writeFileSync(
  'componentFinder.txt',
  `Components used within each route subsystem:\n${fullTreeOutput}\n\n${repeatedComponentsOutput}\n\n${uniqueComponentsOutput}\n\n${routesWithoutUniqueOutput}\n\n${componentReferencesOutput}`,
  'utf-8'
);

console.log(
  'Full tree component list, repeated/unique components, and sorted component references have been written to componentFinder.txt'
);
