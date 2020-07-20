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

  it('selecting a table (model) enables the Search and TSV buttons', async () => {
    const component = mount(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    expect(component.find('.button.disabled').length).toEqual(2);

    const tableSelect = component.find(SelectInput).first();
    tableSelect.simulate('change', {
      target: {
        value: '0'
      }
    });

    // Trigger a re-render so that the buttons are updated
    component.update();

    expect(component.find('.button.disabled').length).toEqual(0);
  });

  it('resets the displayed attributes when a new table (model) is selected', () => {
    const component = mount(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    const tableSelect = component.find(SelectInput).first();
    tableSelect.simulate('change', {
      target: {
        value: '0'
      }
    });

    // Trigger a re-render so that state and props are updated
    component.update();

    const first_attrs = component.find('.etna-checkbox');

    tableSelect.simulate('change', {
      target: {
        value: '1'
      }
    });

    component.update();

    const second_attrs = component.find('.etna-checkbox');
    expect(first_attrs.length).not.toEqual(second_attrs.length);
  });

  it('resets the cache when a new table (model) is selected', () => {
    const mockEmptySearchCache = jest.fn();

    const component = shallow(
      <RawSearchComponent
        magma_state={{models}}
        cache={{}}
        emptySearchCache={mockEmptySearchCache}
        requestModels={jest.fn()}
        setSearchAttributeNames={jest.fn()}
      />
    );

    expect(mockEmptySearchCache).toHaveBeenCalled();

    const tableSelect = component.find(SelectInput).first();
    // Different for shallow and mount?
    tableSelect.simulate('change', 'monster');

    component.update();

    tableSelect.simulate('change', 'labor');

    component.update();

    // One time was on mounting
    expect(mockEmptySearchCache).toHaveBeenCalled();
  });

  it('returns no attribute_names if no model selected', () => {
    const component = shallow(
      <RawSearchComponent
        magma_state={{models}}
        cache={{}}
        emptySearchCache={jest.fn()}
        requestModels={jest.fn()}
        setSearchAttributeNames={jest.fn()}
      />
    );

    expect(component.instance().getDisplayAttributeOptions()).toEqual(
      undefined
    );
  });

  it('nests attribute_names in arrays', () => {
    const component = shallow(
      <RawSearchComponent
        magma_state={{models}}
        cache={{}}
        emptySearchCache={jest.fn()}
        requestModels={jest.fn()}
        setSearchAttributeNames={jest.fn()}
      />
    );

    const tableSelect = component.find(SelectInput).first();
    // Different for shallow and mount?
    tableSelect.simulate('change', 'monster');

    component.update();

    expect(component.instance().getDisplayAttributeOptions()).toEqual([
      ['aspect'],
      ['labor'],
      ['name'],
      ['species'],
      ['stats'],
      ['victim']
    ]);
  });

  it('calculates tree state with selected and unselected attribute names', () => {
    const component = shallow(
      <RawSearchComponent
        magma_state={{models}}
        cache={{}}
        emptySearchCache={jest.fn()}
        requestModels={jest.fn()}
        setSearchAttributeNames={jest.fn()}
      />
    );

    const result = component
      .instance()
      .convertAttributeNameListToTreeState(
        ['labor', 'species', 'stats'],
        [['aspect'], ['labor'], ['name'], ['species'], ['stats'], ['victim']]
      );

    expect(result).toEqual({
      aspect: false,
      labor: true,
      name: false,
      species: true,
      stats: true,
      victim: false
    });
  });
});
