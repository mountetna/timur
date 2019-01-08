import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';

class Dropdown extends Component{
  constructor(props){
    super(props);
    this.state = {
      list_open: false
    };

    this.close = this.close.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  componentDidUpdate(){
    const {list_open} = this.state;
    setTimeout(() => {
      if(list_open){
        window.addEventListener('click', this.close);
      }
      else{
        window.removeEventListener('click', this.close);
      }
    }, 0);
  }

  componentWillUnmount(){
    window.removeEventListener('click', this.close);
  }

  close(){
    this.setState({
      list_open: false
    });
  }

  selectItem (index) {
    this.setState({
      list_open: false
    }, () => this.props.onSelect(index));
  }

  toggleList(){
    this.setState(prevState => ({
      list_open: !prevState.list_open
    }));
  }

  render(){
    const {list, selected_index, default_text} = this.props;
    const {list_open} = this.state;
    let selected_item =  selected_index == null || selected_index == -1 ? null : list[selected_index];
    let header_text = selected_item || default_text;
    
    return(
      <div className='dd-container'>
        <div className='dd-header' onClick={this.toggleList}>
          <div className='dd-header-text'>{header_text}</div>
          <i className={list_open ? 'fa fa-angle-up' : 'fa fa-angle-down'}></i>
        </div>
        {list_open && 
          <ul className='dd-list'>
            {list.map((item, index)=> (
              <li className='dd-list-item' key={index} onClick={() => this.selectItem(index)}>
                  {item} {index === selected_index &&  <i className='fa fa-check'></i>}
              </li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

export default Dropdown;
