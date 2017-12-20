// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class GenericPlotAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      fetched_consignment: false
    }
    props.initialized(this.constructor.name);
  }

  shouldComponentUpdate(next_props, next_state){
    let {
      document,
      template,
      selected_consignment,
      selected_manifest,
      fetchConsignment
    } = this.props;

    // When the consignment resolves we should set it on the properties.
    selected_consignment = next_props.selected_consignment;

    /*
     * If we don't have the consignment (data) we need for the plot but we do
     * have the manifest (data request), then go ahead and make the request.
     */
    if(selected_consignment == undefined){
      if(selected_manifest != undefined){
        if(!next_state.fetched_consignment){
          fetchConsignment(selected_manifest.id, document[template.identifier]);
          next_state.fetched_consignment = true;
        }
      }
    }

    return true;
  }

  render(){
    return(
      <div>

        {'Generic Plot Attribute'}
      </div>
    );
  }
}
