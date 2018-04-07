const dictionaryReducer = (dictionary, action)=>{
  if(!dictionary) dictionary = {};
  switch(action.type){
    case 'ADD_DICTIONARY':
      return {
        ...dictionary,
        [action.dictionary_name]: action.definitions
      };
    default:
      return dictionary;
  }
};

export default dictionaryReducer;
