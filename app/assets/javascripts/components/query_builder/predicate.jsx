import { Component } from 'react'

export default class Predicate extends Component {
  setNewArguments(new_arg, i) {
    let { position, terms, args, verbs, update } = this.props;

    let new_args = args.slice(0,i).concat(new_arg);
    let completed = this.completed(verbs, new_args);
    let child = completed ? this.props.child(completed) : null;

    this.props.update(position, { args: new_args }, child);
  }

  verbChoices(args,i) {
    let previous = args.slice(0,i);
    let verbs = this.props.verbs.filter(verb => verb.matches(previous));

    return verbs.map(verb => verb.choices(args,i,this.props.special)).flatten().sort();
  }

  completed(verbs, args) {
    return verbs && args && verbs.find(verb => verb.complete(args));
  }

  renderVerbChoices() {
    let { verbs, args } = this.props;
    if (!args) return null;

    let newChoices = this.verbChoices(args, args.length);

    return <div className="verbs">
      {
        args.map(
          (arg,i) =>
            <Selector defaultValue={ arg } 
              key={i}
              showNone='disabled' 
              values={ this.verbChoices(args,i) }
              onChange={ (new_arg) => this.setNewArguments(new_arg,i) } />
        )
      }
      {
        newChoices.length ? 
            <Selector 
              showNone='disabled' 
              values={ newChoices }
              onChange={ (new_arg) => this.setNewArguments(new_arg,args.length) }/>
          : null
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
        this.renderVerbChoices()
      }
    </div>
  }
}
