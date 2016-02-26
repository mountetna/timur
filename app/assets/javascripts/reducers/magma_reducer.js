magmaReducer = function(templates, action) {
  if (!templates) templates = {}
  switch(action.type) {
    case 'ADD_TEMPLATE':
      // update if it exists
      var new_templates = {}
      new_templates[action.template_name] = $.extend({ documents: {} }, 
        templates[action.template_name],
        action.template)
      return $.extend({}, templates, new_templates)
    case 'ADD_DOCUMENTS':
      // if there is no template defined, raise
      if (!templates.hasOwnProperty(action.template_name)) throw "template does not exist"

      // overwrite old documents with new ones. Note that this will
      // NOT empty out old identifiers on renames. This should be fine
      var new_documents = $.extend(
        {},
        templates[action.template_name].documents,
        action.documents
      )

      var new_templates = {}
      new_templates[action.template_name] = $.extend(
        {},
        templates[action.template_name],
        {
          documents: new_documents
        }
      )
      return $.extend( {}, templates, new_templates )
    default:
      return templates
  }
}
