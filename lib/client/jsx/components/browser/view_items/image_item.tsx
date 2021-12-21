// Framework libraries.
import * as React from 'react';

import ImageAttribute from '../../attributes/image_attribute';
import AttributeViewer from '../../attributes/attribute_viewer';

const ImageItem = ({item, ...props}: {item: any}) => {
  let {attribute_name} = item;

  return (
    <div className='item'>
      <AttributeViewer
        {...props}
        component={ImageAttribute}
        attribute_name={attribute_name}
      />
    </div>
  );
};

export default ImageItem;
