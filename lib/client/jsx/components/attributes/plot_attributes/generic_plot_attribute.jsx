// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class GenericPlotAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      fetched_consignment: false,

      // Once the new middleware in place these won't necessary.
      fetch_attempts: 0,
      max_fetch_attempts: 10
    };
  }

  componentDidMount(){
    let {
      document,
      template,
      selected_consignment,
      selected_manifest,
      fetchConsignment
    } = this.props;

    let {
      fetch_attempts,
      max_fetch_attempts
    } = this.state;

    /*
     * If we don't have the consignment (data) we need for the plot but we do
     * have the manifest (data request), then go ahead and make the request.
     */
    if(selected_consignment == undefined){
      if(selected_manifest != undefined){
        if(!this.state.fetched_consignment){
          fetchConsignment(selected_manifest.id, document[template.identifier]);
          // fetchConsignment(selected_manifest.id, 1018);
          this.setState({fetched_consignment: true});
        }
      }
      else{

        /*
         * We need this block due to the fact that this function may run before
         * the manifests return from their async call. Once the new middleware
         * is in place we will have the event of the manifest return trigger the
         * consignment fetch.
         */
        if(fetch_attempts < max_fetch_attempts){
          setTimeout(this.componentDidMount.bind(this), 300);
          this.setState({fetch_attempts: fetch_attempts+1});
        }
      }
    }
  }

  render(){
    return(
      <div>

        {'Generic Plot Attribute'}
      </div>
    );
  }
}
