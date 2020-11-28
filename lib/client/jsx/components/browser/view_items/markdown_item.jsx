// Framework libraries.
import * as React from 'react';

import MarkdownAttribute from '../../attributes/markdown_attribute';
import AttributeViewer from '../../attributes/attribute_viewer';

const MarkdownItem = ({item, ...props}) => {
  let {attribute_name} = item;

  return <div className='item'>
    <AttributeViewer { ...props }
      component={MarkdownAttribute}
      attribute_name={attribute_name} />
  </div>;
}

export default MarkdownItem;
