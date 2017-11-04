import React, { Component } from 'react';

import { connect } from 'react-redux';

var TabBar = React.createClass({
  format_name: function(name){
    return name.replace(/_/, ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  renderTabs: function(){
    var view = this.props.view;
    var self = this;
    var tabs = Object.keys(view).map(function(tab_name){

      if(self.props.current_tab_name == tab_name){

        return(
          <div key={tab_name} className='selected tab'>

            {self.format_name(tab_name)}
          </div>
        );
      }
      else{

        let tab_props = {
          'key': tab_name,
          'className': self.props.revised[tab_name] ? 'revised tab' : 'tab',
          'onClick': function(e){
            self.props.clickTab(tab_name);
          }
        };

        return(
          <div {...tab_props}>

            {self.format_name(tab_name)}
          </div>
        );
      }
    });

    return tabs;
  },

  render: function(){
    var view = this.props.view;

    // Don't bother showing only one tab.
    if (Object.keys(view).length == 1) return <div style={{display:'none'}} />

    return(
      <div className='tabbar'>

        <div className='spacer1' />
        {this.renderTabs()}
        <div className='spacer2' />
      </div>
    );
  }
});

TabBar = connect(

  // Map state to props.
  function(state, props){

    var revised = {};
    var view = props.view;

    if(props.mode == 'edit' && props.revision){

      Object.keys(props.view).forEach((tab_name)=>{

        var tab = props.view[tab_name];
        if(tab){

          for(var pane_name in tab.panes){

            let bool = tab.panes[pane_name].display.some((display) => display.name in props.revision)
            if(bool){
              revised[tab_name] = true;
              break;
            }
          }
        }
      });
    }

    return {
      ...props,
      'revised': revised
    };
  }
)(TabBar);

module.exports = TabBar;
