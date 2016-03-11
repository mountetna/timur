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
        patched_template: action.patched_template,
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
            {},
            templates[action.template_name].documents, 
            action.documents),
          patched_documents: $.extend(
            {},
            templates[action.template_name].patched_documents, 
            action.patched_documents)
        }
      )
      return $.extend( {}, templates, new_templates )
    case 'REVISE_DOCUMENT':
      var new_revisions = {}
      // first, update the old revision with the new revisions
      new_revisions[action.document_name] = $.extend(
        {},
        templates[action.template_name].revisions[action.document_name],
        action.revision
      )
      // then, update the old revision store with the new revision store
      var new_templates = {}
      new_templates[action.template_name] = $.extend(
        {},
        templates[action.template_name],
        {
          revisions: $.extend({}, templates[action.template_name].revisions, new_revisions)
        }
      )
      // finally,  update the templates with the new templates
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
