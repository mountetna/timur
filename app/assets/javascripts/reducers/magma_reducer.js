/*
 *  templates: {
 *    
 *    template_name1: {
 *      // this is a json document describing a Magma model
 *      template: {
 *      },
 *      documents: {
 *        // this is a json document describing a Magma record
 *        document_name1: {
 *          attribute1: value1
 *        }
 *      }
 *    },
 *    template_name2: {
 *      etc.
 *    }
 *  }
 */

magmaReducer = function(templates, action) {
  if (!templates) templates = {}
  switch(action.type) {
    case 'ADD_TEMPLATE':
      // update if it exists
      var new_templates = { }
      new_templates[ action.template_name ] = {
        template: action.template,
        documents: {},
        revisions: {}
      }
      return $.extend({}, templates, new_templates)
    case 'ADD_DOCUMENTS':
      // if there is no template defined, raise
      if (!templates.hasOwnProperty(action.template_name)) throw "template does not exist"

      var new_templates = {}
      new_templates[action.template_name] = $.extend(
        templates[action.template_name],
        {
          documents: $.extend(
            templates[action.template_name].documents, 
            action.documents)
        }
      )
      return $.extend( {}, templates, new_templates )
    case 'REVISE_DOCUMENT':
      var new_revisions = {}
      new_revisions[action.document_name] = action.revision
      var new_templates = {}
      new_templates[action.template_name] = $.extend(
        {},
        templates[action.template_name],
        {
          revisions: $.extend({}, templates[action.template_name].revisions, new_revisions)
        }
      )
      return $.extend( {}, templates, new_templates )
    case 'DISCARD_REVISION':
      var new_revisions = {}
      new_revisions[action.document_name] = null
      var new_templates = {}
      new_templates[action.template_name] = $.extend(
        {},
        templates[action.template_name],
        {
          revisions: $.extend({}, templates[action.template_name].revisions, new_revisions)
        }
      )
      return $.extend( {}, templates, new_templates )
    default:
      return templates
  }
}
