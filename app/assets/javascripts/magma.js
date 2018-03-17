import * as Dates from './utils/dates';

class DocumentFilter{
  constructor(template, documents, filter){
    this.documents = documents;
    this.template = template;
    this.terms = filter.split(/\s+/).filter((term) => term.length)
    this.filter_attribute_names = Object.keys(template.attributes).filter(
      (att_name)=>template.attributes[att_name].shown
    )
  }

  format(document, att_name){
    let value = document[att_name];
    if(value == undefined) return '';

    let att_class = this.template.attributes[att_name].attribute_class;
    let att_type = this.template.attributes[att_name].type;

    switch(att_class){
      case 'Magma::FileAttribute':
      case 'Magma::ImageAttribute':
        return value.url;
      case 'Magma::CollectionAttribute':
        return value.join(',');
      case 'Magma::TableAttribute':
        return '';
      case 'Magma::LinkAttribute':
        return value || '';
      case 'Magma::Attribute':
        switch(att_type) {
          case 'DateTime':
            return Dates.formatDate(value) + '@' + Dates.formatTime(value);
          case 'Integer':
          case 'Float':
            return value || 0;
          default:
            return value || '';
        }
      default:
        return value || '';
    }
  }

  matchesAny(term, document){
    return this.filter_attribute_names.some(
      (att_name)=>{
        let txt = this.format(document, att_name);
        return txt.match && txt.match(new RegExp(term, 'i'));
      }
    );
  }

  matchesAttribute(term, document){
    let attribute_match = RegExp(
      '^' +
      '([\\w]+)' + // The attribute name.
      '([=<>~])' + // The operator.
      '(.*)' +     // The rest.
      '$'
    );
    let match = attribute_match.exec(term);

    if(match){
      let [, att_name, operator, match_txt] = match;

      if(this.filter_attribute_names.includes(att_name)){
        let txt = this.format(document, att_name)
        switch(operator){
          case '=':
            return txt == match_txt;
          case '~':
            return txt.match(new RegExp(match_txt, 'i'));
          case '<':
            return txt < match_txt;
          case '>':
            return txt > match_txt;
        }
      }
    }
    return false;
  }

  filteredDocuments(){
    if(!this.documents || !Object.keys(this.documents).length) return null;
    if(!this.terms.length) return this.documents;

    let record_names = Object.keys(this.documents).filter((record_name)=>{
      let document = this.documents[record_name];
      return this.terms.every((term)=>{
        return(
          this.matchesAttribute(term, document) ||
          this.matchesAny(term,document)
        );
      }); 
    });

    let result = {};
    for(let record_name of record_names){
      result[record_name] = this.documents[record_name];
    }

    return result;
  }
}

export default class Magma{
  constructor(state){
    this.magma = state.magma;
    this.models = state.magma.models || {};
  }

  modelNames(){
    return Object.keys(this.models).sort();
  }

  document(model_name, record_name) {
    if(
      model_name &&
      this.models[model_name] &&
      this.models[model_name].documents &&
      this.models[model_name].documents[record_name]
    ){
      return this.models[model_name].documents[record_name];
    }

    return null;
  }

  documents(model_name, record_names, filter){
    if(
      model_name &&
      record_names &&
      this.models[model_name] &&
      this.models[model_name].documents
    ){

      let documents = {};
      for(let record_name of record_names){
        let document = this.models[model_name].documents[record_name];
        if(document) documents[record_name] = document;
      }

      if(filter){
        documents = new DocumentFilter(
          this.template(model_name),
          documents,
          filter
        );

        documents = documents.filteredDocuments();
      }

      return documents;
    }

    return {};
  }

  revision(model_name, record_name){
    if(
      model_name &&
      this.models[model_name] &&
      this.models[model_name].revisions &&
      this.models[model_name].revisions[record_name]
    ){

      return this.models[model_name].revisions[record_name];
    }

    return null;
  }

  revisions(model_name, record_names){
    if(
      model_name &&
      record_names &&
      this.models[model_name] &&
      this.models[model_name].revisions
    ){

      let revisions = {};
      for(let record_name of record_names){
        let revision = this.models[model_name].revisions[record_name];
        if(revision) revisions[record_name] = revision;
      }

      return revisions;
    }

    return {};
  }

  template(model_name){
    if(model_name && this.models[model_name]){
      return this.models[model_name].template;
    }
    else{
      return null;
    }
  }
}
