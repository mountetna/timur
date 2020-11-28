import * as React from 'react';

import ViewItem from './view_item';

const empty = () => <div style={{ display: 'none'}} />;

const ViewPane = ({ pane, ...item_props}) => {
  let { items, name, title } = pane;
  if (items.length === 0) return <empty/>;

  return <div className='pane'>
    {
      title && <div className='title' title={name}>{title}</div>
    }
    <div className='items'>
      {
        items.map(item => {
          let {name} = item;

          return <ViewItem
            key={name}
            item={item}
            {...item_props}
          />
        }).filter(_=>_)
      }
    </div>
  </div>;
}

export default ViewPane;
