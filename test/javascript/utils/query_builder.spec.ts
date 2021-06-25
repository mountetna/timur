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
      },
      {
        modelName: 'prize',
        attributeName: 'name',
        operator: '::equals',
        operand: 'Apples'
      }
    ]);
    builder.addSlices({
      prize: [
        {
          modelName: 'prize',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Sparta'
        }
      ],
      labor: [
        {
          modelName: 'labor',
          attributeName: 'contributions',
          operator: '::slice',
          operand: 'Athens,Sidon'
        }
      ]
    });

    expect(builder.query()).toEqual([
      'monster',
      [
        '::and',
        ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
        ['name', '::equals', 'Nemean Lion'],
        ['labor', 'number', '::equals', 2],
        ['labor', ['prize', ['name', '::equals', 'Apples'], '::any']]
      ],
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
      [
        '::and',
        ['labor', 'name', '::in', ['lion', 'hydra', 'apples']],
        ['name', '::equals', 'Nemean Lion'],
        ['labor', 'number', '::equals', 2],
        ['labor', 'prize', '::all', 'name', '::equals', 'Apples']
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

    builder.setOrRecordFilterIndices([0, 2]);

    expect(builder.query()).toEqual([
      'monster',
      [
        '::and',
        ['name', '::equals', 'Nemean Lion'],
        ['labor', 'prize', '::all', 'name', '::equals', 'Apples'],
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

  it('adds slice for root model', () => {
    builder.addRootIdentifier(stamp('labor', 'name'));
    builder.addAttributes({
      labor: [stamp('labor', 'contributions')]
    });
    builder.addSlices({
      labor: [
        {
          modelName: 'labor',
          attributeName: 'contributions',
          operator: '::slice',
          operand: 'Athens,Sidon'
        }
      ]
    });

    expect(builder.query()).toEqual([
      'labor',
      '::all',
      [['name'], ['contributions', '::slice', ['Athens', 'Sidon']]]
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
    builder.addSlices({
      prize: [
        {
          modelName: 'prize',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Sparta'
        }
      ]
    });

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

  describe('handles any / all for', () => {
    it('deep paths in filters with some non-branching models', () => {
      builder.addRootIdentifier(stamp('labor', 'name'));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm'
        }
      ]);

      expect(builder.query()).toEqual([
        'labor',
        [
          'monster',
          [
            'victim',
            ['wound', ['location', '::equals', 'arm'], '::any'],
            '::any'
          ]
        ],
        '::all',
        [['name']]
      ]);

      builder.setFlatten(false);

      expect(builder.query()).toEqual([
        'labor',
        [
          'monster',
          'victim',
          '::all',
          'wound',
          '::all',
          'location',
          '::equals',
          'arm'
        ],
        '::all',
        [['name']]
      ]);
    });

    it('deep paths in filters with branching models only', () => {
      builder.addRootIdentifier(stamp('monster', 'name'));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm'
        }
      ]);

      expect(builder.query()).toEqual([
        'monster',
        [
          'victim',
          ['wound', ['location', '::equals', 'arm'], '::any'],
          '::any'
        ],
        '::all',
        [['name']]
      ]);

      builder.setFlatten(false);

      expect(builder.query()).toEqual([
        'monster',
        ['victim', '::all', 'wound', '::all', 'location', '::equals', 'arm'],
        '::all',
        [['name']]
      ]);
    });

    it('shallow paths in filters with branching models', () => {
      builder.addRootIdentifier(stamp('monster', 'name'));
      builder.addRecordFilters([
        {
          modelName: 'victim',
          attributeName: 'name',
          operator: '::equals',
          operand: 'Hercules'
        }
      ]);

      expect(builder.query()).toEqual([
        'monster',
        ['victim', ['name', '::equals', 'Hercules'], '::any'],
        '::all',
        [['name']]
      ]);

      builder.setFlatten(false);

      expect(builder.query()).toEqual([
        'monster',
        ['victim', '::all', 'name', '::equals', 'Hercules'],
        '::all',
        [['name']]
      ]);
    });

    it('paths that go up and down the tree', () => {
      builder.addRootIdentifier(stamp('prize', 'name'));
      builder.addRecordFilters([
        {
          modelName: 'wound',
          attributeName: 'location',
          operator: '::equals',
          operand: 'arm'
        }
      ]);

      expect(builder.query()).toEqual([
        'prize',
        [
          'labor',
          'monster',
          [
            'victim',
            ['wound', ['location', '::equals', 'arm'], '::any'],
            '::any'
          ]
        ],
        '::all',
        [['name']]
      ]);

      builder.setFlatten(false);

      expect(builder.query()).toEqual([
        'prize',
        [
          'labor',
          'monster',
          'victim',
          '::all',
          'wound',
          '::all',
          'location',
          '::equals',
          'arm'
        ],
        '::all',
        [['name']]
      ]);
    });

    it('paths that go up the tree', () => {
      builder.addRootIdentifier(stamp('prize', 'name'));
      builder.addRecordFilters([
        {
          modelName: 'labor',
          attributeName: 'name',
          operator: '::in',
          operand: 'Lion,Hydra'
        }
      ]);

      expect(builder.query()).toEqual([
        'prize',
        ['labor', 'name', '::in', ['Lion', 'Hydra']],
        '::all',
        [['name']]
      ]);

      builder.setFlatten(false);

      expect(builder.query()).toEqual([
        'prize',
        ['labor', 'name', '::in', ['Lion', 'Hydra']],
        '::all',
        [['name']]
      ]);
    });
  });
});
