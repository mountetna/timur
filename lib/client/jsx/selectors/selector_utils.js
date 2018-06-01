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

// Extract the defintions and set on the document.
const setDefinitions = (doc, dictionary)=>{
  for(let def_id in dictionary.definitions){
    let def = dictionary.definitions[def_id];
    if(doc.name != dictionary.definitions[def_id].name) continue;

    /*
     * Pull the human readable label and type out of the defintion and set
     *  on the data.
     */
    doc.label = def.label;
    doc.type = def.type;

    /*
     * These are the fields we are extracting from the defintion if it is not
     * null.
     */
    let keys = ['id', 'type', 'label', 'description', 'project', 'parent_id'];
    keys.forEach((key)=>{
      if(def[key] != null) doc.definitions[key] = def[key];
    });

    // Set the array values on the following multi-select items.
    let multi_select = ['regex', 'dropdown', 'select', 'boolean', 'checkbox'];
    if(multi_select.indexOf(def.type) > -1){
      if(doc.definitions.values == undefined) doc.definitions.values = [];
      doc.definitions.values.push(def.value);
    }
  }
};

// Add a simple object of the other possible selections for this entry.
const setPeers = (doc, dictionary)=>{
  for(let def_id in dictionary.definitions){
    let def = dictionary.definitions[def_id];
    if(doc.definitions.parent_id != def.parent_id) continue;

    // We sort the peers by name and add the labels and ids.
    if(!(def.name in doc.peers)) doc.peers[def.name] = {
      ids: [],
      label: def.label
    };

    doc.peers[def.name].ids.push(def.id);
  }
};

/* 
 * Take a collection of documents and interleave the dictionary type and
 * definitions, and peers.
 */
export const interleaveDictionary = (documents, dictionary)=>{

  // Only run the interleaving if both the documents and dictionary have data.
  if(Object.keys(documents).length <= 0) return documents;
  if(Object.keys(dictionary).length <= 0) return documents;
  if(Object.keys(dictionary.definitions).length <= 0) return documents;

  for(let doc_id in documents){
    documents[doc_id]['label'] = null;
    documents[doc_id]['type'] = null;
    documents[doc_id]['revised'] = false;
    documents[doc_id]['definitions'] = {};
    documents[doc_id]['peers'] = {};

    setDefinitions(documents[doc_id], dictionary);
    setPeers(documents[doc_id], dictionary);
  }

  return documents;
};

export const excludeCheckboxFields = (documents)=>{
  for(let id in documents){
    let doc = documents[id];
    if(doc.type == 'checkbox'){
      delete documents[id];
    }
  }
  return documents;
};

export const compressCheckboxFields = (documents)=>{

  let checkboxFields = {};
  for(let id in documents){
    let doc = documents[id];
    if(doc.type == 'checkbox'){

      if(!(doc.id in checkboxFields)){
        checkboxFields[doc.id] = doc;
        checkboxFields[doc.id]['values'] = [doc.value];
        //delete checkboxFields[doc.id].value;
      }
      else{
        checkboxFields[doc.id].values.push(doc.value);
      }

      //delete documents[id];
    }
  }

  return Object.assign(documents, checkboxFields);
};

