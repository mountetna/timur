import React, { Component } from 'react';

const ATT_ATTS = [
  'attribute_type',
  'link_model_name',
  'description',
  'display_name',
  'format_hint',

  'validation',

  'restricted',
  'read_only',
  'hidden'
];

const AttributeReport = ({attribute}) =>
  !attribute ? <div className="attribute_report"/> :
  <div className="attribute_report">
    <div className="heading report_row">
      <span className="name">Attribute</span> <span className="title">{attribute.attribute_name}</span>
    </div>
    {
      ATT_ATTS.map(att => {
        switch(att) {
          case 'validation':
            if (attribute.options)
              return [ 'validation', attribute.options.join(', ') ];
            if (attribute.match)
              return [ 'validation', attribute.match ];
            if (attribute.validation)
              return [ 'validation', JSON.stringify(attribute.validation) ];
            return [ 'validation', null ];
            break;
          default:
            return [ att, attribute[att] ];
        }
      }).filter( ([name,value]) => value).map( ([name, value]) =>
        <div className="report_row" key={name}>
          <div className="type">{name}</div>
          <div className="value">{value}</div>
        </div>
      )
    }
  </div>;

export default AttributeReport;
