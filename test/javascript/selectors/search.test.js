import {
  selectSearchAttributeNames,
  selectSearchFilterParams,
  selectSearchFilterString,
  selectSortedDisplayAttributeNames
} from '../../../lib/client/jsx/selectors/search';

const models = {
  monster: {template: require('../fixtures/template_monster.json')},
  labor: {template: require('../fixtures/template_labor.json')},
  project: {template: require('../fixtures/template_project.json')}
};

describe('selectSearchAttributeNames', () => {
  it('returns the attribute_names from the search state', () => {
    let state = {
      search: {
        attribute_names: ['name', 'stats', 'species']
      }
    };

    let attribute_names = selectSearchAttributeNames(state);

    expect(attribute_names).toEqual(['name', 'stats', 'species']);
  });
});

describe('selectSearchFilterParams', () => {
  it('returns the filter_params from the search state', () => {
    let state = {
      search: {
        attribute_names: ['name', 'stats', 'species'],
        filter_params: [{attribute: 'species', operator: '=', value: 'lion'}]
      }
    };

    let filter_params = selectSearchFilterParams(state);

    expect(filter_params).toEqual([
      {attribute: 'species', operator: '=', value: 'lion'}
    ]);
  });
});

describe('selectSearchFilterString', () => {
  it('returns the filter_string from the search state', () => {
    let state = {
      search: {
        attribute_names: ['name', 'stats', 'species'],
        filter_params: [{attribute: 'species', operator: '=', value: 'lion'}],
        filter_string: 'all'
      }
    };

    let filter_string = selectSearchFilterString(state);

    expect(filter_string).toEqual('all');
  });
});

describe('selectSortedDisplayAttributeNames', () => {
  it('returns the sorted names of all attributes', () => {
    let state = {
      magma: {models},
      search: {selected_model: 'monster'}
    };

    let attribute_names = selectSortedDisplayAttributeNames(state);

    expect(attribute_names).toEqual([
      'name',
      'labor',
      'aspect',
      'victim',
      'stats',
      'certificates',
      'species'
    ]);
  });
});
