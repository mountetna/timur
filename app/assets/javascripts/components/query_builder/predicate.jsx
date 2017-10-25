import { Component } from 'react';
import NumericInput from '../inputs/numeric_input';
import SlowTextInput from '../inputs/slow_text_input';
import ListInput from '../inputs/list_input';
import SelectInput from '../inputs/select_input';

export default class Predicate extends Component {
  setNewArguments(pos, new_arg) {
    let { args, verbs, update } = this.props;

    let new_args = args.slice(0,pos).concat([new_arg]);
    let completed = this.completed(verbs, new_args);
    let child = completed ? this.props.child(completed, new_args) : null;

    update({ args: new_args, completed: !!completed }, child);
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

    return Array.from(new Set(choices));
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
    let showNone = 'disabled';

    if (!choices.length) return null;

    if (choices.length == 1) return this.renderInput(choices[0], args[pos], pos);


    if (choices.some(choice => choice==null)) showNone='enabled';

    choices = choices.filter(_=>_);

    return <SelectInput defaultValue={ arg } 
      key={pos}
      showNone={ showNone }
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
