// Framework libraries.
import * as React from 'react';

// Class imports.
import AttributeViewer from '../attributes/attribute_viewer';

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

const BrowserPane = ({record, revision, pane, ...other_props}) => {
  const attribute_names = Object.keys(pane.attributes);

  if (attribute_names.length === 0) {
    return <div style={{display: 'none'}} />;
  }

  let sorted_attribute_names = new Set();

  getAttributeNamesByType(pane.attributes, 'parent').forEach((attribute_name) =>
    sorted_attribute_names.add(attribute_name)
  );
  getAttributeNamesByType(
    pane.attributes,
    'identifier'
  ).forEach((attribute_name) => sorted_attribute_names.add(attribute_name));

  attribute_names.forEach((attribute_name) =>
    sorted_attribute_names.add(attribute_name)
  );

  console.log('rendering', record);
  return (
    <div className='pane'>
      {pane.title && (
        <div className='title' title={pane.name}>
          {pane.title}
        </div>
      )}
      <div className='attributes'>
        {Array.from(sorted_attribute_names)
          .map((attribute_name) => {
            return (
              <PaneAttribute
                key={attribute_name}
                record={record}
                value={record[attribute_name]}
                revised_value={
                  attribute_name in revision
                    ? revision[attribute_name]
                    : record[attribute_name]
                }
                attribute={pane.attributes[attribute_name]}
                {...other_props}
              />
            );
          })
          .filter((_) => _)}
      </div>
    </div>
  );
};

export default BrowserPane;
