import * as React from 'react';

import AttributeViewer from '../attributes/attribute_viewer';

const ViewItem = ({attribute, mode, value, revised_value, model_name, record_name, template, record}) => (
  (attribute.hidden !== true && (mode != 'edit' || attribute.editable)) ?
    <div className='attribute_row'>
      <div className={ `attribute_name ${ (mode == 'edit' && value != revised_value) ? 'revised' : '' }` }
        title={attribute.desc}>
        {(attribute.display_name == null) ? attribute.title : attribute.display_name}
      </div>
      <div className='attribute_value'>
        <AttributeViewer
          model_name={ model_name }
          record_name={ record_name }
          template={template}
          value={value}
          mode={mode}
          attribute={ attribute }
          document={record}
          revised_value={revised_value}
        />
      </div>
    </div>
  : null
);


export default ViewItem;
