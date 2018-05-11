// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import * as MagmaSelector from '../../selectors/magma_selector';

import Predicate from './predicate';
import SlowTextInput from '../inputs/slow_text_input';
import {FloatInput} from '../inputs/numeric_input';
import {selectVerbs} from '../../selectors/predicate';

// A Value predicate, mostly sets the terminal type.
export class ValuePredicate extends React.Component{

  getChildren(verb, new_args){
    let {return_type, args} = verb;
    if (return_type) return [{type: 'terminal', return_type}];
    return [];
  }

  getItemInput(type){
    if (type == 'number') return FloatInput;
    return SlowTextInput;
  }

  render(){
    // The model predicate has three terms: 'model', 'filters', and 'action'.
    let {attribute_name, update, type, terms, verbs} = this.props;
    let {args} = terms;
    let special = ()=>[];
    let getChildren = this.getChildren.bind(this);
    let itemInput = this.getItemInput(type);

    let pred_props = {
      terms,
      update,
      itemInput,
      verbs,
      special,
      args,
      getChildren
    };

    return <Predicate {...pred_props} />;
  }
}

const mapStateToProps = (state, own_props)=>{

  let project_name = TIMUR_CONFIG.project_name;
  let model_name = `${project_name}_${own_props.attribute.model_name}`;

  let verbs = selectVerbs(state, own_props.type);
  let attributes = MagmaSelector.selectModelTemplate(state, model_name);
  let attribute = attributes[own_props.attribute_name];

  return {
    verbs,
    attribute
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {};
};

export const ValuePredicateContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ValuePredicate);
