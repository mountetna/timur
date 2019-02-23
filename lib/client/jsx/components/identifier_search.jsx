// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import MagmaLink from './magma_link';
import { requestIdentifiers } from '../actions/magma_actions';
import { selectIdentifiers } from '../selectors/magma';

class IdentifierSearch extends React.Component{
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

  findMatches(){
    let { has_focus, match_string } = this.state;
    let { identifiers } = this.props;

    if (!has_focus || !identifiers || !match_string || match_string.length < 2)
      return null;

    let match_exp = new RegExp(match_string, 'i');
    let matches = {};

    Object.keys(identifiers).forEach(model_name=>{
      identifiers[model_name].forEach(name => {
        if (name.match(match_exp)) {
          matches[model_name] = matches[model_name] || [];
          matches[model_name].push(name);
        }
      });
    });

    return Object.keys(matches).length == 0 ? null : matches;
  }

  renderIdentifiers(matches, model){
    return matches.map(identifier=>
      <div key={identifier} className='identifier'>
        <MagmaLink link={identifier} model={model} />
      </div>
    );
  }

  renderMatchingIdentifiers() {
    let matchingIdents = this.findMatches();

    if (!matchingIdents) return null;

    return(
      <div className='drop_down'>
        {
          Object.keys(matchingIdents).map(modelName=>
            <div key={modelName}>
              <div className='title'>
                {modelName}
              </div>
              <div className='list'>
                {this.renderIdentifiers(matchingIdents[modelName], modelName)}
              </div>
            </div>
          )
        }
      </div>
    );
  }

  render(){
    return(
      <div id='identifier_search'
        onBlur={ () => setTimeout(() => this.setState({has_focus: true}), 200) }
        onFocus={ () => this.setState({has_focus: true}) }>

        <div className='search'>
          <span className='fas fa-search' />
          <input
            type='text'
            value={ this.state.match_string }
            onChange={ (e) => this.setState({match_string: e.target.value}) }
          />
        </div>

        {this.renderMatchingIdentifiers()}
      </div>
    );
  }
}

export default connect(
  (state={})=>({
    identifiers: selectIdentifiers(state)
  }),
  { requestIdentifiers }
)(IdentifierSearch);
