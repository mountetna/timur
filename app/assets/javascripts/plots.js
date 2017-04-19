//= require_tree ./plots

createScale = function(domain, range) {
  var scale
  if (typeof domain[0] !== 'number') {
    return d3.time.scale().range(range).domain(domain.map(date => new Date(date)))
  }
  else
    scale = d3.scale.linear()

  return scale.range(range).domain(domain)
}

autoColors = function(number) {
  colors = [
    "DodgerBlue", 
    "SaddleBrown",
    "ForestGreen",
    "GoldenRod", 
    "RoyalBlue",
    "SeaGreen",
    "Crimson", 
    "Khaki", 
    "Coral", 
    "Gold",
    "Teal",
    "IndianRed",
    "PaleTurquoise", "Linen", "Navy", 
    "RebeccaPurple",
    "LightGreen", "AntiqueWhite", "PaleGoldenRod", "PaleGreen",
    "SpringGreen", "DarkRed", "DarkSlateBlue", "DarkOrchid",
    "DarkSalmon", "LightCyan", "DarkSlateGrey", "Sienna", "Beige",
    "DarkGrey", "LightYellow", "DarkSlateGray", "Indigo", "Ivory",
    "Red", "LightCoral", "MediumSpringGreen", "PowderBlue", "LawnGreen",
    "White", "LavenderBlush", "LightSeaGreen", "DarkCyan", "OliveDrab",
    "Purple", "Cyan", "LightSteelBlue", 
    "SteelBlue", "MediumTurquoise", "DarkBlue", "Silver", "DimGray",
    "DarkTurquoise", "BurlyWood", "Peru", "MediumAquaMarine",
    "Azure",
    "Olive", 
    "Aqua", "Bisque",
    "MediumBlue", "WhiteSmoke", "DeepPink", "LightSlateGrey", 
    "Magenta", "LightPink", "MintCream", "MediumVioletRed",
    "LemonChiffon", "CornflowerBlue", "SkyBlue", "SandyBrown",
    "DarkGreen", "Aquamarine", "GhostWhite", "LightBlue",
    "LightGoldenRodYellow", 
    "OrangeRed", "NavajoWhite",
    "SlateGray", "SlateBlue", "PapayaWhip", "Green",
    "MediumOrchid", "SlateGrey", "MidnightBlue", "Tomato", 
    "YellowGreen", "CadetBlue", "Turquoise", "Chocolate", "LightGray",
    "MediumSlateBlue", "DarkViolet", "PaleVioletRed", "Tan", "DarkGray",
    "Black", "SeaShell", "GreenYellow", "Fuchsia", 
    "LightSalmon", "Lime", "DarkKhaki", "Salmon", "Yellow", "Blue",
    "Snow", "DarkSeaGreen", "Violet", "BlueViolet", "LightSkyBlue",
    "Wheat", "Lavender", "OldLace", "Maroon", "BlanchedAlmond",
    "DarkMagenta", "Moccasin", "Brown", "PeachPuff", "Pink",
    "DarkGoldenRod", "Cornsilk", "DimGrey", "Chartreuse",
    "MediumSeaGreen", "Orchid", "FloralWhite", "DarkOrange",
    "Plum", "AliceBlue", "LightGrey", "RosyBrown", "LightSlateGray",
    "Orange", "Gainsboro", 
    "HoneyDew", "Thistle", "MistyRose",
    "HotPink", "Gray", "MediumPurple", 
    "FireBrick",
    "LimeGreen", "Grey", "DarkOliveGreen", "DeepSkyBlue",
  ]

  return colors.slice(0,number)
}
