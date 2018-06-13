// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {selectModelTemplate} from '../../selectors/magma_selector';

class ModelAttribute extends React.Component{
  type() {
    let attribute = this.props.template.attributes[this.props.att_name]

    if (attribute.type) return attribute.type

    return attribute.attribute_class.replace(/Magma::/,'').replace('Attribute','')
  }
  render() {
    let { att_name, template } = this.props
    let attribute = template.attributes[att_name]
    return <div className="attribute" key={ att_name }>
      <span>{att_name}</span>
      <span className="type">({this.type()})</span>
      { attribute.desc ?
      <span className="description">{ attribute.desc }</span>
          : null
      }
    </div>
  }
}

class ModelReport extends React.Component{
  render() {
    let { model_name, template } = this.props
    if (!template) return <div/>
    return <div className="report">
      <span className="title">{model_name}</span>
      <span className="description">{template.description}</span>
      {
        Object.keys(template.attributes).map((att_name,i) =>
          template.attributes[att_name].shown ? 
          <ModelAttribute key={i} att_name={att_name} template={template}/>
          : null
        )
      }
    </div>
  }
}

const mapStateToProps = (state, own_props)=>{
  return {
    template: selectModelTemplate(state, own_props.model_name)
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {};
};

export const ModelReportContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelReport);
