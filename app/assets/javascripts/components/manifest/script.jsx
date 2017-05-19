import Prism from 'prismjs'

const Script = (code) => {
  let __html = Prism.highlight(code, Prism.languages.javascript)
  return <pre className='script'
        dangerouslySetInnerHTML={ { __html } }/>
}

export default Script
