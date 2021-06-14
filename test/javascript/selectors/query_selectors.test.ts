import {
  selectSliceableModelNames,
  selectMatrixAttributes,
  selectOuterIndexOf,
  stepIsOneToMany,
  pathToColumn
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

describe('selectSliceableModelNames', () => {
  it('returns the only table and matrix model names', () => {
    let selectedAttributes: {[key: string]: any} = {
      labor: [
        {
          model_name: 'labor',
          attribute_name: 'contributions',
          display_label: 'labor.contributions'
        }
      ],
      prize: [
        {
          model_name: 'prize',
          attribute_name: 'name',
          display_label: 'prize.name'
        }
      ]
    };
    let sliceableModelNames = selectSliceableModelNames(
      models,
      selectedAttributes
    );

    expect(sliceableModelNames).toEqual(['prize', 'labor']);

    selectedAttributes = {
      labor: [
        {
          model_name: 'labor',
          attribute_name: 'year',
          display_label: 'labor.year'
        }
      ]
    };
    sliceableModelNames = selectSliceableModelNames(models, selectedAttributes);

    expect(sliceableModelNames).toEqual([]);
  });
});

describe('selectMatrixAttributes', () => {
  it('returns only matrix attributes', () => {
    let selectedAttributes: {[key: string]: any} = {
      labor: [
        {
          model_name: 'labor',
          attribute_name: 'contributions',
          display_label: 'labor.contributions'
        }
      ],
      prize: [
        {
          model_name: 'prize',
          attribute_name: 'name',
          display_label: 'prize.name'
        }
      ]
    };
    let matrixAttributes = selectMatrixAttributes(
      Object.values(models.labor.template.attributes),
      selectedAttributes.labor
    );

    expect(matrixAttributes).toEqual([
      models.labor.template.attributes['contributions']
    ]);

    selectedAttributes = {
      labor: [
        {
          model_name: 'labor',
          attribute_name: 'year',
          display_label: 'labor.year'
        }
      ],
      prize: [
        {
          model_name: 'prize',
          attribute_name: 'name',
          display_label: 'prize.name'
        }
      ]
    };
    matrixAttributes = selectMatrixAttributes(
      Object.values(models.labor.template.attributes),
      selectedAttributes.labor
    );

    expect(matrixAttributes).toEqual([]);
  });
});

describe('selectOuterIndexOf', () => {
  it('finds top-level headings', () => {
    let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
    expect(selectOuterIndexOf(input, 'bim')).toEqual(2);
  });

  it('returns -1 when no match', () => {
    let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
    expect(selectOuterIndexOf(input, 'kapow')).toEqual(-1);
  });

  it('finds nested headings', () => {
    let input = [
      'foo',
      ['bar', ['shallow']],
      'bim',
      ['blah', 'zap', ['deep', ['nesting']]]
    ];
    expect(selectOuterIndexOf(input, 'nesting')).toEqual(3);
  });
});

describe('pathToColumn', () => {
  it('finds top-level headings', () => {
    let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
    expect(pathToColumn(input, 'bim', false)).toEqual('2');
  });

  it('returns -1 when no match', () => {
    let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
    expect(pathToColumn(input, 'kapow', false)).toEqual('-1');
  });

  it('finds nested headings', () => {
    let input = [
      'foo',
      ['bar', ['shallow']],
      'bim',
      ['blah', 'zap', ['deep', ['nesting']]]
    ];
    expect(pathToColumn(input, 'nesting', false)).toEqual('3');
  });

  it('returns full path when expanding matrices', () => {
    let input = [
      'foo',
      ['bar', ['shallow']],
      'bim',
      ['blah', 'zap', ['deep', ['nesting']]]
    ];
    expect(pathToColumn(input, 'nesting', true)).toEqual('3.2.1.0');
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
