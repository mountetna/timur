import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { mockStore } from '../helpers';
import ModelMap from '../../../lib/client/jsx/components/model_map';

const models = {
  monster: { template: require('../fixtures/template_monster.json') },
  labor: { template: require('../fixtures/template_labor.json') },
  project: { template: require('../fixtures/template_project.json') }
};

describe('ModelMap', () => {
  let store;

  it('renders', () => {
    store = mockStore({
      magma: { models },
      janus: { projects: [] }
    });

    global.CONFIG = {
      magma_host: 'magma.test'
    };

    // Wrap with Provider here so store gets passed down to child components in Context
    const tree = renderer
      .create(
        <Provider store={store}>
          <ModelMap />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders an incomplete graph', () => {
    let { monster, project } = models;

    store = mockStore({
      magma: { models: { monster, project } },
      janus: { projects: [] }
    });

    global.CONFIG = {
      magma_host: 'magma.test'
    };

    // Wrap with Provider here so store gets passed down to child components in Context
    const tree = renderer
      .create(
        <Provider store={store}>
          <ModelMap />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
