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
    if(this.state.match_string.length < 3) return null;

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

  renderIdentifiers(matches, model_name){

    // Render only the first 5 matches.
    let links = [];
    let limit = (matches.length >= 5) ? 5 : matches.length;
    for(let a = 0; a < limit; ++a){

      let ident_props = {
        'key': matches[a],
        'className': 'identifier'
      };

      let magma_link_props = {
        'link': matches[a],
        'model': model_name
      };

      links.push(
        <div {...ident_props}>

          <MagmaLink {...magma_link_props} />
        </div>
      );
    }

    links.push(<div className='identifier'>{'...'}</div>);
    return links;
  }

  renderMatches(matching_idents){
    let self = this;
    return Object.keys(matching_idents).map(function(model_name){
      return(

        <div key={model_name}>

          <div className='title'>

            {model_name}
          </div>
          <div className='list'>

            {self.renderIdentifiers(matching_idents[model_name], model_name)}
          </div>
        </div>
      );
    });
  }

  renderMatchingIdentifiers(){
    let matching_idents = this.find_matches();
    if(matching_idents){
      return(
        <div className='drop_down'>

          {this.renderMatches(matching_idents)}
        </div>
      );
    }

    return null;
  }

  render(){

    var self = this;
    var ident_search_props = {
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

    var input_props = {
      'type': 'text',
      'value': this.state.match_string,
      'onChange': function(e){
        self.setState({'match_string': e.target.value});
      }
    };

    return(
      <div {...ident_search_props}>

        <div className='search'>

          <span className='fa fa-search' />
          <input {...input_props} />
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
