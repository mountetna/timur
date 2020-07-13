import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {mockStore} from '../helpers';
import ModelReport from '../../../lib/client/jsx/components/model_report';

const models = {
  monster: {template: require('../fixtures/template_monster.json')},
  labor: {template: require('../fixtures/template_labor.json')},
  project: {template: require('../fixtures/template_project.json')}
};

describe('ModelReport', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      magma: {models}
    });
  });

  it('renders', () => {
    global.TIMUR_CONFIG = {
      magma_host: 'magma.test'
    };

    // Wrap with Provider here so store gets passed down to child components in Context
    const tree = renderer
      .create(
        <Provider store={store}>
          <ModelReport />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
