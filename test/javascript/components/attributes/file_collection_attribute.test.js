import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import {act} from 'react-dom/test-utils';
import {mockStore} from '../../helpers';
import renderer from 'react-test-renderer';
import ReactModal from 'react-modal';
import nock from 'nock';

import ButtonBar from '../../../../lib/client/jsx/components/button_bar';
import {STUB} from '../../../../lib/client/jsx/components/attributes/file_attribute';
import FileAttribute from '../../../../lib/client/jsx/components/attributes/file_attribute';

import ListUpload from 'etna-js/upload/components/list-upload';

describe('FileCollectionAttribute', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {}
      }
    });
  });

  it('renders the button bar while editing', () => {
    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={null}
          mode='edit'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    const buttons = component.find(ButtonBar);
    expect(buttons.exists()).toBeTruthy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={null}
            mode='edit'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('does not render action buttons while not editing', () => {
    const value = null;

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    const buttons = component.find('file-buttons');
    expect(buttons.exists()).toBeFalsy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={value}
            mode='view'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders existing files correctly when not editing', () => {
    const value = new File(
      ['Believe me, you are but pismire ant:'],
      'conquest.txt',
      {type: 'text/plain'}
    );

    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value={value}
          mode='view'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    expect(component.text().trim()).toEqual('conquest.txt (text/plain)');

    const tree = renderer
      .create(
        <Provider store={store}>
          <FileAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value={value}
            mode='view'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('dispatches an action to remove a file', () => {
    const component = mount(
      <Provider store={store}>
        <FileAttribute
          model_name='conquests'
          record_name='Persia'
          template={{name: 'Conquests', identifier: 1}}
          value={null}
          mode='edit'
          attribute={{name: 'ExpansionPlans'}}
          document={{'1': 'Timur'}}
          revised_value=''
        />
      </Provider>
    );

    const removeButton = component.find('.remove').first();
    removeButton.simulate('click');

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'Conquests',
        record_name: 'Timur',
        revision: {
          ['ExpansionPlans']: {path: null}
        }
      }
    ]);
  });
});
