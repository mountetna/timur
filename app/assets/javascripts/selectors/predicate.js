import { createSelector } from 'reselect';
import Verb from '../models/verb';

export const selectVerbDefs = (state, predicate_type) => state.predicates[predicate_type];

export const selectVerbs = createSelector(
  selectVerbDefs,
  (verb_defs) => (verb_defs ? verb_defs.map(verb_def => new Verb(verb_def)) : null)
);
