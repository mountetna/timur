import {
  selectSearchAttributeNames,
  constructSingleFilterString,
  selectSearchFilterParams,
  selectSearchFilterString
} from '../../../lib/client/jsx/selectors/search';

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

describe('constructSingleFilterString', () => {
  it('returns the filter_string if set', () => {
    let state = {
      search: {
        filter_params: [{attribute: 'species', operator: '=', value: 'lion'}],
        filter_string: 'all'
      }
    };

    let filter_string = constructSingleFilterString(state);

    expect(filter_string).toEqual('all');
  });

  it('returns the filter_params if no filter_string', () => {
    let state = {
      search: {
        filter_params: [
          {attribute: 'species', operator: '=', value: 'lion'},
          {attribute: 'name', operator: '~', value: '/nem/'},
          {attribute: 'lives', operator: '<', value: '2'},
          {attribute: 'stats', operator: '>', value: '5'}
        ]
      }
    };

    let filter_string = constructSingleFilterString(state);

    expect(filter_string).toEqual('species=lion name~/nem/ lives<2 stats>5');
  });

  it('returns empty string if no filter_string or no filter_params', () => {
    let state = {
      search: {
        attribute_names: ['species', 'name', 'lives', 'stats']
      }
    };

    let filter_string = constructSingleFilterString(state);

    expect(filter_string).toEqual('');
  });
});
