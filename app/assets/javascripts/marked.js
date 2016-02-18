marked = require('marked');
var renderer = new marked.Renderer();

renderer.image = function( filename, title, alt ) {
  var params;
  [ alt, params ] = alt.split(/;/);
  params = (params || '').split(',').
          map(function(s) { return s.split("=") }).
          reduce(function(p, s) { return p[s[0]] = s[1], p }, {});

  var url = Routes.options.prefix+'/'+filename;

  var options = {
    title: title,
    alt: alt,
    src: url,
    width: params.width,
    height: params.height
  }
  return '<img ' + Object.keys(options).map(function(name) {
    if (options[name]) return name + '="' + options[name] + '"';
    return '';
  }).join(" ") + '/>';
};

marked.setOptions({ renderer: renderer });

