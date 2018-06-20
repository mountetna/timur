var COLUMN_FORMAT = /^([\w]+)([=<>~])(.*)$/;

export default class SearchQuestion{

  constructor(template, filter=''){
    this.template = template;
    this.terms = filter.split(/\s+/);
  }

  filter(att_name, operator, value){

    var att = this.template.attributes[att_name];
    if(!att) return false;

    if(att.attribute_class == 'Magma::ForeignKeyAttribute'){

      switch(operator){
        case '=':
          return `['${att_name}', '::identifier', '::equals', ${value}]`;
        case '~':
          return `['${att_name}', '::identifier', '::matches', ${value}]`;
      }
    }
    else{
      switch(operator){
        case '=':
          return `['${att_name}', '::equals', ${value}]`;
        case '~':
          return `['${att_name}', '::matches', ${value}]`;
        case '<':
          return `['${att_name}', '::<', ${value}]`;
        case '>':
          return `['${att_name}', '::>', ${value}]`;
      }
    }

    return false;
  }


  format(value){
    return (typeof value === 'string') ? `'${value}'` : value;
  }

  query(){
    var filters = [];
    var filter;

    for(var term of this.terms){

      if (!term || term.length == 0) continue;
      var match = term.match(COLUMN_FORMAT);

      if(match){
        var [ , att_name, operator, value ] = match;
        filter = this.filter(att_name, operator, this.format(value));
        if(filter)filters.push(filter);
      }
      else{
        var value = this.format(term);

        for(var att_name in this.template.attributes){

          var att = this.template.attributes[att_name];
          if (att.type != 'String') continue;
          filters.push(this.filter(att_name, '~', value));
        }
      }
    }

    var filter_string = filters.length > 0 ? (filters.join(', ')+',') : '';

    return [
      ['model_name', `'${this.template.name}'`],
      ['record_names', `question([ @model_name, ${filter_string} '::all', '::identifier' ])`]
    ];
  }
}