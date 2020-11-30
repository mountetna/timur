import React from 'react';
import {Provider} from 'react-redux';
import {mount, shallow} from 'enzyme';
import {act} from 'react-dom/test-utils';
import {mockStore} from '../helpers';
import renderer from 'react-test-renderer';
import ReactModal from 'react-modal';
import nock from 'nock';

import FileInput from '../../../lib/client/jsx/components/inputs/file_input';

describe('FileInput', () => {
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

  it('accepts a valid Metis path', (done) => {
    const path = 'metis://project/bucket/file_name.txt';
    const component = mount(
      <Provider store={store}>
        <FileInput
          header='test'
          onBlur={() => {}}
          onChange={(values) => {
            expect(values).toEqual({
              original_filename: 'file_name.txt',
              path
            });
            done();
          }}
        />
      </Provider>
    );

    const cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    let modal = component.find(ReactModal);
    const metisPathInput = modal.find('.file-metis-select').find('input');
    metisPathInput.instance().value = path;

    const checkButton = modal.find('.check').first();
    checkButton.simulate('click');

    // refresh the modal contents
    modal = component.find(ReactModal);
    expect(modal.find('file-metis-error').exists()).toBeFalsy();
  });

  xit('shows an error message when given an invalid Metis path', () => {
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

  xit('calls both onBlur and onChange when value set', () => {
    const component = mount(
      <Provider store={store}>
        <FileInput
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
});
