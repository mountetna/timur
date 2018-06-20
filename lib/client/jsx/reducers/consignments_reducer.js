const consignments = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CONSIGNMENT':
      return {
        ...state,
        [action.manifest_data_md5sum]: action.consignment
      }
    default:
      return state
  }
}

export default consignments
