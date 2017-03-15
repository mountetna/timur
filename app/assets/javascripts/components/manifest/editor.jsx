import Toolbar from './toolbar'

export default () => (
  <div style={{marginLeft: 15, marginRight: 15, marginTop: 15, display: 'flex', 'flexDirection': 'column'}}>
    <Toolbar />
    <div>
      <textarea style={{width: '100%', height: 200, padding:0, boxSizing:'border-box', 'maxWidth': '100%'}}></textarea>
    </div>
  </div>
)