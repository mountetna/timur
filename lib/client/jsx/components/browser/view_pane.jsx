import * as React from 'react';

import ViewItem from './view_item';
import {recordMatchesRegex} from '../../utils/view_utils';

const Empty = () => <div style={{ display: 'none'}} />;

const ViewPane = ({ pane, ...item_props}) => {
  let { items, name, title, regex } = pane;
  const { record_name } = item_props;
  if (items.length === 0) return <Empty/>;

  if (!recordMatchesRegex(record_name, regex)) {
    return null;
  }

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
