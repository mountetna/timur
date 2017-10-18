import { createSelector } from 'reselect'

class Verb {
  constructor(verb_def) {
    this.args = verb_def.args;
    this.return_type = verb_def.return_type;
  }

  matches(other_args, special) {
    // the null match is a special case
    if (other_args.length == 0 && this.args[0] == null) return true;

    // verify our length
    if (other_args.length > this.args.length) return false;

    return other_args.every((other_arg, i) => this.matchArg(other_arg, this.args[i], special))
  }

  complete(other_args, special) {
    return (
      (this.args[0] == null && other_args.length == 0)
      ||
      (this.args.length == other_args.length)
      && this.matches(other_args, special)
    );
  }

  choices(pos, special) {
    let my_arg = this.args[pos];

    if (!my_arg) return [];

    if (Array.isArray(my_arg)) return my_arg;

    if (my_arg.match(/^::/)) return my_arg;

    if (my_arg == 'Array' || my_arg == 'String' || my_arg == 'Numeric') return my_arg;

    // it is some sort of special case, use the special handler
    if (typeof my_arg == 'string') return special(my_arg);

    return [];
  }

  matchArg(other_arg, my_arg, special) {
    if (!my_arg) return other_arg == undefined;

    if (my_arg == 'Array') return Array.isArray(other_arg);

    if (my_arg == 'String') return typeof other_arg == 'string';

    if (my_arg == 'Numeric') return typeof other_arg == 'number';

    if (Array.isArray(my_arg)) return my_arg.includes(other_arg);

    if (my_arg.match(/^::/)) return my_arg == other_arg;

    if (typeof my_arg == 'string') return special(my_arg).includes(other_arg);

    return false;
  }
}

export const selectVerbDefs = (state, predicate_type) => state.predicates[predicate_type];

export const selectVerbs = createSelector(
  selectVerbDefs,
  (verb_defs) => (verb_defs ? verb_defs.map(verb_def => new Verb(verb_def)) : null)
);
