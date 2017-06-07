import marked from 'marked'

var renderer = new marked.Renderer()

renderer.image = function( filename, title, opts ) {
  let [ alt, params ] = opts.split(/;/)
  params = (params || '').split(',').
          map(s => s.split("=")).
          reduce((p, s) => { return p[s[0]] = s[1], p }, {})

  let src = Routes.options.prefix+'/'+filename

  let options = {
    title,
    alt,
    src,
    width: params.width,
    height: params.height
  }
  return '<img ' + Object.keys(options).map((name) => options[name] ? `${name}="${options[name]}"` : '').join(" ") + '/>'
}

marked.setOptions({ renderer: renderer })

export default marked
