const consignments = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CONSIGNMENT':
      return {
        ...state,
        [action.manifest_id]: action.consignment
      }
    default:
      return state
  }
}

export default consignments
