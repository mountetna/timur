import {connect} from 'react-redux';

import React, {Component} from 'react';
import * as _ from 'lodash';
import {selectTemplate} from '../selectors/magma';

class ModelAttribute extends Component {
  type() {
    let attribute = this.props.template.attributes[this.props.att_name];

    if (
      attribute.attribute_class.includes('ForeignKey') &&
      attribute.attribute_type
    )
      return _.upperFirst(attribute.attribute_type);

    return attribute.attribute_class
      .replace(/Magma::/, '')
      .replace('Attribute', '');
  }
  render() {
    let {att_name, template} = this.props;
    let attribute = template.attributes[att_name];
    return (
      <div className="map_attribute" key={att_name}>
        <span>{att_name}</span>
        <span className="type"> ({this.type()}) </span>
        {attribute.desc ? (
          <span className="description">{attribute.desc}</span>
        ) : null}
      </div>
    );
  }
}

class ModelReport extends Component {
  render() {
    let {model_name, template} = this.props;
    if (!template) return <div />;

    return (
      <div className="report">
        <span className="title">{model_name}</span>
        <span className="description">{template.description}</span>
        {Object.keys(template.attributes).map((att_name, i) =>
          template.attributes[att_name].hidden ? null : (
            <ModelAttribute key={i} att_name={att_name} template={template} />
          )
        )}
      </div>
    );
  }
}

export default connect((state, {model_name}) => ({
  template: selectTemplate(state, model_name)
}))(ModelReport);
