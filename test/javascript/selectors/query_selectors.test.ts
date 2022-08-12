import {QueryColumn} from '../../../lib/client/jsx/contexts/query/query_types';
import {
  selectMatrixModelNames,
  selectMatrixAttributes,
  stepIsOneToMany,
  pathToColumn,
  getPath,
  createFigurePayload
} from '../../../lib/client/jsx/selectors/query_selector';

const models = {
  prize: {
    documents: {},
    revisions: {},
    views: {},
    template: require('../fixtures/template_prize.json')
  },
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
  }
};

describe('selectMatrixModelNames', () => {
  it('returns matrix model names', () => {
    let selectedColumns: QueryColumn[] = [
      {
        model_name: 'labor',
        attribute_name: 'contributions',
        display_label: 'labor.contributions',
        slices: []
      },
      {
        model_name: 'prize',
        attribute_name: 'name',
        display_label: 'prize.name',
        slices: []
      }
    ];

    let matrixModelNames = selectMatrixModelNames(models, selectedColumns);

    expect(matrixModelNames).toEqual(['labor']);

    selectedColumns = [
      {
        model_name: 'prize',
        attribute_name: 'name',
        display_label: 'prize.name',
        slices: []
      }
    ];
    matrixModelNames = selectMatrixModelNames(models, selectedColumns);

    expect(matrixModelNames).toEqual([]);
  });
});

describe('selectMatrixAttributes', () => {
  it('returns only matrix attributes', () => {
    let selectedColumns: QueryColumn[] = [
      {
        model_name: 'labor',
        attribute_name: 'contributions',
        display_label: 'labor.contributions',
        slices: []
      },
      {
        model_name: 'prize',
        attribute_name: 'name',
        display_label: 'prize.name',
        slices: []
      }
    ];
    let matrixAttributes = selectMatrixAttributes(
      Object.values(models.labor.template.attributes),
      selectedColumns
    );

    expect(matrixAttributes).toEqual([
      models.labor.template.attributes['contributions']
    ]);

    selectedColumns = [
      {
        model_name: 'labor',
        attribute_name: 'year',
        display_label: 'labor.year',
        slices: []
      },
      {
        model_name: 'prize',
        attribute_name: 'name',
        display_label: 'prize.name',
        slices: []
      }
    ];
    matrixAttributes = selectMatrixAttributes(
      Object.values(models.labor.template.attributes),
      selectedColumns
    );

    expect(matrixAttributes).toEqual([]);
  });
});

describe('pathToColumn', () => {
  describe('when expandMatrices is false', () => {
    it('finds top-level headings', () => {
      let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
      expect(pathToColumn(input, 'bim@2', false)).toEqual('2');
    });

    it('returns -1 when no match', () => {
      let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
      expect(pathToColumn(input, 'kapow@1', false)).toEqual('-1');
    });

    it('finds root index for nested headings', () => {
      let input = [
        'foo',
        ['bar', ['shallow']],
        'bim',
        ['blah', 'zap', ['deep', ['nesting']]]
      ];
      expect(pathToColumn(input, 'nesting@3', false)).toEqual('3');
    });
  });

  describe('when expandMatrices is true', () => {
    it('finds top-level headings', () => {
      let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
      expect(pathToColumn(input, 'bim@2', true)).toEqual('2');
    });

    it('returns -1 when no match', () => {
      let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
      expect(pathToColumn(input, 'kapow@1', true)).toEqual('-1');
    });

    it('finds root index for nested headings', () => {
      let input = [
        'foo',
        ['bar', ['shallow']],
        'bim',
        ['blah', 'zap', ['deep', ['nesting']]]
      ];
      expect(pathToColumn(input, 'nesting@3', true)).toEqual('3');
    });

    it('returns full path when expanding matrices', () => {
      let input = [
        'foo',
        ['bar', ['shallow']],
        'bim',
        ['blah', 'zap', ['deep', ['something', 'nesting']]]
      ];

      // Note that the values may seem counterintuitive, but the
      //   query answer actually compacts out the "attribute",
      //   which in these cases would be "bar" and "deep".
      // Answer would be something like:
      // answer = [
      //  1,
      //  [2],
      //  3,
      //  [4, 5, [6, 7]]
      // ]
      expect(pathToColumn(input, 'bar@1.shallow', true)).toEqual('1.0');
      expect(pathToColumn(input, 'deep@3.nesting', true)).toEqual('3.2.1');
    });

    it('returns correct path for duplicate values', () => {
      let input = [
        'foo',
        ['bar', ['shallow', 'deep']],
        ['bar', ['shallow', 'deep']],
        ['blah', 'zap', ['deep', ['something', 'nesting']]]
      ];

      // Note that the values may seem counterintuitive, but the
      //   query answer actually compacts out the "attribute",
      //   which in these cases would be "bar".
      // Answer would be something like:
      // answer = [
      //  1,
      //  [2, 3],
      //  [4, 5],
      //  [6, 7, [8, 9]]
      // ]
      expect(pathToColumn(input, 'bar@1.shallow', true)).toEqual('1.0');
      expect(pathToColumn(input, 'bar@1.deep', true)).toEqual('1.1');
      expect(pathToColumn(input, 'bar@2.shallow', true)).toEqual('2.0');
      expect(pathToColumn(input, 'bar@2.deep', true)).toEqual('2.1');
    });
  });
});

describe('getPath', () => {
  it('finds path to nested model name', () => {
    let input = ['model1', ['model2', ['model3', '::any'], '::any'], '::any'];
    expect(getPath(input, 'model3', [])).toEqual([1, 1, 0]);
  });
});

describe('stepIsOneToMany', () => {
  it('correctly identifies one-to-many relationships', () => {
    expect(stepIsOneToMany(models, 'labor', 'monster')).toEqual(false);
    expect(stepIsOneToMany(models, 'labor', 'prize')).toEqual(true);
    expect(stepIsOneToMany(models, 'monster', 'victim')).toEqual(true);
    expect(stepIsOneToMany(models, 'labor', 'victim')).toEqual(false);
  });
});

describe('createFigurePayload', () => {
  it('stringifies elements in the query', () => {
    const result = createFigurePayload({
      query: {
        user_columns: ["foo", "bar"],
        query: "this is a query",
        something: {key: "value"}
      },
      title: "A plot",
      workflow: {
        inputQueryMap: {
          "1": "query",
          "2": "user_columns",
          "3": "something"
        },
        name: 'test'
      }
    });

    expect(result).toEqual({
      title: 'A plot',
      workflow_name: 'test',
      inputs: {
        "1": "this is a query",
        "2": JSON.stringify(["foo", "bar"]),
        "3": JSON.stringify({key: "value"})
      }
    })
  })
})