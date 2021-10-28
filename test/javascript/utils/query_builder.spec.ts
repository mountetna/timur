import {QueryBuilder} from '../../../lib/client/jsx/utils/query_builder';
import {QueryGraph} from '../../../lib/client/jsx/utils/query_graph';
import {QuerySlice} from '../../../lib/client/jsx/contexts/query/query_types';

function stampTemplate(template: any) {
  return {
    documents: {},
    revisions: {},
    views: {},
    template
  };
}

const models = {
  monster: stampTemplate(require('../fixtures/template_monster.json')),
  labor: stampTemplate(require('../fixtures/template_labor.json')),
  project: stampTemplate(require('../fixtures/template_project.json')),
  prize: stampTemplate(require('../fixtures/template_prize.json')),
  victim: stampTemplate(require('../fixtures/template_victim.json')),
  wound: stampTemplate(require('../fixtures/template_wound.json'))
};

describe('QueryBuilder', () => {
  let graph: QueryGraph;
  let builder: QueryBuilder;

  beforeEach(() => {
    graph = new QueryGraph(models);
    builder = new QueryBuilder(graph);
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

  describe('for xcrs1 models', () => {
    const models = require('../fixtures/xcrs1_magma_metadata.json').models;
    beforeEach(() => {
      graph = new QueryGraph(models);
      builder = new QueryBuilder(graph);
    });

    it('handles https://www.notion.so/ucsfdatascience/6bf73d7edfad4bd38a8527049c9f1510?v=b689c4e7890d4d2dbe3d8c6acb51a6ca&p=6d87fdcbba89412782c8b5d7d3897b5b', () => {
      builder.addRootModel('subject');
      builder.addRecordFilters([
        {
          anyMap: {biospecimen: true, sc_seq: true},
          clauses: [
            {
              attributeName: 'tube_name',
              operand: '',
              operator: '::has',
              attributeType: 'text',
              modelName: 'sc_seq',
              any: true
            }
          ],
          modelName: 'sc_seq'
        }
      ]);
      builder.addColumns([stamp('subject', 'name', [])]);
      expect(builder.query()).toEqual([
        'subject',
        [
          'biospecimen',
          [
            'biospecimen_group',
            ['sc_seq', ['::and', ['::has', 'tube_name']], '::any'],
            '::any'
          ],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });
  });

  it('works', () => {
    builder.addRootModel('monster');
    builder.addColumns([
      stamp('monster', 'name', []),
      stamp('monster', 'species', []),
      stamp('monster', 'stats', []),
      stamp('labor', 'year', []),
      stamp('labor', 'completed', []),
      stamp('labor', 'contributions', [
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'contributions',
              operator: '::slice',
              operand: 'Athens,Sidon',
              attributeType: 'matrix',
              modelName: 'labor',
              any: true
            }
          ]
        }
      ]),
      stamp('prize', 'value', [
        {
          modelName: 'prize',
          clauses: [
            {
              attributeName: 'name',
              operator: '::equals',
              operand: 'Sparta',
              attributeType: 'text',
              modelName: 'prize',
              any: true
            }
          ]
        }
      ]),
      stamp('victim', 'country', [])
    ]);
    builder.addRecordFilters([
      {
        modelName: 'labor',
        anyMap: {},
        clauses: [
          {
            attributeName: 'name',
            operator: '::in',
            operand: 'lion,hydra,apples',
            attributeType: 'text',
            modelName: 'labor',
            any: true
          }
        ]
      },
      {
        modelName: 'monster',
        anyMap: {},
        clauses: [
          {
            attributeName: 'name',
            operator: '::equals',
            operand: 'Nemean Lion',
            attributeType: 'text',
            modelName: 'monster',
            any: true
          }
        ]
      },
      {
        modelName: 'labor',
        anyMap: {},
        clauses: [
          {
            attributeName: 'number',
            operator: '::equals',
            operand: '2',
            attributeType: 'number',
            modelName: 'labor',
            any: true
          }
        ]
      },
      {
        modelName: 'prize',
        clauses: [
          {
            attributeName: 'name',
            operator: '::equals',
            operand: 'Apples',
            attributeType: 'text',
            modelName: 'prize',
            any: true
          }
        ],
        anyMap: {
          prize: true
        }
      }
    ]);

    expect(builder.query()).toEqual([
      'monster',
      [
        '::and',
        [
          'labor',
          ['::and', ['name', '::in', ['lion', 'hydra', 'apples']]],
          '::any'
        ],
        ['::and', ['name', '::equals', 'Nemean Lion']],
        ['labor', ['::and', ['number', '::equals', 2]], '::any'],
        [
          'labor',
          ['prize', ['::and', ['name', '::equals', 'Apples']], '::any'],
          '::any'
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
        ['labor', 'prize', ['name', '::equals', 'Sparta'], '::first', 'value'],
        ['victim', '::first', 'country']
      ]
    ]);

    builder.setFlatten(false);

    expect(builder.query()).toEqual([
      'monster',
      [
        '::and',
        [
          'labor',
          ['::and', ['name', '::in', ['lion', 'hydra', 'apples']]],
          '::any'
        ],
        ['::and', ['name', '::equals', 'Nemean Lion']],
        ['labor', ['::and', ['number', '::equals', 2]], '::any'],
        [
          'labor',
          ['prize', ['::and', ['name', '::equals', 'Apples']], '::any'],
          '::any'
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

    builder.setOrRecordFilterIndices([0, 2]);

    expect(builder.query()).toEqual([
      'monster',
      [
        '::and',
        ['::and', ['name', '::equals', 'Nemean Lion']],
        [
          'labor',
          ['prize', ['::and', ['name', '::equals', 'Apples']], '::any'],
          '::any'
        ],
        [
          '::or',
          [
            'labor',
            ['::and', ['name', '::in', ['lion', 'hydra', 'apples']]],
            '::any'
          ],
          ['labor', ['::and', ['number', '::equals', 2]], '::any']
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

  it('combines multiple clauses in filters', () => {
    builder.addRootModel('monster');
    builder.addColumns([stamp('monster', 'name', [])]);
    builder.addRecordFilters([
      {
        modelName: 'labor',
        anyMap: {},
        clauses: [
          {
            attributeName: 'name',
            operator: '::in',
            operand: 'lion,hydra,apples',
            attributeType: 'text',
            modelName: 'labor',
            any: true
          },
          {
            attributeName: 'number',
            operator: '::>',
            operand: '2',
            attributeType: 'number',
            modelName: 'labor',
            any: true
          },
          {
            attributeName: 'number',
            operator: '::<=',
            operand: '8',
            attributeType: 'number',
            modelName: 'labor',
            any: true
          }
        ]
      }
    ]);

    expect(builder.query()).toEqual([
      'monster',
      [
        'labor',
        [
          '::and',
          ['name', '::in', ['lion', 'hydra', 'apples']],
          ['number', '::>', 2],
          ['number', '::<=', 8]
        ],
        '::any'
      ],
      '::all',
      ['name']
    ]);
  });

  it('adds slice for root model', () => {
    builder.addRootModel('labor');
    builder.addColumns([
      stamp('labor', 'name', []),
      stamp('labor', 'contributions', [
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'contributions',
              operator: '::slice',
              operand: 'Athens,Sidon',
              attributeType: 'matrix',
              modelName: 'labor',
              any: true
            }
          ]
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
    builder.addRootModel('monster');
    builder.addColumns([
      stamp('monster', 'name', []),
      stamp('labor', 'year', []),
      stamp('labor', 'completed', []),
      stamp('monster', 'species', []),
      stamp('prize', 'value', [
        {
          modelName: 'prize',
          clauses: [
            {
              attributeName: 'name',
              operator: '::equals',
              operand: 'Sparta',
              attributeType: 'text',
              modelName: 'prize',
              any: true
            }
          ]
        }
      ])
    ]);
    builder.addRecordFilters([
      {
        modelName: 'labor',
        clauses: [
          {
            attributeName: 'name',
            operator: '::in',
            operand: 'lion,hydra,apples',
            attributeType: 'text',
            modelName: 'labor',
            any: true
          }
        ],
        anyMap: {}
      },
      {
        modelName: 'monster',
        clauses: [
          {
            attributeName: 'name',
            operator: '::equals',
            operand: 'Nemean Lion',
            attributeType: 'text',
            modelName: 'monster',
            any: true
          }
        ],
        anyMap: {}
      }
    ]);

    expect(builder.count()).toEqual([
      'monster',
      [
        '::and',
        [
          'labor',
          ['::and', ['name', '::in', ['lion', 'hydra', 'apples']]],
          '::any'
        ],
        ['::and', ['name', '::equals', 'Nemean Lion']]
      ],
      '::count'
    ]);
  });

  describe('handles any for', () => {
    it('deep paths in filters with some non-branching models', () => {
      builder.addRootModel('labor');
      builder.addRecordFilters([
        {
          modelName: 'wound',
          clauses: [
            {
              attributeName: 'location',
              operator: '::equals',
              operand: 'arm',
              attributeType: 'text',
              modelName: 'wound',
              any: true
            }
          ],
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
          [
            'victim',
            ['wound', ['::and', ['location', '::equals', 'arm']], '::any'],
            '::any'
          ],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('deep paths in filters with branching models only', () => {
      builder.addRootModel('monster');
      builder.addRecordFilters([
        {
          modelName: 'wound',
          clauses: [
            {
              attributeName: 'location',
              operator: '::equals',
              operand: 'arm',
              attributeType: 'text',
              modelName: 'wound',
              any: true
            }
          ],
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
          ['wound', ['::and', ['location', '::equals', 'arm']], '::any'],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('shallow paths in filters with branching models', () => {
      builder.addRootModel('monster');
      builder.addRecordFilters([
        {
          modelName: 'victim',
          clauses: [
            {
              attributeName: 'name',
              operator: '::equals',
              operand: 'Hercules',
              attributeType: 'text',
              modelName: 'victim',
              any: true
            }
          ],
          anyMap: {
            victim: true
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        ['victim', ['::and', ['name', '::equals', 'Hercules']], '::any'],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down the tree', () => {
      builder.addRootModel('prize');
      builder.addRecordFilters([
        {
          modelName: 'wound',
          clauses: [
            {
              attributeName: 'location',
              operator: '::equals',
              operand: 'arm',
              attributeType: 'text',
              modelName: 'wound',
              any: true
            }
          ],
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
          [
            'monster',
            [
              'victim',
              ['wound', ['::and', ['location', '::equals', 'arm']], '::any'],
              '::any'
            ],
            '::any'
          ],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down and terminate in a table', () => {
      builder.addRootModel('monster');
      builder.addRecordFilters([
        {
          modelName: 'prize',
          clauses: [
            {
              attributeName: 'name',
              operator: '::equals',
              operand: 'Apples',
              attributeType: 'text',
              modelName: 'prize',
              any: true
            }
          ],
          anyMap: {
            prize: true
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        [
          'labor',
          ['prize', ['::and', ['name', '::equals', 'Apples']], '::any'],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up the tree', () => {
      builder.addRootModel('prize');
      builder.addRecordFilters([
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'name',
              operator: '::in',
              operand: 'Lion,Hydra',
              attributeType: 'text',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        }
      ]);
      builder.addColumns([stamp('prize', 'name', [])]);

      expect(builder.query()).toEqual([
        'prize',
        ['labor', ['::and', ['name', '::in', ['Lion', 'Hydra']]], '::any'],
        '::all',
        ['name']
      ]);
    });
  });

  describe('handles every for', () => {
    it('deep paths in filters with some non-branching models', () => {
      builder.addRootModel('labor');
      builder.addRecordFilters([
        {
          modelName: 'wound',
          clauses: [
            {
              attributeName: 'location',
              operator: '::equals',
              operand: 'arm',
              attributeType: 'text',
              modelName: 'wound',
              any: true
            }
          ],
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
          [
            'victim',
            ['wound', ['::and', ['location', '::equals', 'arm']], '::every'],
            '::every'
          ],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('deep paths in filters with branching models only', () => {
      builder.addRootModel('monster');
      builder.addRecordFilters([
        {
          modelName: 'wound',
          clauses: [
            {
              attributeName: 'location',
              operator: '::equals',
              operand: 'arm',
              attributeType: 'text',
              modelName: 'wound',
              any: true
            }
          ],
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
          ['wound', ['::and', ['location', '::equals', 'arm']], '::every'],
          '::every'
        ],
        '::all',
        ['name']
      ]);
    });

    it('shallow paths in filters with branching models', () => {
      builder.addRootModel('monster');
      builder.addRecordFilters([
        {
          modelName: 'victim',
          clauses: [
            {
              attributeName: 'name',
              operator: '::equals',
              operand: 'Hercules',
              attributeType: 'text',
              modelName: 'victim',
              any: true
            }
          ],
          anyMap: {
            victim: false
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        ['victim', ['::and', ['name', '::equals', 'Hercules']], '::every'],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down the tree', () => {
      builder.addRootModel('prize');
      builder.addRecordFilters([
        {
          modelName: 'wound',
          clauses: [
            {
              attributeName: 'location',
              operator: '::equals',
              operand: 'arm',
              attributeType: 'text',
              modelName: 'wound',
              any: true
            }
          ],
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
          [
            'monster',
            [
              'victim',
              ['wound', ['::and', ['location', '::equals', 'arm']], '::every'],
              '::every'
            ],
            '::any'
          ],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up and down and terminate in a table', () => {
      builder.addRootModel('monster');
      builder.addRecordFilters([
        {
          modelName: 'prize',
          clauses: [
            {
              attributeName: 'name',
              operator: '::equals',
              operand: 'Apples',
              attributeType: 'text',
              modelName: 'prize',
              any: true
            }
          ],
          anyMap: {
            prize: false
          }
        }
      ]);
      builder.addColumns([stamp('monster', 'name', [])]);

      expect(builder.query()).toEqual([
        'monster',
        [
          'labor',
          ['prize', ['::and', ['name', '::equals', 'Apples']], '::every'],
          '::any'
        ],
        '::all',
        ['name']
      ]);
    });

    it('paths that go up the tree', () => {
      builder.addRootModel('prize');
      builder.addRecordFilters([
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'name',
              operator: '::in',
              operand: 'Lion,Hydra',
              attributeType: 'text',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        }
      ]);
      builder.addColumns([stamp('prize', 'name', [])]);

      expect(builder.query()).toEqual([
        'prize',
        ['labor', ['::and', ['name', '::in', ['Lion', 'Hydra']]], '::any'],
        '::all',
        ['name']
      ]);
    });

    it('correctly handles numeric filters', () => {
      builder.addRootModel('monster');
      builder.addColumns([stamp('monster', 'name', [])]);
      builder.addRecordFilters([
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'number',
              operator: '::equals',
              operand: '2',
              attributeType: 'number',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        },
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'number',
              operator: '::in',
              operand: '1,3,5',
              attributeType: 'number',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        },
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'number',
              operator: '::notin',
              operand: '2,4,6',
              attributeType: 'number',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        },
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'number',
              operator: '::>=',
              operand: '5,6',
              attributeType: 'number',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        }
      ]);

      expect(builder.query()).toEqual([
        'monster',
        [
          '::and',
          ['labor', ['::and', ['number', '::equals', 2]], '::any'],
          ['labor', ['::and', ['number', '::in', [1, 3, 5]]], '::any'],
          ['labor', ['::and', ['number', '::notin', [2, 4, 6]]], '::any'],
          ['labor', ['::and', ['number', '::>=', 5]], '::any']
        ],
        '::all',
        ['name']
      ]);
    });

    it('correctly handles non-numeric filters', () => {
      builder.addRootModel('monster');
      builder.addColumns([stamp('monster', 'name', [])]);
      builder.addRecordFilters([
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'name',
              operator: '::equals',
              operand: '2',
              attributeType: 'text',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        },
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'name',
              operator: '::in',
              operand: '1,3,5',
              attributeType: 'text',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        },
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'name',
              operator: '::notin',
              operand: '2,4,6',
              attributeType: 'text',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        },
        {
          modelName: 'labor',
          clauses: [
            {
              attributeName: 'name',
              operator: '::>=',
              operand: '5,6',
              attributeType: 'text',
              modelName: 'labor',
              any: true
            }
          ],
          anyMap: {}
        }
      ]);

      expect(builder.query()).toEqual([
        'monster',
        [
          '::and',
          ['labor', ['::and', ['name', '::equals', '2']], '::any'],
          ['labor', ['::and', ['name', '::in', ['1', '3', '5']]], '::any'],
          ['labor', ['::and', ['name', '::notin', ['2', '4', '6']]], '::any'],
          ['labor', ['::and', ['name', '::>=', '5,6']], '::any']
        ],
        '::all',
        ['name']
      ]);
    });
  });
});
