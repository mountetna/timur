import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import onClickOutside from 'react-onclickoutside';

class Dropdown extends Component{
  constructor(props){
    super(props);
    this.state = {
      list_open: false
    };

    this.toggleList = this.toggleList.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  handleClickOutside(e){
    this.setState({
      list_open: false
    });
  }

  selectItem (index) {
    this.setState({
      list_open: false
    }, () => this.props.onSelect(index));
  }

  toggleList() {
    this.setState(prevState => ({
      list_open: !prevState.list_open
    }));
  }

  render(){
    const {list, selected_index, default_text} = this.props;
    const {list_open} = this.state;
    let header_text = selected_index != null ? list[selected_index] : default_text;
    
    return(
      <div className="dd-wrapper">
        <div className="dd-header" onClick={this.toggleList}>
          <div className="dd-header-text" >{header_text}</div>
          <i className={ list_open ? 'fa fa-angle-up' : 'fa fa-angle-down'}></i>
        </div>
        {list_open && 
          <ul className="dd-list">
            {list.map((item, index)=> (
              <li className="dd-list-item" key={index} onClick={() => this.selectItem(index)}>
                  {item} {index === selected_index && <FontAwesome name="check"/>}
              </li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

export default onClickOutside(Dropdown);
