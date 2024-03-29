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

  it('correctly returns children and one-to-many status', () => {
    expect(graph.childrenMap('monster')).toEqual({
      habitat: false,
      victim: true,
      monster: false
    });

    expect(graph.childrenMap('habitat')).toEqual({
      vegetation: true,
      habitat: false
    });

    expect(graph.childrenMap('wound')).toEqual({
      wound: false
    });
  });

  describe('for xcrs1 models', () => {
    const models = require('../fixtures/xcrs1_magma_metadata.json').models;
    beforeEach(() => {
      graph = new QueryGraph(models);
    });

    it('handles the path laterally from subject -> sc_seq', () => {
      expect(graph.shortestPath('subject', 'sc_seq')).toEqual([
        'biospecimen',
        'biospecimen_group',
        'sc_seq'
      ]);
    });

    it('handles the path laterally from sc_seq -> subject', () => {
      expect(graph.shortestPath('sc_seq', 'subject')).toEqual([
        'biospecimen_group',
        'biospecimen',
        'subject'
      ]);
    });

    it('handles the path laterally from sc_seq -> cytof', () => {
      expect(graph.shortestPath('sc_seq', 'cytof')).toEqual([
        'biospecimen_group',
        'biospecimen',
        'cytof'
      ]);
    });
  });
});
