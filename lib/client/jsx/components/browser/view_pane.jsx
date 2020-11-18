import * as React from 'react';

import ViewItem from './view_item';

const ViewPane = ({ record, revision, pane, ...other_props}) => {
  if (Object.keys(pane.attributes).length === 0)
    return <div style={{ display: 'none'}} />;


  // We get an `index_order` from the server for defined views.
  // We should verify that order is enforced, and not assume
  //   that the pane.attributes are in the right order.
  const orderedViewAttributes = Object.values(pane.attributes)
    .sort((a, b) => a.index_order - b.index_order);

  return <div className='pane'>
    {
      pane.title && <div className='title' title={pane.name}>{pane.title}</div>
    }
    <div className='attributes'>
      {
        orderedViewAttributes.map(attribute => {
          let {attribute_name} = attribute;

          return <ViewItem
            key={attribute_name}
            record={record}
            value={ record[attribute_name] }
            revised_value={ (attribute_name in revision) ?  revision[attribute_name] : record[attribute_name] }
            attribute={attribute}
            {...other_props}
          />
        }).filter(_=>_)
      }
    </div>
  </div>;
}

export default ViewPane;
