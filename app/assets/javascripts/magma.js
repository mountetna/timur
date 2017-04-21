class documentFilter {
  constructor(template, documents, filter) {
    this.documents = documents
    this.template = template
    this.terms = filter.split(/\s+/).filter((term) => term.length)
    this.filter_attribute_names = Object.keys(template.attributes).filter(
      (att_name) => template.attributes[att_name].shown
    )
  }

  format(document, att_name) {
    var value = document[att_name]
    if (value == undefined) return ""

    var att_class = this.template.attributes[att_name].attribute_class
    var att_type = this.template.attributes[att_name].type

    switch(att_class) {
      case "Magma::DocumentAttribute":
      case "Magma::ImageAttribute":
        return value.url
      case "Magma::CollectionAttribute":
        return value.join(",")
      case "Magma::TableAttribute":
        return "";
      case "Magma::LinkAttribute":
        return value || "";
      case "Magma::Attribute":
        switch(att_type) {
          case "DateTime":
            return dates.format_date(value) + '@' + dates.format_time(value)
          case "Integer":
          case "Float":
            return value || 0;
          default:
            return value || "";
        }
      default:
        return value || "";
    }
  }

  matchesAny(term,document) {
    return this.filter_attribute_names.some(
      (att_name) => {
        var txt = format(document, att_name)
        return txt.match && txt.match(new RegExp(term, "i"))
      }
    )
  }

  matchesAttribute(term,document) {
    var attribute_match = RegExp(
      "^" +
      "([\\w]+)" + // the attribute name
      "([=<>~])" + // the operator
      "(.*)" +     // the rest
      "$"
    )
    var match = attribute_match.exec(term)

    if (match) {
      var [ , att_name, operator, match_txt ] = match

      if (this.filter_attribute_names.includes(att_name)) {
        var txt = format( document, att_name )
        switch(operator) {
          case '=':
            return txt == match_txt
          case '~':
            return txt.match(new RegExp(match_txt, "i"))
          case '<':
            return txt < match_txt
          case '>':
            return txt > match_txt
        }
      }
    }
    return false
  }

  documents() {
    if (!this.documents || !Object.keys(this.documents).length) return null

    if (!filter || !filter.length) return this.documents

    var record_names = Object.keys(this.documents).filter(
      (record_name) => {
        var document = this.documents[record_name]
        return this.terms.every(
          (term) => this.matchesAttribute(term, document) || this.matchesAny(term,document)
        )
      }
    )

    var result = {}
    for (var record_name of record_names) {
      result[record_name] = this.documents[record_name]
    }
    return result
  }
}

export default class Magma {
  constructor(state) {
    this.magma = state.magma
    this.models = state.magma.models || {}
  }

  model_names() {
    return Object.keys(this.models)
  }

  document(model_name, record_name) {
    if (model_name && this.models[model_name] 
      && this.models[model_name].documents
      && this.models[model_name].documents[record_name]) {
      return this.models[model_name].documents[record_name]
    }
    return null
  }

  documents(model_name, record_names, filter) {
    if (model_name && this.models[model_name] 
      && this.models[model_name].documents) {
      var documents = { }
      for (var record_name of record_names) {
        var document = this.models[model_name].documents[record_name]
        if (document) documents[record_name] = document
      }

      if (filter) {
        documents = (new documentFilter(template(model_name), documents, filter)).documents()
      }
      return documents
    }
    return {}
  }

  revision(model_name, record_name) {
    if (model_name && this.models[model_name] 
      && this.models[model_name].revisions
      && this.models[model_name].revisions[record_name]) {
      return this.models[model_name].revisions[record_name]
    }
    return null
  }

  revisions(model_name, record_names) {
    if (model_name && this.models[model_name] 
      && this.models[model_name].revisions) {
      var revisions = {}
      for (var record_name of record_names) {
        var revision = this.models[model_name].revisions[record_name]
        if (revision) revisions[record_name] = revision
      }
      return revisions
    }
    return {}
  }

  template(model_name) {
    if (model_name && this.models[model_name]) return this.models[model_name].template
    return null
  }
}
