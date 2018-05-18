export const nestDataset = (record, nested_records)=>{
  /*
   * If there is no parent_id then this is a root node. Add the record and
   * create an empty child object on the node.
   */
  if(record.parent_id == null){
    nested_records[record.id] = {...record, children: {}};
    return nested_records;
  }

  /*
   * Loop over the entries in 'this' level of the nested_records. If the
   * record.parent_id matches the id in the parent_record then we know that the
   * current record is a child and we can set it in the parent_record's children
   * object. Otherwise, we recurse and repeat the process.
   */
  for(let id in nested_records){
    let parent_record = nested_records[id];

    if(parent_record.id == record.parent_id){

      // Add to children.
      parent_record.children[record.id] = {
        ...record,
        children: {}
      };
    }
    else{

      // Since the parent_id didn't match we recurse across the children.
      parent_record.children = nestDataset(
        record,
        parent_record.children
      );
    }
  }

  return nested_records;
};

/* 
 * Take a collection of documents and interleave the dictionary type and
 * definitions.
 */
export const interleaveDictionary = (documents, dictionary)=>{

  // Only run the interleaving if both the documents and dictionary have data.
  if(Object.keys(documents).length <= 0) return documents;
  if(Object.keys(dictionary).length <= 0) return documents;
  if(Object.keys(dictionary.definitions).length <= 0) return documents;

  for(let doc_id in documents){
    let doc = documents[doc_id];
    doc['definitions'] = {
      type: null,
      label: null,
      description: null,
      project: null,
      values: []
    };

    // Extract the defintions and set on the document.
    for(let def_id in dictionary.definitions){
      let def = dictionary.definitions[def_id];
      if(doc.name == def.name){

        /*
         * These are the fields we are extracting from the defintion if it is
         * not null.
         */
        let keys = ['type', 'label', 'description', 'project'];
        keys.forEach((key)=>{
          if(def[key] != null) doc.definitions[key] = def[key];
        });

        /*
         * Regex is the multi choice type, so we only have 'values' if the type
         * is 'regex'.
         */
        if(def.type == 'regex'){
          doc.definitions.values.push(def.value);
        }
        else{
          delete doc.definitions.values;
        }
      }
    }
  }

  return documents;
};
