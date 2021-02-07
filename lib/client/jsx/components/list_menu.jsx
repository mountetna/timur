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

const ListSelection = ({documentId, documentTitle, documentName, item, select}) => 
  <div className='list-selection'
    title={ item[documentTitle || 'title'] }
    onClick={ ()=> select(item[documentId || 'id']) }>{item[documentName || 'name']}</div>;

const ListSection = ({section_name, items, ...props}) => 
  <div className='list-selector-section'>
    {section_name && <div className='list-selector-header'>{section_name}</div>}
    {
      items.map((item, index) => <ListSelection
        key={ index }
        item={item}
        {...props} />)
    }
  </div>;

const ListMenu = ({name, create, sections, items, ...itemProps}) =>
  <div className='list-selector-group'>
    {
      create && <button onClick={()=>create()} className='list-selector-new-btn'>
        <i className='fas fa-plus' aria-hidden='true' />
        {`new ${name}`}
      </button>
    }
    <div className='list-selector-panel'>
      {
        sections ? Object.keys(sections).map(
          section_name=> <ListSection
            key={section_name}
            section_name={section_name}
            items={sections[section_name]}
            {...itemProps}
          />
        ) : items ? <ListSection items={items} {...itemProps} /> : null
      }
    </div>
  </div>;

export default ListMenu;
