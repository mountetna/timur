import { Component } from 'react'

// This component presents a list of items to select,
// possibly divided into sections.
//
// props :
//  name - the name of the item type on display
//  create() - callback when a new item is created
//  select(id) - callback when an item is selected
//  items - a list of { id, title, name }
//  sections - { section_name: items, ... }
//
//  if there is a 'sections', 'items' is ignored.

export default class ListSelector extends Component {
  listSection(section_name, section) {
    return <div className="section">
      <span className="title">{ section_name }</span>
      <ol>
        {
          section.map(item => this.listSelection(item))
        }
      </ol>
    </div>
  }

  listSelection({ id, title, name}) {
    return <li key={id}>
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
  }

  renderList() {
    let { sections, items } = this.props

    if (sections)
      return Object.keys(sections).map(section_name => this.listSection(section_name, sections[section_name]))
    else if (items)
      return items.map(item => this.listSelection(item))
    return null
  }

  render() {
    let { name, create } = this.props
    return (
      <div className='list-selector'>
        {
          create &&
            <a href='#' 
              onClick={ () => create() }
              className="new">
            <i className="fa fa-plus" aria-hidden="true"></i>
            New { name }
          </a>
        }
        <div>
          {
            this.renderList()
          }
        </div>
      </div>
    )
  }
}
