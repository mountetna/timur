// Framework libraries.
import * as React from 'react';

import AttributeViewer from '../../attributes/attribute_viewer';

const isRevised = (revision, record, att_name) =>
  att_name in revision && record[att_name] != revision[att_name];

export const MagmaName = ({item, template, mode, revision, record }) => {
  let { attribute_name, title } = item;
  let attribute = template.attributes[attribute_name];

  return <div className={ `item_name ${ (mode == 'edit' && isRevised(revision,record,attribute_name)) ? 'revised' : '' }` } title={attribute.desc}>
    {attribute.display_name || title || attribute_name}
  </div>;
}

const MagmaItem = ({item, ...props}) =>
  <div className='item'>
    <AttributeViewer { ...props } attribute_name={ item.attribute_name } />
  </div>;

export default MagmaItem;
