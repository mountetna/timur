import * as React from 'react';

import { MagmaName } from './view_items/magma_item';
import { MarkdownName } from './view_items/markdown_item';

export const DefaultName = ({item}) => <div className='item_name' title={item.description}>{ item.title || item.name }</div>;

const ItemName = (props) => {
  let { item } = props;
  switch(item.type) {
    case 'magma':
      return <MagmaName {...props}/>;
    case 'markdown':
      return <MarkdownName {...props}/>;
    default:
      return <DefaultName {...props}/>;
  }
}

export default ItemName;
