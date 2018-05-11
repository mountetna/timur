export const nest_dataset = (record, nested_records)=>{
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
      parent_record.children = nest_dataset(
        record,
        parent_record.children
      );
    }
  }

  return nested_records;
};
