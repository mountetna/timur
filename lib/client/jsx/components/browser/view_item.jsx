import * as React from 'react';

import ItemViewer from './item_viewer';
import ItemName from './item_name';

import { hasMagmaAttribute } from '../../selectors/tab_selector';

const ViewItem = ({item, mode, ...props}) => (
  (item.hidden !== true && (mode != 'edit' || hasMagmaAttribute(item))) ?
    <div className='view_item'>
      <ItemName item={item} mode={mode} {...props} />
      <ItemViewer item={item} mode={mode} {...props} />
    </div>
  : null
);


export default ViewItem;
