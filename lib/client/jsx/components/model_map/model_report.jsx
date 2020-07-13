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
  identifier: 2,
  collection: 3,
  table: 4,
  child: 5,
  link: 6,
  file: 7,
  image: 8
}[attribute_type] || 9)

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
          Object.values(template.attributes).sort(
            (a,b) => (order(a)-order(b)) || a.attribute_name.localeCompare(b.attribute_name)
          ).map( attribute =>
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
