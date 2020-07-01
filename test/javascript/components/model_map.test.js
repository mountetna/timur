import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { mockStore } from '../helpers';
import ModelMap from '../../../lib/client/jsx/components/model_map';

describe('ModelMap', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      magma: {
        models: {
          patients: {
            template: {
              name: 'patients',
              attributes: {
                link_model_name: 'experiment'
              }
            }
          }
        }
      }
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
          <ModelMap />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
