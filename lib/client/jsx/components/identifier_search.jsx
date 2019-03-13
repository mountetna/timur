// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import MagmaLink from './magma_link';
import { requestIdentifiers } from '../actions/magma_actions';
import { selectIdentifiers } from '../selectors/magma';

const IdentifierList = ({matches}) =>
  matches && <div className='drop_down'>
    {
      Object.keys(matches).map(modelName=>
        <div key={modelName}>
          <div className='title'>
            {modelName}
          </div>
          <div className='list'>
          {
            matches[modelName].map(
              identifier=>
                <div key={identifier} className='identifier'>
                  <MagmaLink link={identifier} model={modelName} />
                </div>
            )
          }
          </div>
        </div>
      )
    }
  </div>;

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

  setMatch(match_string) { this.setState({match_string}); }

  render(){
    let matches = this.findMatches();

    return(
      <div id='identifier_search'
        onBlur={ () => setTimeout(() => this.setState({has_focus: true}), 200) }
        onFocus={ () => this.setState({has_focus: true}) }>

        <div className='search'>
          <span className='fas fa-search' />
          <input
            type='text'
            value={ this.state.match_string }
            onChange={ e => this.setMatch(e.target.value) }
          />
          { matches && <i className='dismiss fa fa-times' onClick={ e => this.setMatch('') }/> }
        </div>
        <IdentifierList matches={matches}/>
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
