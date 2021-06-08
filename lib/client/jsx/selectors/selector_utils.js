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
};
