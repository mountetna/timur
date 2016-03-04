magmaReducer = function(templates, action) {
  if (!templates) templates = {}
  switch(action.type) {
    case 'ADD_TEMPLATE':
      // update if it exists
      var new_templates = { }
      new_templates[ action.template_name ] = {
        template: action.template,
        documents: {}
      }
      return $.extend(true, {}, templates, new_templates)
    case 'ADD_DOCUMENTS':
      // if there is no template defined, raise
      if (!templates.hasOwnProperty(action.template_name)) throw "template does not exist"

      var new_templates = {}
      new_templates[action.template_name] = {
        documents: action.documents
      }
      return $.extend( true, {}, templates, new_templates )
    default:
      return templates
  }
}
