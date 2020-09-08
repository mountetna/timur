// Framework libraries.
import * as React from 'react';

// Class imports.
import AttributeViewer from '../attributes/attribute_viewer';

const PaneAttribute = ({attribute, mode, value, revised_value, model_name, record_name, template, record}) => (
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

const BrowserPane = ({ record, revision, pane, ...other_props}) => {
  if (Object.keys(pane.attributes).length === 0) {
    return <div style={{'display': 'none'}} />
  }

  // We get an `index_order` from the server for defined views.
  // We should verify that order is enforced, and not assume
  //   that the pane.attributes are in the right order.
  const orderedViewAttributes = Object.values(pane.attributes)
    .sort((a, b) => a.index_order - b.index_order);

  console.log('rendering',  record);
  return <div className='pane'>
    {
      pane.title && <div className='title' title={pane.name}>{pane.title}</div>
    }
    <div className='attributes'>
      {
        orderedViewAttributes.map(attribute => {
          let {attribute_name} = attribute;

          return <PaneAttribute
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

export default BrowserPane
