// Framework libraries.
import * as React from 'react';

//import MarkdownAttribute from './view_items/markdown_item';
import PlotItem from './view_items/plot_item';
import MagmaItem from './view_items/magma_item';
import MarkdownItem from './view_items/markdown_item';
import ImageItem from './view_items/image_item';

const Item = ({item, ...props}) => {
  let Component = {
    plot: PlotItem,
    magma: MagmaItem,
    markdown: MarkdownItem,
    image: ImageItem
  }[item.type];

  if (Component) return <Component item={item} {...props}/>;

  console.log(`No display class for item ${item.name} with type ${item.type}`);

  return null;
}

const ItemViewer = ({item, ...props}) =>
<div className='item_view'>
  <Item item={item} {...props}/>
</div>;

export default ItemViewer;
