import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import {mockStore} from '../../helpers';
import renderer from 'react-test-renderer';
import ReactModal from 'react-modal';
import ButtonBar from '../../../../lib/client/jsx/components/button_bar';
import {STUB} from '../../../../lib/client/jsx/components/attributes/file_attribute';
import ImageAttribute from '../../../../lib/client/jsx/components/attributes/image_attribute';

import * as magmaActions from '../../../../lib/client/jsx/actions/magma_actions';

describe('ImageAttribute', () => {
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
        <ImageAttribute
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
          <ImageAttribute
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
        <ImageAttribute
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
          <ImageAttribute
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

  it('renders blank paths correctly while not editing', () => {
    let value = {path: '::blank'};

    let component = mount(
      <Provider store={store}>
        <ImageAttribute
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

    expect(component.text().trim()).toEqual('Blank file');

    value = '::blank';

    component = mount(
      <Provider store={store}>
        <ImageAttribute
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

    expect(component.text().trim()).toEqual('Blank file');

    const tree = renderer
      .create(
        <Provider store={store}>
          <ImageAttribute
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

  it('renders "missing file" correctly while not editing', () => {
    const value = null;

    const component = mount(
      <Provider store={store}>
        <ImageAttribute
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

    expect(component.text().trim()).toEqual('No file');

    const tree = renderer
      .create(
        <Provider store={store}>
          <ImageAttribute
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
        <ImageAttribute
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
          <ImageAttribute
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

  it('accepts a valid Metis path', () => {
    const component = mount(
      <Provider store={store}>
        <ImageAttribute
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

    const cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    let modal = component.find(ReactModal);
    const metisPathInput = modal.find('.file-metis-select').find('input');
    metisPathInput.instance().value = 'metis://project/bucket/file_name.txt';

    const checkButton = modal.find('.check').first();
    checkButton.simulate('click');

    // refresh the modal contents
    modal = component.find(ReactModal);
    expect(modal.find('file-metis-error').exists()).toBeFalsy();

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'Conquests',
        record_name: 'Timur',
        revision: {
          ['ExpansionPlans']: {path: 'metis://project/bucket/file_name.txt'}
        }
      }
    ]);
  });

  it('shows an error message when given an invalid Metis path', () => {
    const component = mount(
      <Provider store={store}>
        <ImageAttribute
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

    const cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    let modal = component.find(ReactModal);
    const metisPathInput = modal.find('.file-metis-select').find('input');
    metisPathInput.instance().value = 'project/bucket/file_name.txt';

    const checkButton = modal.find('.check').first();
    checkButton.simulate('click');

    // refresh the modal contents
    modal = component.find(ReactModal);
    expect(modal.find('.file-metis-error').exists()).toBeTruthy();

    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('dispatches an action to mark a file as blank', () => {
    const component = mount(
      <Provider store={store}>
        <ImageAttribute
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

    const stubButton = component.find('.stub').first();
    stubButton.simulate('click');

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'REVISE_DOCUMENT',
        model_name: 'Conquests',
        record_name: 'Timur',
        revision: {
          ['ExpansionPlans']: {path: STUB}
        }
      }
    ]);
  });

  it('dispatches an action to remove a file', () => {
    const component = mount(
      <Provider store={store}>
        <ImageAttribute
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

  // TODO: test for dispatching action when file uploaded
  //   * This has to talk to both Metis and Magma, so a little more
  //      involved.
});
