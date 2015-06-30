class @Keycode
  @codes: {
    numbers: /^[0-9]$/,
    spaces: /^\s$/,
    letters: /^[A-Za-z]$/,
    printable: /^.$/,
  }
  @is_modified: (e) -> e.altKey || e.shiftKey || e.ctrlKey || e.metaKey
  @is_ctrl: (e) -> e.altKey || e.ctrlKey || e.metaKey
  @is_number: (e) => e.key.match @codes.numbers
  @is_letter: (e) => e.key.match @codes.letters
  @is_space: (e) => e.key.match @codes.spaces
  @match: (e,pat) => e.key.match(pat)
  @is_printable: (e) => e.key.match @codes.printable
