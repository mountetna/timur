import React, { Component } from 'react';
import NumericInput from './numeric_input';
import SlowTextInput from '../inputs/slow_text_input';

// This is an input to create and edit a list of items
export default class ListInput extends Component {
  constructor() {
    super();
    this.state = { edit_link: false };
  }

  listItem(list_item, pos) {
    let className = 'delete_link';

    // Clone list_item, but could be simple Object or string
    let display_item = JSON.parse(JSON.stringify(list_item));
      
    if (display_item == null || display_item == '') {
      display_item = 'null';
      className = 'delete_link empty';
    } else if (typeof display_item === 'object' &&
        display_item.hasOwnProperty('original_filename')) {
        display_item = display_item.original_filename;
    }

    return(
      <div key={ pos } className='list_item'>
        <span className={ className } onClick={ () => this.removeValue(pos) } >
          { display_item  }
        </span>
      </div>
    );
  }

  removeValue(pos) {
    let { values, onChange } = this.props;

    let new_values = values
      .slice(0,pos)
      .concat(values.slice(pos+1));

    onChange(new_values);
  }

  addValue() {
    let { values, onChange } = this.props;

    let new_values = values.concat('');

    onChange(new_values);
  }

  editValue(new_value) {
    if (new_value == null || new_value == undefined || new_value == '') return;

    let { values, onChange } = this.props;

    let new_values = values.slice();
      
    new_values.splice(values.length-1,1,new_value);

    onChange(new_values);
  }

  addListItem() {
    // add a new value to the list
    this.addValue();

    // turn on editing
    this.setState({ editNewValue: true });
  }

  renderEdit(value, ItemInput, inputProps) {
    let blur = () => this.setState({ editNewValue: false });

    return(
      <div className='list_item'>
        <ItemInput 
          onChange={ this.editValue.bind(this) }
          onBlur={ blur }
          defaultValue={ value }
          { ...inputProps }
        />
      </div>
    );
  }

  renderAdd() {
    return(
      <div className='list_item'>
        <span className='add_item' onClick={ this.addListItem.bind(this) }>+</span>
      </div>
    );
  }

  render() {
    let { values, itemInput, onChange, ...inputProps } = this.props;
    let { editNewValue } = this.state;
    let new_value;

    if (editNewValue) {
      new_value = values.slice(-1);
      values = values.slice(0,-1);
    }

    return(
      <div className='list_input'>

        {values.map(this.listItem.bind(this))}
        {editNewValue ? this.renderEdit(new_value, itemInput, inputProps): null}
        {this.renderAdd()}
      </div>
    );
  }
}
