// Framework libraries.
import * as React from 'react';

// Class imports.
import AttributeViewer from '../attributes/attribute_viewer';

import {sortAttributes} from '../../utils/attributes';

const PaneAttribute = ({
  attribute,
  mode,
  value,
  revised_value,
  model_name,
  record_name,
  template,
  record
}) =>
  attribute.hidden !== true && (mode != 'edit' || attribute.editable) ? (
    <div className='attribute_row'>
      <div
        className={`attribute_name ${
          mode == 'edit' && value != revised_value ? 'revised' : ''
        }`}
        title={attribute.desc}
      >
        {attribute.display_name == null
          ? attribute.title
          : attribute.display_name}
      </div>
      <div className='attribute_value'>
        <AttributeViewer
          model_name={model_name}
          record_name={record_name}
          template={template}
          value={value}
          mode={mode}
          attribute={attribute}
          document={record}
          revised_value={revised_value}
        />
      </div>
    </div>
  ) : null;

const getAttributeNamesByType = (attributes, type) => {
  return Object.keys(attributes).filter((attribute_name) => {
    return attributes[attribute_name].attribute_type === type;
  });
};

const BrowserPane = ({record, revision, pane, ...other_props}) =>
  Object.keys(pane.attributes).length === 0 ? (
    <div style={{display: 'none'}} />
  ) : (
    console.log('rendering', record) || (
      <div className='pane'>
        {pane.title && (
          <div className='title' title={pane.name}>
            {pane.title}
          </div>
        )}
        <div className='attributes'>
          {sortAttributes(pane.attributes)
            .map((attribute) => {
              return (
                <PaneAttribute
                  key={attribute.name}
                  record={record}
                  value={record[attribute.name]}
                  revised_value={
                    attribute.name in revision
                      ? revision[attribute.name]
                      : record[attribute.name]
                  }
                  attribute={pane.attributes[attribute.name]}
                  {...other_props}
                />
              );
            })
            .filter((_) => _)}
        </div>
      </div>
    )
  );

export default BrowserPane;
