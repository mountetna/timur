import {QueryGraph} from '../../../lib/client/jsx/utils/query_graph';

const models = {
  monster: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_monster.json')
  },
  labor: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_labor.json')
  },
  project: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_project.json')
  },
  victim: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_victim.json')
  },
  wound: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_wound.json')
  },
  habitat: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_habitat.json')
  },
  vegetation: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_vegetation.json')
  }
};

describe('QueryGraph', () => {
  let graph: QueryGraph;

  beforeEach(() => {
    graph = new QueryGraph(models);
  });

  it('ignores the project model', () => {
    expect(Object.keys(graph.graph.children).includes('project')).toEqual(
      false
    );
    expect(Object.keys(graph.graph.parents).includes('project')).toEqual(false);
  });

  it('adds table and link connections', () => {
    expect(Object.keys(graph.graph.children).includes('prize')).toEqual(true);
    expect(Object.keys(graph.graph.parents).includes('prize')).toEqual(true);
    expect(graph.pathsFrom('labor')).toEqual([
      ['labor', 'monster', 'habitat', 'vegetation'],
      ['labor', 'monster', 'victim', 'wound'],
      ['labor', 'prize']
    ]);
  });

  it('provides all paths from a child model, up and down the graph', () => {
    expect(graph.allPaths('prize')).toEqual([
      ['labor'],
      ['labor', 'monster', 'habitat', 'vegetation'],
      ['labor', 'monster', 'victim', 'wound'],
      ['labor', 'prize']
    ]);
  });

  it('returns models in a path with one-to-many relationships', () => {
    expect(graph.sliceableModelNamesInPath('prize', 'wound')).toEqual([
      'victim',
      'wound'
    ]);
    expect(graph.sliceableModelNamesInPath('prize', 'vegetation')).toEqual([
      'vegetation'
    ]);
  });
});
