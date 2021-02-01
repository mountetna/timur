import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { mockStore } from '../helpers';
import ModelViewer from '../../../lib/client/jsx/components/model_viewer';

const MONSTER = require('../fixtures/template_monster.json');

describe('ModelViewer', () => {
  let store;
  let template;

  beforeEach(() => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {}
      },
      magma: {
        models: {
          monster: {
            template: MONSTER,
            documents: {
              'Nemean Lion': { name: 'Nemean Lion', species: 'lion' },
              'Lernean Hydra': { name: 'Lernean Hydra', species: 'hydra' }
            }
          }
        }
      }
    });
  });

  it('renders', () => {
    global.CONFIG = {
      magma_host: 'magma.test'
    };

    // Wrap with Provider here so store gets passed down to child components in Context
    const tree = renderer
      .create(
        <Provider store={store}>
          <ModelViewer
            model_name={'monster'}
            record_names={ ['Nemean Lion', 'Lernean Hydra'] }
        />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
