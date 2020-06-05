import React from 'react';
import { mount, shallow } from 'enzyme';
import { mockStore } from '../../helpers';
import { renderer } from 'react-test-renderer';
import FileAttribute from '../../../../lib/client/jsx/components/attributes/file_attribute';
import ButtonBar from '../../../../lib/client/jsx/components/button_bar';

import * as magmaActions from '../../../../lib/client/jsx/actions/magma_actions';

describe('FileAttribute', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      }
    });
  });

  it('renders the button bar while editing', () => {
    const component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={null}
        value={null}
        mode="edit"
        attribute="gravatar"
        document="Timur"
        revised_value=""
        store={store} />
    );

    const buttons = component.find(ButtonBar);
    expect(buttons.exists()).toBeTruthy();
  });

  it('does not render action buttons while not editing', () => {
    const value = null;

    const component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={null}
        value={value}
        mode="view"
        attribute="gravatar"
        document="Timur"
        revised_value=""
        store={store} />
    );

    const buttons = component.find('file-buttons');
    expect(buttons.exists()).toBeFalsy();
  });

  it('renders blank paths correctly while not editing', () => {
    let value = {'path': '::blank'};

    let component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={null}
        value={value}
        mode="view"
        attribute="gravatar"
        document="Timur"
        revised_value=""
        store={store} />
    );

    expect(component.text().trim()).toEqual("Blank file");

    value = '::blank';

    component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={null}
        value={value}
        mode="view"
        attribute="gravatar"
        document="Timur"
        revised_value=""
        store={store} />
    );

    expect(component.text().trim()).toEqual("Blank file");
  });

  it('renders "missing file" correctly while not editing', () => {
    const value = null;

    const component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={null}
        value={value}
        mode="view"
        attribute="gravatar"
        document="Timur"
        revised_value=""
        store={store} />
    );

    expect(component.text().trim()).toEqual("No file");
  });

  it('renders existing files correctly when not editing', () => {
    const value = new File(
      ["Believe me, you are but pismire ant:"],
      "conquest.txt",
      {type: "text/plain"});

    const component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={null}
        value={value}
        mode="view"
        attribute="gravatar"
        document="Timur"
        revised_value=""
        store={store} />
    );

    expect(component.text().trim()).toEqual("conquest.txt (text/plain)");
  });

  it('accepts a valid Metis path', () => {
    const component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={{name: 'Conquests', identifier: 1}}
        value={null}
        mode="edit"
        attribute={{name: 'ExpansionPlans'}}
        document={{'1': 'Timur'}}
        revised_value=""
        store={store} />
    );

    const cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    const metisPathInput = component.find('.file-metis-select').find('input');
    metisPathInput.instance().value = 'metis://project/bucket/file_name.txt';

    const checkButton = component.find('.check').first();
    checkButton.simulate('click');

    expect(component.find('file-metis-error').exists()).toBeFalsy();

    const actions = store.getActions();
    expect(actions).toEqual([{
      type: 'REVISE_DOCUMENT',
      model_name: 'Conquests',
      record_name: 'Timur',
      revision: {
        ['ExpansionPlans']: 'metis://project/bucket/file_name.txt'
      }
    }])
  });

  it('shows an error message when given an invalid Metis path', () => {
    const component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={{name: 'Conquests', identifier: 1}}
        value={null}
        mode="edit"
        attribute={{name: 'ExpansionPlans'}}
        document={{'1': 'Timur'}}
        revised_value=""
        store={store} />
    );

    const cloudButton = component.find('.cloud').first();
    cloudButton.simulate('click');

    const metisPathInput = component.find('.file-metis-select').find('input');
    metisPathInput.instance().value = 'project/bucket/file_name.txt';

    const checkButton = component.find('.check').first();
    checkButton.simulate('click');

    expect(component.find('.file-metis-error').exists()).toBeTruthy();
  });
})
