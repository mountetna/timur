import { createSelector } from 'reselect'

class Verb {
  constructor(verb_def) {
    this.args = verb_def.args;
    this.return_type = verb_def.return_type;
  }

  matches(other_args) {
    // the null match is a special case
    if (other_args.length == 0 && this.args[0] == null) return true;

    // verify our length
    if (other_args.length > this.args.length) return false;

    return other_args.every((other_arg, i) => this.matchArg(other_arg, this.args[i]))
  }

  complete(other_args) {
    // the null match is a special case
    if (other_args.length == 0 && this.args[0] == null) return true;

    // verify our length
    if (other_args.length > this.args.length) return false;

    return this.args.every((arg, i) => this.matchArg(other_args[i], arg))
  }

  choices(args, pos, special) {
    let my_arg = this.args[pos];

    if (!my_arg) return [];

    if (Array.isArray(my_arg)) return my_arg;

    if (my_arg.match(/^::/)) return my_arg;

    if (my_arg == 'Array' || my_arg == 'String') return my_arg;

    // it is some sort of special case, use the special handler
    if (typeof my_arg == 'string') return special(my_arg);

    return [];
  }

  matchArg(other_arg, my_arg) {
    if (my_arg == 'Array' && Array.isArray(other_arg)) return true;

    if (my_arg == 'String' && typeof otherarg == 'string') return true;

    if (my_arg.match(/^::/) && my_arg == other_arg) return true;

    if (Array.isArray(my_arg) && my_arg.include(other_arg)) return true;

    return false;
  }
}

export const selectVerbDefs = (state, predicate_type) => state.predicates[predicate_type];

export const selectVerbs = createSelector(
  selectVerbDefs,
  (verb_defs) => (verb_defs ? verb_defs.map(verb_def => new Verb(verb_def)) : null)
);
