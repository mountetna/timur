// Framework libraries.
import * as React from 'react';

// Class imports.
import AttributeViewer from '../attributes/attribute_viewer';

const PaneAttribute = ({attribute, mode, value, revision, model_name, record_name, template, record}) => (
  (attribute.shown != false && (mode != 'edit' || attribute.editable)) ?
    <div className='attribute'>
      <div className={ `name ${ (mode == 'edit' && value != revision) ? 'revised' : '' }` }
        title={attribute.desc}>
        {(attribute.display_name == null) ? attribute.title : attribute.display_name}
      </div>
      <AttributeViewer
        model_name={ model_name }
        record_name={ record_name }
        template={template}
        value={value}
        mode={mode}
        attribute={ attribute }
        document={record}
        revision={revision}
      />
    </div>
  : null
);

const BrowserPane = ({ record, revision, pane, ...other_props}) =>
  Object.keys(pane.attributes).length == 0
  ? <div style={{'display': 'none'}} />
  : <div className='pane'>
    {
      pane.title && <div className='title' title={pane.name}>{pane.title}</div>
    }
    <div className='attributes'>
      {
        Object.keys(pane.attributes).map(attribute_name=> {
          return <PaneAttribute
            key={attribute_name}
            record={record}
            value={ record[attribute_name] }
            revision={ (attribute_name in revision) ?  revision[attribute_name] : record[attribute_name] }
            attribute={pane.attributes[attribute_name]}
            {...other_props}
          />
        }).filter(_=>_)
      }
    </div>
  </div>;

export default BrowserPane
