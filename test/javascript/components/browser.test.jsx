import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {mockStore, setConfig} from '../helpers';
import {stubUrl} from 'etna-js/spec/helpers';
import Browser from "../../../lib/client/jsx/components/browser/browser";

describe('Browser', () => {
  let store;

  const models = {
    monster: {template: require('../fixtures/template_monster.json')},
    labor: {template: require('../fixtures/template_labor.json')},
    project: {template: require('../fixtures/template_project.json')}
  };

  beforeEach(() => {
    store = mockStore({
      magma: {models},
    });
  });

  it('renders', async () => {
    stubUrl({
      verb: 'GET',
      path: Routes.manifests_fetch_path('labors'),
      status: 200,
      host: 'http://localhost'
    });

    const browser = mount(
      <Provider store={store}>
        <Browser model_name='monster' record_name='joe'/>
      </Provider>
    )
  });
});
