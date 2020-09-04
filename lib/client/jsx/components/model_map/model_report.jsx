import { connect } from 'react-redux';
import React, { Component } from 'react';
import { selectTemplate } from '../../selectors/magma';
import { sortAttributes } from '../../utils/attributes';
import AttributeReport from './attribute_report';

const ModelAttribute = ({ attribute: { attribute_name, attribute_type, desc }, showAttribute }) => {
  return <div className="map_attribute report_row" key={ attribute_name }>
    <span className="type"> {attribute_type} </span>
    <span className="value">
    <a onClick={ () => showAttribute(attribute_name) } className="name">{attribute_name}</a>
    {
      desc && <span className="description">{ desc }</span>
    }
    </span>
  </div>
}

const ModelReport = ({ model_name, attribute_name, template, showAttribute }) =>
    (!template) ? <div/> :
    <div className="report">
      <div className="model_report">
        <div className="heading report_row">
          <span className="name">Model</span> <span className="title">{model_name}</span>
        </div>
        <div className="heading report_row">
          <span className="name">Attributes</span>
        </div>
        {
          sortAttributes(template.attributes).map( attribute =>
            attribute.hidden
              ? null
              : <ModelAttribute key={attribute.attribute_name} showAttribute={ showAttribute } attribute={attribute} />
          )
        }
      </div>
      <AttributeReport attribute={ attribute_name && template.attributes[attribute_name] }/>
    </div>;

export default connect(
  (state,{ model_name }) => ({
    template: selectTemplate(state,model_name)
  })
)(ModelReport);
