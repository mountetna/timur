// Construct a query graph from the Magma Models,
//   so we can traverse and ask it questions.
import {DirectedGraph} from 'etna-js/utils/directed_graph';
import {Model, Template, Attribute} from '../models/model_types';

export class QueryGraph {
  graph: DirectedGraph;
  unallowedModels: string[] = ['project'];
  includedLinkTypes: string[] = ['link', 'table'];
  allowedModels: Set<string>;

  constructor(magmaModels: {[key: string]: Model}) {
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

  allPaths(modelName: string): string[][] {
    if (!Object.keys(this.graph.children).includes(modelName)) return [];

    let parentage: string[] = this.graph.fullParentage(modelName);

    // Any model that you can traverse to from any parent should
    //   also count as a path.
    return this.pathsFrom(modelName)
      .concat([parentage])
      .concat(parentage.map((p) => this.pathsFrom(p)).flat(1));
  }
}
