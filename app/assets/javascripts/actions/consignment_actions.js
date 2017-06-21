import { getConsignments } from '../api/timur'
import { Exchange } from './exchange_actions'
import { showMessages } from './message_actions'


// Add a consignment (the actual JSON data) to the store
export const addConsignment = (name, consignment) => ({
  type: 'ADD_CONSIGNMENT',
  manifest_name: name,
  consignment: consignment
})

// Post a manifest to the query api and send the returned consignment to the store
// If things go wrong, show a message with the error
export const requestConsignments = ( manifests, success, error ) => 
  (dispatch) => {
    getConsignments(manifests, new Exchange(dispatch, `consignment list ${manifests.map(m=>m.name).join(", ")}`)).then((response) => {
      for (var name in response) {
        dispatch(addConsignment(name, response[name]))
      }
      if (success != undefined) success(response)

    }).catch((e) => e.response.json().then((response) => {
      if (response.query)
        dispatch(showMessages([
`
### For our inquiry:

\`${JSON.stringify(response.query)}\`

## this bitter response:

    ${response.errors}
`
        ]))
      else if (response.errors && response.errors.length == 1)
        dispatch(showMessages([
`### Our inquest has failed, for this fault:

    ${response.errors[0]}
`
        ]))
      else if (response.errors && response.errors.length > 1)
        dispatch(showMessages([
`### Our inquest has failed, for these faults:

${response.errors.map((error) => `* ${error}`).join('\n')}
`
        ]))
      if (error != undefined) error(response)
    })
    )
  }
