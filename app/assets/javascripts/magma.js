export default class Magma {
  constructor(state) {
    this.magma = state.magma
    this.models = state.magma.models || {}
  }

  model_names() {
    return Object.keys(this.models)
  }

  documents(model_name, record_names) {
    if (model_name && this.models[model_name] 
      && this.models[model_name].documents) {
      var documents = { }
      for (var record_name of record_names) {
        var document = this.models[model_name].documents[record_name]
        if (document) documents[record_name] = document
      }
      return documents
    }
    return {}
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
