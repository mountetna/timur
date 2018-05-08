// Framework libraries.
import * as React from 'react';

/*
 * This component presents a list of items to select, possibly divided into
 * sections.
 *
 * props :
 *   name - The name of the item type on display.
 *   create() - Callback when a new item is created.
 *   select(id) - Callback when an item is selected.
 *   items - A list of { id, title, name }
 *   sections - { section_name: items, ... }
 *
 * If there is a 'sections', 'items' is ignored.
 */

export default class ListMenu extends React.Component{

  listSelection({id, title, name}, index){
      var btn_props = {
        'className': 'list-selection',
        'title': title,
        'key': 'list-'+id,
        'onClick': ()=>{
          this.props.select(id);
        }
      };

    return <button {...btn_props}>{name}</button>;
  }

  listSection(section_name, section, id){
    return (
      <div className='list-selector-panel' key={id}>

        {section_name && <div className='list-selector-header'>{section_name}</div>}
        {section.map((item, index) => this.listSelection(item, index))}
      </div>
    );
  }

  renderList(){
    let {sections, items} = this.props;
    if(sections){
      return Object.keys(sections).map((section_name, index)=>{
        return this.listSection(section_name, sections[section_name], index);
      });
    }
    else if(items){
      return this.listSection(null, items);
    }
    return null;
  }

  renderCreate(){
    let {name, create} = this.props;
    if(!create) return null;

    return (
      <button onClick={()=>create()} className='list-selector-new-btn'>

        <i className='fa fa-plus' aria-hidden='true' />
        {` NEW ${name}`}
      </button>
    );
  }

  render() {
    return (
      <div className='list-selector-group'>

        {this.renderCreate(name)}
        <div className='list-selector-panel'>

          {this.renderList()}
        </div>
      </div>
    );
  }
}
