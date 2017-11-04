import React, { Component } from 'react';

var BrowserPane = React.createClass({

  renderTitle: function(){
    if(this.props.pane.title){
      return(
        <div className='title' title={this.props.name}>

          {this.props.pane.title}
        </div>
      );
    }

    return null;
  },

  renderAttributes: function(){
    var props = this.props;
    var display = props.pane.display;

    display = display.filter((display_item)=>{
      return props.mode != 'edit' || display_item.editable();
    });

    display = display.map((display_item)=>{

      /*
       * The 'display' array should already be compacted. We are being a bit
       * redundant here for safety.
       */
      if(display_item == null) return null;

      var att = display_item.attribute;
      var value = props.document[att.name];

      var revised_value = props.document[att.name];
      if(att.name in props.revision) revised_value = props.revision[att.name];

      var revised = (props.mode == 'edit' && value != revised_value);
      var attr_viewer_props = {
        'mode': props.mode,
        'template': props.template,
        'document': props.document,
        'value': value,
        'revision': revised_value,
        'attribute': att
      };

      return(
        <div key={att.name} className='attribute'>

          <div className={revised ? 'name revised' : 'name'} title={att.desc}>

            {att.display_name}
          </div>
          <AttributeViewer {...attr_viewer_props} />
        </div>
      );
    });

    /*
     * The 'display' array should already be compacted. We are being a bit
     * redundant here for safety.
     */
    return display.compact();
  },

  render: function(){
    if(this.props.pane.display.length == 0){
      return <div style={{'display': 'none'}} />;
    }

    return(
      <div className='pane'>

        {this.renderTitle()}
        <div className='attributes'>

          {this.renderAttributes()}
        </div>
      </div>
    );
  }
});

module.exports = BrowserPane;
