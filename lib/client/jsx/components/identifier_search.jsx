// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import MagmaLink from './magma_link';
import * as MagmaActions from '../actions/magma_actions';

export class IdentifierSearch extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      match_string: '',
      has_focus: false 
    };
  }

  componentWillMount(){
    this.props.requestIdentifiers();
  }

  find_matches(){
    var self = this;
    if(!this.state.has_focus) return null;
    if(!this.props.identifiers) return null;
    if(!this.state.match_string) return null;
    if(this.state.match_string.length < 2) return null;

    var match_exp = new RegExp(this.state.match_string, 'i');
    var matches = null;

    Object.keys(this.props.identifiers).forEach(function(model_name){

      var identifiers = self.props.identifiers[model_name];
      identifiers.forEach(function(name){

        if(name.match(match_exp)){
          matches = matches || {};
          matches[model_name] = (matches[model_name] || []).concat(name);
        }
      });
    });

    return matches;
  }

  renderIdentifiers(matches, modelName){

    return matches.map(function(identifier){

      var identProps = {

        'key': identifier,
        'className': 'identifier'
      };

      var magmaLinkProps = {

        'link': identifier,
        'model': modelName
      };

      return(
        <div {...identProps}>

          <MagmaLink {...magmaLinkProps} />
        </div>
      );
    });
  }

  renderMatches(matchingIdents){

    var self = this;
    return Object.keys(matchingIdents).map(function(modelName){

      var matches = matchingIdents[modelName];
      return(

        <div key={modelName}>

          <div className='title'>

            {modelName}
          </div>
          <div className='list'>

            {self.renderIdentifiers(matches, modelName)}
          </div>
        </div>
      );
    });
  }

  renderMatchingIdentifiers(){

    var matchingIdents = this.find_matches();
    if(matchingIdents){

      return(
        <div className='drop_down'>

          {this.renderMatches(matchingIdents)}
        </div>
      );
    }
    else{

      return null;
    }
  }

  render(){

    var self = this;

    var identSearchProps = {

      'id': 'identifier_search',
      'onBlur': function(e){
        setTimeout(function(){
          self.setState({'has_focus': false});
        }, 200);
      },
      'onFocus': function(e){
        self.setState({'has_focus': true});
      }
    };

    var inputProps = {

      'type': 'text',
      'value': this.state.match_string,
      'onChange': function(e){
        self.setState({'match_string': e.target.value});
      }
    };

    return(
      <div {...identSearchProps}>

        <div className='search'>

          <span className='fa fa-search' />
          <input {...inputProps} />
        </div>
        {this.renderMatchingIdentifiers()}
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  let idents = {};
  let models = state.magma.models;

  Object.keys(models).forEach(function(model_name){
    idents[model_name] = Object.keys(models[model_name].documents);
  });

  var data = {
    'identifiers': Object.keys(idents).length ? idents : null
  };

  return data;
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestIdentifiers: ()=>{
      dispatch(MagmaActions.requestIdentifiers());
    }
  };
};

export const IdentifierSearchContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(IdentifierSearch);
