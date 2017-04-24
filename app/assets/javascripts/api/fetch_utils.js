import downloadjs from 'downloadjs'

export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export const parseJSON = (response) => response.json()

export const makeBlob = (response) => response.blob()

export const generateDownload = (filename) => (blob) => downloadjs(blob, filename, blob.type)

export const headers = (...types) => {
  var _headers = {}

  var add = (header, value) => _headers[header] = value

  for (var type of types) {
    switch(type) {
      case 'json':
        add( 'Content-Type', 'application/json')
      case 'csrf':
        var csrf = document.querySelector('meta[name=csrf-token]')
        if (csrf) add('X-CSRF-Token', csrf.getAttribute('content'))
    }
  }

  return _headers
}
