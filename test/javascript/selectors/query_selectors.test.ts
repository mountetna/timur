import {
  selectSliceableModelNames,
  selectMatrixAttributes,
  selectOuterIndexOf
} from '../../../lib/client/jsx/selectors/query_selector';

const models = {
  monster: {template: require('../fixtures/template_monster.json')},
  labor: {template: require('../fixtures/template_labor.json')},
  prize: {template: require('../fixtures/template_prize.json')},
  project: {template: require('../fixtures/template_project.json')}
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
  it('find top-level headings', () => {
    let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
    expect(selectOuterIndexOf(input, 'bim')).toEqual(2);
  });

  it('returns -1 when no match', () => {
    let input = ['foo', 'bar', 'bim', ['blah', 'zap']];
    expect(selectOuterIndexOf(input, 'kapow')).toEqual(-1);
  });

  fit('finds nested headings', () => {
    let input = [
      'foo',
      ['bar', ['shallow']],
      'bim',
      ['blah', 'zap', ['deep', ['nesting']]]
    ];
    expect(selectOuterIndexOf(input, 'nesting')).toEqual(3);
  });
});
