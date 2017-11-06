/*
 * I'm disabling the resize feature on the columns. This component is having an
 * issue with the 'ref' attribue (which I believe is required for resizing).
 */

import * as React from 'react';

export default class SearchTableColumnHeader extends React.Component{
  constructor(props){
    super(props);
    this['state'] = {'sizing': false};
  }

  render(){

    var class_set = {
      'table_header': true,
      'focused_col': this.props.focused
    };
    class_set['c'+this.props.column] = true;

    var column_props = {
      //'ref': 'column',
      'className': Object.keys(class_set).filter(name=>class_set[name]).join(' '),
      'onMouseDown': (event)=>{
        return;

        event.preventDefault();
        var state = {
          'sizing': true,
          'x': event.nativeEvent.offsetX,
          'width': this.refs.column.offsetWidth
        };

        this.setState(state);
      },
      'onMouseUp': ()=>{
        return;

        this.setState({sizing: false});
      },
      'onMouseMove': (event)=>{
        return;

        if (!this.state.sizing) return;
        event.preventDefault();
        var size_change = event.nativeEvent.offsetX - this.state.x;
        $('.c'+this.props.column).width(this.state.width + size_change);
      }
    };

    return(
      <div {...column_props}>

        {this.props.column}
      </div>
    );
  }
};
