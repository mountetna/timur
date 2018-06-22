import {
  view_data,
  model_template
} from '../fixtures/tab_test_data.js';

import {
  getAttributes,
  getPlotIds,
  getTabByIndexOrder,
  interleaveAttributes
} from '../../../lib/client/jsx/selectors/tab_selector';

describe('tab selector', ()=>{
  it('Extracts the attributes from a tab.', ()=>{
    let tab = view_data.views.monster.tabs.default;
    let attributes = getAttributes(tab);
    let expected_value = ['labor', 'name', 'species', 'victim'];

    expect(attributes).toEqual(expected_value);
  });

  it('Extracts the plot ids from a tab.', ()=>{
    let tab = view_data.views.monster.tabs.default;
    let plot_ids = getPlotIds(tab);
    let expected_value = [123, 456];

    expect(plot_ids).toEqual(expected_value);
  });

  it('Extrats a tab by it\'s index_order.', ()=>{
    let tab = getTabByIndexOrder(view_data.views.monster.tabs, 123);
    let expected_value = {
      name: 'other_tab',
      title: '',
      index_order: 123,
      panes: {
      }
    };

    expect(tab).toEqual(expected_value);
  });

  let long_str = `Interleaves the view attribute properties with the tab
attribute properties.`;

  it(long_str, ()=>{
    let tab = view_data.views.monster.tabs.default;
    tab = interleaveAttributes(tab, model_template);

    let expected_value = {
      species: {
        name: 'species',
        type: 'String',
        attribute_class: 'Magma::Attribute',
        display_name: 'Species',
        match: '^[a-z\\s]+$',
        shown: true,
        title: null,
        index_order: 2,
        plot_id: 'monkey wrench',
        manifest_id: null,
        editable: true
      },
      victim: {
        name: 'victim',
        model_name: 'victim',
        attribute_class: 'LinePlotAttribute',
        display_name: 'Victim',
        shown: true,
        title: null,
        index_order: 3,
        plot_id: 456,
        manifest_id: 135,
        editable: true
      }
    };

    let processed_value = {
      species: tab.panes.default.attributes.species,
      victim: tab.panes.default.attributes.victim
    };

    expect(processed_value).toEqual(expected_value);
  });
});