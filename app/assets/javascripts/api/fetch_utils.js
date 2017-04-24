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

export const generateDownload = (filename) => {
  return (blob) => {
    var data = window.URL.createObjectURL(blob)
    var link = document.createElement('a')
    link.href = data
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const headers = (...types) => {
  var _headers = {}

  console.log(types)

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

  console.log(_headers)

  return _headers
}
