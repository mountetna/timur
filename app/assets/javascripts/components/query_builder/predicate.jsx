import { Component } from 'react';
import NumericInput from '../numeric_input';
import ListInput from '../list_input';

export default class Predicate extends Component {
  setNewArguments(pos, new_arg) {
    let { args, verbs, update } = this.props;

    let new_args = args.slice(0,pos).concat([new_arg]);
    let completed = this.completed(verbs, new_args);
    let child = completed ? this.props.child(completed, new_args) : null;

    update({ args: new_args }, child);
  }

  completed(verbs, args) {
    return verbs && args && verbs.find(verb => verb.complete(args, this.props.special));
  }

  verbChoices(pos) {
    let { args, special, verbs } = this.props;
    let previous = args.slice(0,pos);
    let choices = verbs.filter(
      verb => verb.matches(previous, special)
    ).map(
      verb => verb.choices(pos, special)
    ).flatten().sort();

    return choices;
  }

  renderInput(type, arg, pos) {
    switch(type) {
      case 'Numeric':
        return <NumericInput 
          update={ this.setNewArguments.bind(this, pos) }
          inputType='float'
          defaultValue={ arg }
          placeholder='Number' />;
      case 'String':
        return <SlowTextInput 
          placeholder={ 'String' }
          defaultValue={ arg }
          update={ this.setNewArguments.bind(this, pos) } />;
      case 'Array':
        return <ListInput
          values={ arg || [''] } 
          placeholder='Value'
          inputType={ this.props.inputType }
          onChange={ this.setNewArguments.bind(this, pos) } />;
      default:
        return type;
    }
  }

  verbInput(arg,pos) {
    let { args } = this.props;
    let choices = this.verbChoices(pos);

    if (!choices.length) return null;

    if (choices.length == 1) return this.renderInput(choices[0], args[pos], pos);

    return <Selector defaultValue={ arg } 
      key={pos}
      showNone='disabled' 
      values={ choices }
      onChange={ this.setNewArguments.bind(this,pos) } />
  }

  renderVerbInputs() {
    let { verbs, args } = this.props;

    if (!args) return null;

    return <div className='verbs'>
      {
        args.map(this.verbInput.bind(this))
      }
      {
        this.verbInput(null, args.length)
      }
    </div>
  }

  render() {
    let { children, verbs, args } = this.props;
    let completed = this.completed(verbs, args);
    let classNames = [
      'predicate',
      completed && 'completed'
    ].filter(_=>_).join(' ')

    return <div className={ classNames }>
      {
        children
      }
      {
        this.renderVerbInputs()
      }
    </div>
  }
}
