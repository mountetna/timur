import React, { Component } from 'react';
import { FloatInput } from '../inputs/numeric_input';
import SlowTextInput from '../inputs/slow_text_input';
import DateTimeInput from '../inputs/date_time_input';
import ListInput from '../inputs/list_input';
import SelectInput from '../inputs/select_input';

// This is the base Predicate class which renders a predicate, used by
// specific-predicate types. Mostly this is responsible for figuring out
// what input components (selectors, lists, etc.) to draw for the given verb
// and argument sets
export default class Predicate extends Component {
  setInputArgument(pos, new_arg) {
    switch(new_arg) {
      case 'String':
      case 'Numeric':
      case 'DateTime':
        this.setNewArguments(pos,'');
        break;
        break;
      case 'Array':
        this.setNewArguments(pos,[]);
        break;
      default:
        this.setNewArguments(pos,new_arg);
        break;
    }
  }

  setNewArguments(pos, new_arg) {
    let { args, verbs, update, getChildren } = this.props;

    let new_args = args.slice(0,pos).concat([new_arg]);
    let completed = this.completed(verbs, new_args);
    let children = completed ? getChildren(completed, new_args) : [];

    update({ args: new_args, completed: !!completed }, ...children);
  }

  completed(verbs, args) {
    return verbs && args && verbs.find(verb => verb.complete(args, this.props.special));
  }

  verbChoices(pos, args) {
    let { special, verbs } = this.props;
    let choices = verbs.filter(
      verb => verb.matches(args, special)
    ).reduce(
      (values,verb) => values.concat(verb.choices(pos, special)),
      []
    ).sort();

    return Array.from(new Set(choices));
  }

  renderInput(type, arg, pos) {
    let { itemInput, vector } = this.props;
    switch(type) {
      case 'DateTime':
        return <DateTimeInput
          onChange={ (newDate) => this.setNewArguments(pos, newDate && newDate.toISOString()) }
          defaultValue={ arg }
          placeholder='Number' />;
      case 'Numeric':
        return <FloatInput 
          onChange={ this.setNewArguments.bind(this, pos) }
          defaultValue={ arg }
          placeholder='Number' />;
      case 'String':
        return <SlowTextInput 
          placeholder={ 'String' }
          defaultValue={ arg }
          onChange={ this.setNewArguments.bind(this, pos) } />;
      case 'Array':
        if (vector) return vector(arg);
        return <ListInput
          values={ arg || [] } 
          placeholder='Value'
          itemInput={ itemInput }
          onChange={ this.setNewArguments.bind(this, pos) } />;
      default:
        return type;
    }
  }

  verbInput(arg,pos) {
    let { args } = this.props;
    let previous = args.slice(0,pos);
    let choices = this.verbChoices(pos, previous);
    let matches = this.verbChoices(pos, args);
    let showNone = 'disabled';

    if (arg != null && matches.length == 1 && ['Numeric', 'String', 'Array'].includes(matches[0])) return this.renderInput(matches[0], args[pos], pos);

    if (!choices.length) return null;

    if (choices.length == 1) return this.renderInput(choices[0], args[pos], pos);

    if (choices.some(choice => choice==null)) showNone='enabled';

    choices = choices.filter(_=>_);

    let input_props = {
      defaultValue: arg,
      key: pos,
      showNone: showNone,
      values: choices,
      onChange: this.setInputArgument.bind(this, pos)
    };
    return <SelectInput {...input_props} />;
  }

  renderVerbInputs() {
    let { verbs, args } = this.props;
    if (!args) return null;

    return(
      <div className='verbs'>

        {args.map(this.verbInput.bind(this))}
        {this.verbInput(null, args.length)}
      </div>
    );
  }

  render() {
    let { children, verbs, args } = this.props;
    let completed = this.completed(verbs, args);
    let classNames = [
      'predicate',
      completed && 'completed'
    ].filter(_=>_).join(' ');

    return(
      <div className={ classNames }>

        {children}
        {this.renderVerbInputs()}
      </div>
    );
  }
}
