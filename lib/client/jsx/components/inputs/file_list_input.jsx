import React, {Component} from 'react';

// This is an input to create and edit a list of files
export default class FileListInput extends Component {
  constructor() {
    super();
    this.state = {edit_link: false};
  }

  listItem = (list_item, pos) => {
    let className = 'delete_link';

    if (
      typeof list_item === 'object' &&
      list_item.hasOwnProperty('original_filename')
    ) {
      list_item = list_item.original_filename;
    }
    console.log('list_item', list_item);
    return (
      <div key={pos} className='list_item'>
        <span className={className} onClick={() => this.removeValue(pos)}>
          {list_item}
        </span>
      </div>
    );
  };

  removeValue(pos) {
    let {values, onChange} = this.props;

    let new_values = values.slice(0, pos).concat(values.slice(pos + 1));

    onChange(new_values);
  }

  addValue() {
    let {values, onChange} = this.props;

    let new_values = values.concat('');

    onChange(new_values);
  }

  editValue = (new_value) => {
    if (new_value == null || new_value == undefined || new_value == '') return;

    let {values, onChange} = this.props;

    let new_values = values ? [...values] : [];

    new_values.push(new_value);

    onChange(new_values);
  };

  addListItem = () => {
    // add a new value to the list
    this.addValue();

    // turn on editing
    this.setState({editNewValue: true});
  };

  renderEdit(ItemInput, inputProps) {
    return (
      <div className='list_item'>
        <ItemInput
          onChange={this.editValue}
          defaultValue={null}
          {...inputProps}
        />
      </div>
    );
  }

  renderAdd() {
    return (
      <div className='list_item'>
        <span className='add_item' onClick={this.addListItem}>
          +
        </span>
      </div>
    );
  }

  render() {
    let {values, itemInput, onChange, ...inputProps} = this.props;
    let {editNewValue} = this.state;
    console.log('values', values);
    return (
      <div className='list_input'>
        {values.map(this.listItem)}
        {editNewValue ? this.renderEdit(itemInput, inputProps) : null}
        {this.renderAdd()}
      </div>
    );
  }
}
