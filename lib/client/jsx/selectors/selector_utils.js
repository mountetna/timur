export const nestDataset = (records, key, parent_key)=>{

  /*
   * Set the children object on each record if not present, and isolate the root
   * objects.
   */
  let nodes = [];
  for(let id in records){
    if(!('children' in records[id])) records[id]['children'] = {};
    if(records[id][parent_key] == null) nodes.push(records[id]);
  }

  while(nodes.length > 0){
    let node = nodes.pop();

    for(let id in records){

      /*
       * Match the current child's 'parent_key' with the current node's key. Add
       * the child to the nodes array to keep the match making active. Remove
       * the the child from the records object.
       */
      if(node[key] == records[id][parent_key]){
        records[node[key]].children[id] = records[id];
        nodes.push(records[id]);
      }
    }
  }

  for(let id in records){
    if(records[id][parent_key] != null) delete records[id];
  }

  return records;
}

export const setDefinitionUids = (records, dictionary, uid_obj = {})=>{

  for(let rec_uid in records){
    if(!(rec_uid in uid_obj)) uid_obj[rec_uid] = {};
    uid_obj[rec_uid]['uid'] = rec_uid;
    uid_obj[rec_uid]['children'] = {};
    uid_obj[rec_uid]['definitions'] = [];
    uid_obj[rec_uid]['definition'] = null;
    uid_obj[rec_uid]['parent_uid'] = records[rec_uid].parent_uid;

    for(let def_uid in dictionary.definitions){
      let def = dictionary.definitions[def_uid];

      if(records[rec_uid].name == def.name){
        uid_obj[rec_uid].definitions.push(def_uid);

        // Temporary shim! We need to fix the data in the DB.
        if(def.type == 'boolean'){
          switch(records[rec_uid].value){
            case '0':
              records[rec_uid].value = 'false';
              break;
            case '1':
              records[rec_uid].value = 'true';
              break;
          }
        }

        if(records[rec_uid].value == def.value){
          uid_obj[rec_uid]['definition'] = def.uid;
        }
      }
    }

    if(uid_obj[rec_uid].definitions.length == 1){
      uid_obj[rec_uid]['definition'] = uid_obj[rec_uid].definitions[0];
    }
  }

  return uid_obj;
};

export const setSiblingUids = (records, dictionary, uid_obj = {})=>{

  loop_a:
  for(let rec_uid in records){
    let def_parent_uid = undefined;
    if(!(rec_uid in uid_obj)) uid_obj[rec_uid] = {};
    uid_obj[rec_uid]['siblings'] = [];

    loop_b:
    for(let def_uid in dictionary.definitions){
      let def = dictionary.definitions[def_uid];

      if(records[rec_uid].name == def.name){
        def_parent_uid = def.parent_uid;
        break loop_b;
      }
    }

    loop_c:
    for(let def_uid in dictionary.definitions){
      let def = dictionary.definitions[def_uid];
      if(def_parent_uid == def.parent_uid){
        uid_obj[rec_uid].siblings.push(def.uid);
      }
    }
  }

  return uid_obj;
};

export const excludeCheckboxFields = (records)=>{
  for(let id in records){
    let rec = records[id];
    if(rec.type == 'checkbox'){
      delete records[id];
    }
  }
  return records;
};
