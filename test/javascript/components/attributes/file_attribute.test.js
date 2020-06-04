import React from 'react';
import { mount, shallow } from 'enzyme';
import { mockStore } from '../../helpers';
import { renderer } from 'react-test-renderer';
import FileAttribute from '../../../../lib/client/jsx/components/attributes/file_attribute';
import ButtonBar from '../../../../lib/client/jsx/components/button_bar';

import { reviseDocument } from '../../../../lib/client/jsx/actions/magma_actions';

describe('FileAttribute', () => {
  const store=mockStore({
    location: {
      path: '/labors/browse/monster/Nemean Lion'
    }
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

  it('calls reviseDocument when user provides a valid Metis path', () => {
    const component = mount(
      <FileAttribute
        model_name='conquests'
        record_name='Persia'
        template={null}
        value={null}
        mode="view"
        attribute="gravatar"
        document="Timur"
        revised_value=""
        store={store} />
    );
    component.state.metis = true;
    expect(component.state.error).toBeUndefined();
    component.metis_file = {
      value: 'metis://project/bucket/file_name.txt'
    };

    component.selectMetisFile();

    expect(reviseDocument).toHaveBeenCalled();

    expect(component.state.error).toEqual(false);
    expect(component.state.metis).toEqual(false);
  });
})
