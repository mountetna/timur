import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {mockStore, stubUrl, cleanStubs} from '../helpers';
import Search, {
  Search as RawSearchComponent
} from '../../../lib/client/jsx/components/search/search';
import SelectInput from '../../../lib/client/jsx/components/inputs/select_input';

const models = {
  monster: {template: require('../fixtures/template_monster.json')},
  labor: {template: require('../fixtures/template_labor.json')},
  project: {template: require('../fixtures/template_project.json')}
};

describe('Search', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      magma: {models},
      search: {
        model_name: 'Labors',
        pages: {}
      }
    });
  });

  afterEach(cleanStubs);

  it('renders', () => {
    global.TIMUR_CONFIG = {
      magma_host: 'magma.test'
    };

    // Wrap with Provider here so store gets passed down to child components in Context
    const tree = renderer
      .create(
        <Provider store={store}>
          <Search />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
