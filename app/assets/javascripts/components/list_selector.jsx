import React, { Component } from 'react';

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

export default class ListSelector extends Component {
  listSection(section_name, section) {
    return (
      <div className='section'>
        {
          section_name && <span className='title'>{ section_name }</span> 
        }
        <ol>
          {
            section.map(item => this.listSelection(item))
          }
        </ol>
      </div>
    );
  }

  listSelection({ id, title, name}) {
    return (
      <li key={id}>
        <div className='selection'>
          <a href='#' 
            onClick={
              () => this.props.select(id) 
            }
            title={ title }>
            <span className='name'>{name}</span>
          </a>
        </div>
      </li>
    );
  }

  renderList() {
    let { sections, items } = this.props;

    if (sections) {
      return Object.keys(sections).map(section_name => this.listSection(section_name, sections[section_name]));
    } else if (items) {
      return this.listSection(null, items);
    }
    return null;
  }

  renderCreate() {
    let { name, create } = this.props;

    if (!create) return null;

    return (
      <a href='#' onClick={ () => create() } className='new'>
        <i className='fa fa-plus' aria-hidden='true' />
        New { name }
      </a>
    );
  }

  render() {
    return (
      <div className='list-selector'>
        {
          this.renderCreate(name)
        }
        <div>
          {
            this.renderList()
          }
        </div>
      </div>
    );
  }
}
