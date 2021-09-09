import {QueryBuilder} from '../../../lib/client/jsx/utils/query_builder';
import {QueryGraph} from '../../../lib/client/jsx/utils/query_graph';
import {QuerySlice} from '../../../lib/client/jsx/contexts/query/query_types';

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
  },
  wound: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_wound.json')
  }
};

describe('QueryBuilder', () => {
  let graph: QueryGraph;
  let builder: QueryBuilder;

  beforeEach(() => {
    graph = new QueryGraph(models);
    builder = new QueryBuilder(graph, models);
  });

  function stamp(
    model_name: string,
    attribute_name: string,
    slices: QuerySlice[]
  ) {
    return {
      model_name,
      attribute_name,
      display_label: `${model_name}.${attribute_name}`,
      slices: slices
    };
  }

  it('works', () => {
    builder.addRootIdentifier(stamp('monster', 'name', []));
    builder.addColumns([
      stamp('monster', 'name', []),
      stamp('monster', 'species', []),
      stamp('monster', 'stats', []),
      stamp('labor', 'year', []),
      stamp('labor', 'completed', []),
      stamp('labor', 'contributions', [
        {
          modelName: 'labor',
          attributeName: 'contributions',
          operator: '::slice',
          operand: 'Athens,Sidon'
        }
      ]),
      stamp('prize', 'value', [
        {
          modelName: 'prize',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Sparta'
        }
      ]),
      stamp('victim', 'country', [])
    ]);
    builder.addRecordFilters([
      {
        modelName: 'labor',
        attributeName: 'name',
        operator: '::in',
        operand: 'lion,hydra,apples',
        anyMap: {}
      },
      {
        modelName: 'monster',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Nemean Lion',
        anyMap: {}
      },
      {
        modelName: 'labor',
        attributeName: 'number',
        operator: '::equals',
        operand: 2,
        anyMap: {}
      },
      {
        modelName: 'prize',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Apples',
        anyMap: {
          prize: true
        }
      }
    ]);

    expect(builder.query()).toEqual([
      'monster',
      [
        '::and',
        ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
        ['name', '::equals', 'Nemean Lion'],
        ['labor', 'number', '::equals', 2],
        ['labor', 'prize', ['name', '::equals', 'Apples'], '::any']
      ],
      '::all',
      [
        'name',
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
      [
        '::and',
        ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
        ['name', '::equals', 'Nemean Lion'],
        ['labor', 'number', '::equals', 2],
        ['labor', 'prize', ['name', '::equals', 'Apples'], '::any']
      ],
      '::all',
      [
        'name',
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
        ['labor', 'prize', ['name', '::equals', 'Apples'], '::any'],
        [
          '::or',
          ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
          ['labor', 'number', '::equals', 2]
        ]
      ],
      '::all',
      [
        'name',
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

  it('adds slice for root model', () => {
    builder.addRootIdentifier(stamp('labor', 'name', []));
    builder.addColumns([
      stamp('labor', 'name', []),
      stamp('labor', 'contributions', [
        {
          modelName: 'labor',
          attributeName: 'contributions',
          operator: '::slice',
          operand: 'Athens,Sidon'
        }
      ])
    ]);

    expect(builder.query()).toEqual([
      'labor',
      '::all',
      ['name', ['contributions', '::slice', ['Athens', 'Sidon']]]
    ]);
  });

  it('returns a count query string', () => {
    builder.addRootIdentifier(stamp('monster', 'name', []));
    builder.addColumns([
      stamp('monster', 'name', []),
      stamp('labor', 'year', []),
      stamp('labor', 'completed', []),
      stamp('monster', 'species', []),
      stamp('prize', 'value', [
        {
          modelName: 'prize',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Sparta'
        }
      ])
    ]);
    builder.addRecordFilters([
      {
        modelName: 'labor',
        attributeName: 'name',
        operator: '::in',
        operand: 'lion,hydra,apples',
        anyMap: {}
      },
      {
        modelName: 'monster',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Nemean Lion',
        anyMap: {}
      }
    ]);

    expect(builder.count()).toEqual([
      'monster',
      [
        '::and',
        ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
        ['name', '::equals', 'Nemean Lion']
      ],
      '::count'
    ]);
  });

  describe('handles any for', () => {
    it('deep paths in filters with some non-branching models', () => {
      builder.addRootIdentifier(stamp('labor', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm',
          anyMap: {
            victim: true,
            wound: true
          }
        }
      ]);
      builder.addColumns([stamp('labor', 'name', [])]);

      expect(builder.query()).toEqual([
        'labor',
        [
          'monster',
          'victim',
          ['wound', ['location', '::equals', 'arm'], '::any'],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('deep paths in filters with branching models only', () => {
      builder.addRootIdentifier(stamp('monster', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm',
          anyMap: {
            victim: true,
            wound: true
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        [
          'victim',
          ['wound', ['location', '::equals', 'arm'], '::any'],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('shallow paths in filters with branching models', () => {
      builder.addRootIdentifier(stamp('monster', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'victim',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Hercules',
          anyMap: {
            victim: true
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        ['victim', ['name', '::equals', 'Hercules'], '::any'],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down the tree', () => {
      builder.addRootIdentifier(stamp('prize', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm',
          anyMap: {
            victim: true,
            wound: true
          }
        }
      ]);
      builder.addColumns([stamp('prize', 'name', [])]);

      expect(builder.query()).toEqual([
        'prize',
        [
          'labor',
          'monster',
          'victim',
          ['wound', ['location', '::equals', 'arm'], '::any'],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down and terminate in a table', () => {
      builder.addRootIdentifier(stamp('monster', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'prize',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Apples',
          anyMap: {
            prize: true
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        ['labor', 'prize', ['name', '::equals', 'Apples'], '::any'],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up the tree', () => {
      builder.addRootIdentifier(stamp('prize', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'labor',
          attributeName: 'name',
          operator: '::in',
          operand: 'Lion,Hydra',
          anyMap: {}
        }
      ]);
      builder.addColumns([stamp('prize', 'name', [])]);

      expect(builder.query()).toEqual([
        'prize',
        ['labor', 'name', '::in', ['Lion', 'Hydra']],
        '::all',
        ['name']
      ]);
    });
  });

  describe('handles every for', () => {
    it('deep paths in filters with some non-branching models', () => {
      builder.addRootIdentifier(stamp('labor', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm',
          anyMap: {
            victim: false,
            wound: false
          }
        }
      ]);
      builder.addColumns([stamp('labor', 'name', [])]);

      expect(builder.query()).toEqual([
        'labor',
        [
          'monster',
          'victim',
          ['wound', ['location', '::equals', 'arm'], '::every'],
          '::every'
        ],
        '::all',
        ['name']
      ]);
    });

    it('deep paths in filters with branching models only', () => {
      builder.addRootIdentifier(stamp('monster', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm',
          anyMap: {
            victim: false,
            wound: false
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        [
          'victim',
          ['wound', ['location', '::equals', 'arm'], '::every'],
          '::every'
        ],
        '::all',
        ['name']
      ]);
    });

    it('shallow paths in filters with branching models', () => {
      builder.addRootIdentifier(stamp('monster', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'victim',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Hercules',
          anyMap: {
            victim: false
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        ['victim', ['name', '::equals', 'Hercules'], '::every'],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down the tree', () => {
      builder.addRootIdentifier(stamp('prize', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm',
          anyMap: {
            victim: false,
            wound: false
          }
        }
      ]);
      builder.addColumns([stamp('prize', 'name', [])]);

      expect(builder.query()).toEqual([
        'prize',
        [
          'labor',
          'monster',
          'victim',
          ['wound', ['location', '::equals', 'arm'], '::every'],
          '::every'
        ],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down and terminate in a table', () => {
      builder.addRootIdentifier(stamp('monster', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'prize',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Apples',
          anyMap: {
            prize: false
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        ['labor', 'prize', ['name', '::equals', 'Apples'], '::every'],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up the tree', () => {
      builder.addRootIdentifier(stamp('prize', 'name', []));
      builder.addRecordFilters([
        {
          modelName: 'labor',
          attributeName: 'name',
          operator: '::in',
          operand: 'Lion,Hydra',
          anyMap: {}
        }
      ]);
      builder.addColumns([stamp('prize', 'name', [])]);

      expect(builder.query()).toEqual([
        'prize',
        ['labor', 'name', '::in', ['Lion', 'Hydra']],
        '::all',
        ['name']
      ]);
    });
  });
});
