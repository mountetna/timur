import { connect } from 'react-redux';
import React, { Component } from 'react';
import { selectTemplate } from '../../selectors/magma';
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

const order = ({attribute_type}) => ({
  parent: 1,
  identifier: 2
}[attribute_type] || 3)

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
          Object.values(template.attributes).sort((a,b) => order(a)-order(b)).map( attribute =>
            attribute.hidden
              ? null
              : <ModelAttribute key={attribute.attribute_name} showAttribute={ showAttribute } attribute={attribute} />
          )
        }
      </div>
      {
        attribute_name && <AttributeReport attribute={ template.attributes[attribute_name] }/>
      }
    </div>;

export default connect(
  (state,{ model_name }) => ({
    template: selectTemplate(state,model_name)
  })
)(ModelReport);
