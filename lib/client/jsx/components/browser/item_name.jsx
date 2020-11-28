import * as React from 'react';

import { MagmaName } from './view_items/magma_item';

const DefaultName = ({item}) => <div className='item_name' title={item.description}>{ item.title || item.name }</div>;

const ItemName = (props) => {
  let { item, mode } = props;
  return item.type == 'magma' ? <MagmaName {...props}/> : <DefaultName {...props}/>;
}

export default ItemName;
