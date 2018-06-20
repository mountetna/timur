const codes =  {
  numbers: /^[0-9]$/,
  number_spacer: /^_$/,
  notation: /^[\.e\-]$/,
  spaces: /^\s$/,
  letters: /^[A-Za-z]$/,
  printable: /^.$/,
};

const Modified = (e) => e.altKey || e.shiftKey || e.ctrlKey || e.metaKey;
const Ctrl = (e) => e.altKey || e.ctrlKey || e.metaKey;
const Number = (e) => e.key.match(codes.numbers);
const Letter = (e) => e.key.match(codes.letters);
const Space = (e) => e.key.match(codes.spaces);
const Printable = (e) => e.key.match(codes.printable);

const matchKey = (e,pat) => e.key.match(pat);
const isKey = (e,...properties)  => properties.some(prop=>prop(e))

export const floatFilter = (e) => {
  let allowed = isKey(e,Ctrl,Number) || matchKey(e,codes.notation);

  if (!allowed && isKey(e,Printable)) e.preventDefault();

  return true;
}

export const intFilter = (e) => {
  let allowed = isKey(e,Ctrl,Number) || matchKey(e,codes.number_spacer);
  
  if (!allowed && isKey(e,Printable)) e.preventDefault();

  return true;
}

export const maskFilter = (mask) => (e) => {
  let current = e.target.value;
  if (!isKey(e,Printable)) return true;

  let changed = current + e.key;

  if (changed.match(mask)) return true;

  e.preventDefault();

  return true;
}
