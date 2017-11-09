import React, {Component} from 'react';
import AttributeViewer from '../attributes/attribute_viewer';

export default class SearchTableCell extends Component{

  render(){

    var props = this.props;
    var document = props.document;
    var revision = props.revision;
    var template = props.template;
    var record_name = props.record_name;
    var att_name = props.att_name;
    var value = document[att_name];

    var revised_value = document[att_name];
    if(revision && revision.hasOwnProperty(att_name)){
      revised_value = revision[att_name];
    }

    var class_set = {
      'table_data': true,
      'revised': (props.mode == 'edit' && value != revised_value),
      'focused_row': props.focusCell(record_name),
      'focused_col': props.focusCell(null, att_name)
    };

    class_set['c'+att_name] = true;

    var attr_container_props = {
      'onClick': ()=>{
        props.focusCell(record_name, att_name)
      },
      'className': Object.keys(class_set).filter(name=>class_set[name]).join(' ')
    };

    var attr_viewer = null;
    if(template.attributes[att_name].attribute_class!='Magma::TableAttribute'){

      var attr_viewer_props = {

        'mode': this.props.mode,
        'template': template,
        'document': this.props.document,
        'value': value,
        'revision': revised_value,
        'attribute': template.attributes[att_name]
      };

      attr_viewer = <AttributeViewer {...attr_viewer_props} />;
    }

    return(
      <div {...attr_container_props}>

        {attr_viewer}
      </div>
    );
  }
}
