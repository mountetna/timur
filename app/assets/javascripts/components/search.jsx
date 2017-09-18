/*
 * The Search view allows us to post queries for a particular table.
 */
import { requestModels, requestDocuments } from '../actions/magma_actions'
import { requestTSV } from '../actions/timur_actions'
import { selectSearchCache } from '../selectors/search_cache'
import { requestConsignments } from '../actions/consignment_actions'
import { cacheSearchPage, setSearchPageSize, setSearchPage } from '../actions/search_actions'

class SearchTableColumnHeader extends Component {
  constructor(props) {
    super(props)
    this.state = { sizing: false }
  }

  render() {
    var class_set = {
      table_header: true,
      focused_col: this.props.focused
    }
    class_set[ "c" + this.props.column ] = true
    return <div ref='column' className={ classNames(class_set) }
      onMouseDown={
        (e) => {
          e.preventDefault()
          this.setState({
            sizing: true, x: e.nativeEvent.offsetX, 
            width: this.refs.column.offsetWidth 
          })
        }
      }
      onMouseUp={ () => this.setState({sizing: false}) }
      onMouseMove={
        (e) => {
          if (!this.state.sizing) return
          e.preventDefault()
          var size_change = e.nativeEvent.offsetX - this.state.x
          $('.c'+this.props.column).width(this.state.width + size_change)
        }
      }
    
      >
      { this.props.column }
    </div>
  }
}

class SearchTableRow extends Component {
  render() {
    let { attribute_names, document, template, record_name, focusCell, mode } = this.props
    return <div className="table_row">
      {
        attribute_names.map((att_name, i) =>
          <SearchTableCell 
            key={ att_name }
            att_name={ att_name }
            document={ document }
            template={ template }
            record_name={ record_name }
            focusCell={ focusCell }
            mode={ mode }
          />
        )
      }
    </div>
  }
}

class SearchTableCell extends Component {
  render() {
    let { document, template, record_name, att_name, mode, focusCell } = this.props
    let value = document[ att_name ]


    var class_set = {
      table_data: true,
      revised: (mode == 'edit' && value != revised_value),
      focused_row: focusCell( record_name ),
      focused_col: focusCell( null, att_name),
    }
    class_set[ "c" + att_name ] = true
    return <div
      onClick={ () => focusCell( record_name, att_name ) }
      className={ classNames(class_set) }>
      { 
        (template.attributes[att_name].attribute_class != "Magma::TableAttribute") ?
        <AttributeViewer 
          mode={mode}
          template={ template }
          document={ document }
          value={ value }
          attribute={ template.attributes[att_name] }/>
        : null
      }
    </div>
  }
}
