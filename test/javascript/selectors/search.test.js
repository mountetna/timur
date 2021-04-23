import {
  selectSearchAttributeNames,
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

describe('selectSearchFilterString', () => {
  it('returns the filter_string from the search state', () => {
    let state = {
      search: {
        attribute_names: ['name', 'stats', 'species'],
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
