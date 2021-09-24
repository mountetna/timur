// Construct a query graph from the Magma Models,
//   so we can traverse and ask it questions.
import {DirectedGraph} from 'etna-js/utils/directed_graph';
import {Model, Template, Attribute} from '../models/model_types';

export class QueryGraph {
  models: {[key: string]: Model};
  graph: DirectedGraph;
  unallowedModels: string[] = ['project'];
  includedLinkTypes: string[] = ['link', 'table'];
  allowedModels: Set<string>;
  initialized: boolean = false;

  constructor(magmaModels: {[key: string]: Model}) {
    this.models = magmaModels;
    this.graph = new DirectedGraph();
    this.allowedModels = new Set();

    // We ignore the project model and any links
    //   to project, for querying purposes only.
    // Also include linked models, to capture those paths.
    Object.entries(magmaModels).forEach(
      ([modelName, modelDefinition]: [string, Model]) => {
        if (this.unallowedModels.includes(modelName)) return;

        let template: Template = modelDefinition.template;
        this.allowedModels.add(modelName);

        if (!this.unallowedModels.includes(template.parent))
          this.graph.addConnection(template.parent, modelName);

        Object.values(template.attributes)
          .filter(
            (attr: Attribute) =>
              this.includedLinkTypes.includes(attr.attribute_type) &&
              attr.link_model_name
          )
          .forEach((link: Attribute) => {
            if (link.link_model_name) {
              this.allowedModels.add(link.link_model_name);
              this.graph.addConnection(modelName, link.link_model_name);
            }
          });
      }
    );

    this.initialized = true;
  }

  template(modelName: string): any {
    if (!Object.keys(this.models).includes(modelName)) return null;

    return this.models[modelName].template;
  }

  pathsFrom(modelName: string): string[][] {
    // this.allowedModels could have disconnected models that
    //   where only connected to models in the unallowedModels list,
    //   so they won't appear in the graph, but the user may query on
    //   them and we have to account for that.
    // An immediate example is "document".
    if (!Object.keys(this.graph.children).includes(modelName)) return [];
    return this.graph.pathsFrom(modelName);
  }

  asNormalizedHash(modelName: string): {[key: string]: string[]} {
    // this.allowedModels could have disconnected models that
    //   where only connected to models in the unallowedModels list,
    //   so they won't appear in the graph, but the user may query on
    //   them and we have to account for that.
    // An immediate example is "document".
    if (!Object.keys(this.graph.children).includes(modelName)) return {};
    return this.graph.asNormalizedHash(modelName);
  }

  // Here we calculate parent paths as separate entities, instead
  //   of allowing them to be in a single, flattened array.
  parentPaths(modelName: string): string[][] {
    if (!Object.keys(this.graph.parents).includes(modelName)) return [];

    let results: string[][] = [];

    Object.keys(this.graph.parents[modelName]).forEach((p: string) => {
      if (p !== modelName) {
        let innerPaths = this.parentPaths(p);
        if (innerPaths.length === 0) {
          results.push([p]);
        } else {
          innerPaths.forEach((parentPath: string[]) => {
            parentPath.unshift(p);
            results.push(parentPath);
          });
        }
      }
    });

    return results;
  }

  allPaths(modelName: string): string[][] {
    if (!Object.keys(this.graph.children).includes(modelName)) return [];

    let parentage: string[] = this.graph.fullParentage(modelName);

    // Any model that you can traverse to from any parent should
    //   also count as a path.

    // Children paths
    return this.pathsFrom(modelName)
      .concat(
        // paths up the tree
        this.parentPaths(modelName)
      )
      .concat(
        // paths routing up through parents then down
        parentage
          .map((p: string, index: number) =>
            this.pathsFrom(p).map((path) =>
              parentage.slice(0, index).concat(path)
            )
          )
          .flat(1)
      );
  }

  modelHasAttribute(modelName: string, attributeName: string) {
    if (!this.models[modelName]) return false;

    return !!this.models[modelName].template.attributes[attributeName];
  }

  stepIsOneToMany(start: string, end: string) {
    // For a single model relationship (start -> end),
    //   returns `true` if it is a one-to-many
    //   relationship.
    if (!this.modelHasAttribute(start, end)) return false;

    return ['table', 'collection'].includes(
      this.models[start].template.attributes[end].attribute_type
    );
  }

  attributeIsFile(modelName: string, attributeName: string) {
    if (!this.modelHasAttribute(modelName, attributeName)) return false;

    return ['file', 'image', 'file_collection'].includes(
      this.models[modelName].template.attributes[attributeName].attribute_type
    );
  }

  shortestPath(rootModel: string, targetModel: string): string[] | undefined {
    let path = this.allPaths(rootModel).find((potentialPath: string[]) =>
      potentialPath.includes(targetModel)
    );

    if (!path) return;

    // Direct children paths include the root, and
    //   we'll filter it out so all paths do not
    //   include the root model (eliminate redundancy).
    const pathWithoutRoot = path
      ?.slice(0, path.indexOf(targetModel) + 1)
      .filter((m) => m !== rootModel);

    return pathWithoutRoot;
  }

  sliceableModelNamesInPath(startModel: string, endModel: string): string[] {
    let modelsInPath = this.shortestPath(startModel, endModel);
    let previousModelName = startModel;
    let selectableModels: string[] = [];

    modelsInPath?.forEach((modelName) => {
      if (this.stepIsOneToMany(previousModelName, modelName)) {
        selectableModels.push(modelName);
      }
      previousModelName = modelName;
    });

    return selectableModels;
  }
}
