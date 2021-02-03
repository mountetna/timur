import React from 'react';
import { mount } from 'enzyme';
import SelectInput from '../../../lib/client/jsx/components/inputs/select_input';

describe('SelectInput', () => {
  it('displays an html select box with options for values in props.values', () => {
    let values = [ 'nitwit', 'blubber', 'oddment', 'tweak' ];
    let component = mount(
      <SelectInput values={ values }/>
    );

    let p = component.find('option');
    expect(p.map(i => i.text())).toEqual(values);
    expect(p.map(i => i.prop('value'))).toEqual([0,1,2,3]);
  });

  it('emits a value when an option is clicked', () => {
    let selected_value = null;
    let onChange = (value) => selected_value = value;

    let values = [ 'nitwit', 'blubber', 'oddment', 'tweak' ];
    let component = mount(
      <SelectInput values={ values } onChange={ onChange }/>
    );

    component.find('option').at(1).simulate('change');
    expect(selected_value).toEqual('blubber')
  });

  it('emits a numerical value when an option is clicked', () => {
    let selected_value = null;
    let onChange = (value) => selected_value = value;

    let values = [ 1, 100, 1000, 1200 ];
    let component = mount(
      <SelectInput values={ values } onChange={ onChange }/>
    );

    component.find('option').at(2).simulate('change');
    expect(selected_value).toEqual(1000)
  });

  let monsters = [
    { key: 'hydra', value: 'hydra', text: 'Lernean Hydra' },
    { key: 'boar', value: 'boar', text: 'Erymanthian Boar' },
    { key: 'birds', value: 'birds', text: 'Stymphalian Birds' }
  ]

  it('allows setting a text label for each option value', () => {
    let component = mount(
      <SelectInput values={ monsters }/>
    );
    let p = component.find('option');
    expect(p.map(i => i.text())).toEqual(monsters.map(({text})=>text));
  });

  it('selects a label for each value', () => {
    let selected_value = null;
    let onChange = (value) => selected_value = value;


    let component = mount(
      <SelectInput values={ monsters } onChange={ onChange }/>
    );

    component.find('option').at(2).simulate('change');
    expect(selected_value).toEqual('birds')
  });
})
