import {QueryBuilder} from '../../../lib/client/jsx/utils/query_builder';
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
  prize: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_prize.json')
  },
  victim: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_victim.json')
  }
};

describe('QueryBuilder', () => {
  let graph: QueryGraph;
  let builder: QueryBuilder;

  beforeEach(() => {
    graph = new QueryGraph(models);
    builder = new QueryBuilder(graph);
  });

  function stamp(model_name: string, attribute_name: string) {
    return {
      model_name,
      attribute_name,
      display_label: `${model_name}.${attribute_name}`
    };
  }

  it('works', () => {
    builder.addRootIdentifier(stamp('monster', 'name'));
    builder.addAttributes({
      labor: [
        stamp('labor', 'year'),
        stamp('labor', 'completed'),
        stamp('labor', 'contributions')
      ],
      monster: [stamp('monster', 'species'), stamp('monster', 'stats')],
      prize: [stamp('prize', 'value')],
      victim: [stamp('victim', 'country')]
    });
    builder.addRecordFilters([
      {
        modelName: 'labor',
        attributeName: 'name',
        operator: '::in',
        operand: 'lion,hydra,apples'
      },
      {
        modelName: 'monster',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Nemean Lion'
      },
      {
        modelName: 'labor',
        attributeName: 'number',
        operator: '::equals',
        operand: 2
      }
    ]);
    builder.addSlices([
      {
        modelName: 'prize',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Sparta'
      },
      {
        modelName: 'labor',
        attributeName: 'contributions',
        operator: '::slice',
        operand: 'Athens,Sidon'
      }
    ]);

    expect(builder.query()).toEqual([
      'monster',
      ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
      ['name', '::equals', 'Nemean Lion'],
      ['labor', 'number', '::equals', 2],
      '::all',
      [
        ['name'],
        ['species'],
        ['stats', '::url'],
        ['labor', 'year'],
        ['labor', 'completed'],
        ['labor', 'contributions', '::slice', ['Athens', 'Sidon']],
        ['labor', 'prize', ['name', '::equals', 'Sparta'], '::first', 'value'],
        ['victim', '::first', 'country']
      ]
    ]);

    builder.setFlatten(false);

    expect(builder.query()).toEqual([
      'monster',
      ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
      ['name', '::equals', 'Nemean Lion'],
      ['labor', 'number', '::equals', 2],
      '::all',
      [
        ['name'],
        ['species'],
        ['stats', '::url'],
        ['labor', 'year'],
        ['labor', 'completed'],
        ['labor', 'contributions', '::slice', ['Athens', 'Sidon']],
        ['labor', 'prize', ['name', '::equals', 'Sparta'], '::all', 'value'],
        ['victim', '::all', 'country']
      ]
    ]);

    builder.setOrRecordFilterIndices([0, 2]);

    expect(builder.query()).toEqual([
      'monster',
      [
        '::and',
        ['name', '::equals', 'Nemean Lion'],
        [
          '::or',
          ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
          ['labor', 'number', '::equals', 2]
        ]
      ],
      '::all',
      [
        ['name'],
        ['species'],
        ['stats', '::url'],
        ['labor', 'year'],
        ['labor', 'completed'],
        ['labor', 'contributions', '::slice', ['Athens', 'Sidon']],
        ['labor', 'prize', ['name', '::equals', 'Sparta'], '::all', 'value'],
        ['victim', '::all', 'country']
      ]
    ]);
  });

  it('returns a count query string', () => {
    builder.addRootIdentifier(stamp('monster', 'name'));
    builder.addAttributes({
      labor: [stamp('labor', 'year'), stamp('labor', 'completed')],
      monster: [stamp('monster', 'species')],
      prize: [stamp('prize', 'value')]
    });
    builder.addRecordFilters([
      {
        modelName: 'labor',
        attributeName: 'name',
        operator: '::in',
        operand: 'lion,hydra,apples'
      },
      {
        modelName: 'monster',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Nemean Lion'
      }
    ]);
    builder.addSlices([
      {
        modelName: 'prize',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Sparta'
      }
    ]);

    expect(builder.count()).toEqual([
      'monster',
      ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
      ['name', '::equals', 'Nemean Lion'],
      '::count'
    ]);
  });
});
