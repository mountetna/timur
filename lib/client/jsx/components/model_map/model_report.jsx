import { connect } from 'react-redux';
import React, { Component } from 'react';
import { selectTemplate } from '../../selectors/magma';

const ModelAttribute = ({ attribute: { attribute_name, attribute_type, desc }}) => {
  return <div className="map_attribute" key={ attribute_name }>
    <span>{attribute_name}</span>
    <span className="type"> {attribute_type} </span>
    {
      desc && <span className="description">{ desc }</span>
    }
  </div>
}

const ModelReport = ({ model_name, template }) =>
    (!template) ? <div/> :
    <div className="report">
      <span className="title">{model_name}</span>
      <span className="description">{template.description}</span>
      {
        Object.values(template.attributes).map(attribute =>
          attribute.hidden ? null
          : <ModelAttribute key={attribute.attribute_name} attribute={attribute} />
        )
      }
    </div>;

export default connect(
  (state,{ model_name }) => ({
    template: selectTemplate(state,model_name)
  })
)(ModelReport);
