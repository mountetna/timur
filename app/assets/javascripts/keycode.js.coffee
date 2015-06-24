class @Keycode
  @codes: {
    numbers: [ 47..58 ],
    spaces: [ 13, 32 ],
    letters: [ 64..91 ],
    numpad: [ 95..112 ],
    math: [ 185..193 ]
  }
  @is_modified: (e) -> e.altKey || e.shiftKey || e.ctrlKey || e.metaKey
  @is_number: (e) => e.keyCode in @codes.numbers or e.keyCode in @codes.numpad
  @is_letter: (e) => e.keyCode in @codes.letters
  @is_space: (e) => e.keyCode in @codes.spaces
  @is_math: (e) => e.keyCode in @codes.math
  @is_printable: (e) => @is_number(e) || @is_letter(e) || @is_space(e) || @is_math(e)
