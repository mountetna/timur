import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import {mockStore} from '../helpers';
import ReactModal from 'react-modal';

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

  it('by default only includes a cloud link button for Metis paths', () => {
    const path = 'metis://project/bucket/file_name.txt';
    const component = mount(
      <Provider store={store}>
        <FileInput header='test' onBlur={() => {}} onChange={() => {}} />
      </Provider>
    );

    const cloudButton = component.find('.cloud');
    expect(cloudButton.exists()).toBeTruthy();

    const removeButton = component.find('.remove');
    expect(removeButton.exists()).toBeFalsy();
  });

  it('shows an error message when given an invalid Metis path', () => {
    const path = 'project/bucket/file_name.txt';
    const component = mount(
      <Provider store={store}>
        <FileInput header='test' onBlur={() => {}} onChange={() => {}} />
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
    expect(modal.find('.file-metis-error').exists()).toBeTruthy();

    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('calls both onBlur and onChange when value set', (done) => {
    // This is so the ListInput component behaves correctly.
    let onBlurCalled = false;
    let onChangeCalled = false;

    function checkBothFunctions() {
      if (onBlurCalled && onChangeCalled) {
        done();
      }
    }

    const path = 'metis://project/bucket/file_name.txt';
    const component = mount(
      <Provider store={store}>
        <FileInput
          header='test'
          onBlur={() => {
            onBlurCalled = true;
            checkBothFunctions();
          }}
          onChange={() => {
            onChangeCalled = true;
            checkBothFunctions();
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
});
