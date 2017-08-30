/*
 * TODO! The <Header /> component has been disabled here. The <Header />
 * component is used to render the bulk edit buttons and events. Editing is
 * presently not working on this 'tab'. We either need to fix the editing
 * feature OR remove the editing feature. Presently the code for editing still
 * exists in this component but has been disabled by removing the <Header />
 * component from the render.
 */

import React, {Component} from 'react'
import {connect} from 'react-redux';

import Magma from 'magma';
import {requestModels, sendRevisions, discardRevision, requestDocuments} from '../../actions/magma_actions';
import {requestTSV} from '../../actions/timur_actions';
import {selectConsignment} from '../../selectors/consignment';
import {requestConsignments} from '../../actions/consignment_actions';

import SearchQuery from './search_query';
import Header from '../header';
import SearchTable from './search_table';
import SearchQuestion from './search_question';

class Search extends Component{
  constructor(props){
    super(props);
    this['state'] = {'mode': 'search', 'page_size': 10, 'current_page': 0};
  }

  componentDidMount(){
    this.props.getModels();
  }

  setPage(page){
    this.setState({'current_page': page}, ()=>this.ensurePageRecords())
  }

  pageRecordNames(page){
    if(!this.props.record_names.length) return [];
    var frm = this.state.page_size * page;
    var to = this.state.page_size * (page + 1);
    return this.props.record_names.slice(frm, to);
  }

  ensurePageRecords(){
    var page_record_names = this.pageRecordNames(this.state.current_page);
    var has_complete_records = this.props.hasCompleteRecords(
      this.props.model_name,
      page_record_names
    );

    if(page_record_names && !has_complete_records){
      this.props.requestDocuments(
        this.props.model_name,
        page_record_names
      );
    }
  }

  /*
   * In this case we will simply post a manifest named 'search'.
   * 
   * Within the manifest will be contained model_name and record_names, which we
   * unpack in the future to make the page.
   */
  postQuery(model_name, filter){

    var question = new SearchQuestion(
      this.props.templateFor(model_name),
      filter
    );

    var res_func = (response)=>{
      this.setState({'current_page': 0}, ()=>this.ensurePageRecords());
    };

    this.props.query(question.query(), res_func);
  }

  headerHandler(action){
    switch(action) {
      case 'cancel':
        this.setState({mode: 'search'});

        this.props.discardRevisions(
          this.props.model_name,
          this.pageRecordNames(this.state.current_page, this.props.record_names)
        );

        return;
      case 'approve':
        var record_names = this.pageRecordNames(
          this.state.current_page, 
          this.props.record_names
        );

        var revisions = this.props.revisionsFor(
          this.props.model_name,
          record_names
        );

        if(Object.keys(revisions).length > 0){

          let localSuccess = ()=>this.setState({'mode': 'search'});
          let localError = (messages)=>{
            this.setState({'mode': 'edit'});
            let err_msg = ['### An unknown error occurred.\n'];
            this.props.showMessage(messages.errors || err_msg);
          };

          this.setState({'mode': 'submit'});
          this.props.submitRevisions(
            this.props.model_name,
            revisions,
            localSuccess,
            localError
          );
        }
        else{
          this.setState({'mode': 'search'});
          this.props.discardRevisions(
            this.props.model_name,
            record_names
          );
        }
        return;
      case 'edit':
        this.setState({'mode': 'edit'});
        return;
    }
  }

  renderPages(){
    if(!this.props.model_name) return null;

    var selector_props = {
      'values': [10, 25, 50, 200],
      'defaultValue': this.state.page_size,
      'showNone': 'disabled',
      'onChange': (page_size)=>{

        var last_page = Math.ceil(this.props.record_names.length / page_size)-1;
        var state = {
          'page_size': page_size,
          'current_page': Math.min(this.state.current_page, last_page)
        };

        this.setState(state, ()=>this.ensurePageRecords());
      }
    };

    var button_input_props = {
      'className': 'button',
      'type': 'button',
      'value': "\u21af TSV",
      'onClick': ()=>{
        this.props.requestTSV(
          this.props.model_name,
          this.props.record_names
        );
      }
    };

    var pager_props = {
      'pages': Math.ceil(this.props.record_names.length / this.state.page_size),
      'current_page': this.state.current_page,
      'set_page': this.setPage.bind(this)
    };

    return(
      <div className='pages'>

        <div className='page_size'>

          {'Page Size'}
          <Selector {...selector_props} />
          <input {...button_input_props} />
        </div>
        <div className='results'>

          {'Found '+this.props.record_names.length+' records in '}
          <span className='model_name'>

            {this.props.model_name}
          </span>
        </div>
        <Pager {...pager_props} />
      </div>
    );
  }

  renderSearchQuery(){
    if(this.state.mode != 'search') return null;

    var search_query_props = {
      'postQuery': this.postQuery.bind(this),
      'model_names': this.props.model_names
    };

    return(
      <div className='control'>

        <SearchQuery {...search_query_props} />
        {this.renderPages()}
      </div>
    );
  }

  renderSearchTable(){
    if(!this.props.model_name) return null;

    var header_props = {
      'mode': this.state.mode,
      'handler': this.headerHandler.bind(this),
      'can_edit': this.props.can_edit,
    };

    var table_props = {
      'mode': this.state.mode,
      'model_name': this.props.model_name,
      'record_names': this.pageRecordNames(
        this.state.current_page,
        this.props.record_names
      )
    };

    return(
      <div className='documents'>
        <SearchTable {...table_props} />
      </div>
    );
  }

  render(){
    return(
      <div id='search'>
        {this.renderSearchQuery()}
        {this.renderSearchTable()}
      </div>
    );
  }
}

const completeRecord = (documents, attribute_names)=>{
  return (record_name)=>{
    return(
      documents[record_name] &&
      attribute_names.every((attribute_name)=>{
        return documents[record_name].hasOwnProperty(attribute_name);
      })
    );
  };
};

// exclude things not shown and tables
const displayedAttributes = (template)=>{
 return Object.keys(template.attributes).filter((attribute_name)=>{
    return(
      template.attributes[attribute_name].shown &&
      template.attributes[attribute_name].attribute_class !=
      'Magma::TableAttribute'
    );
  });
};

const mapStateToProps = (state, ownProps)=>{

  var magma = new Magma(state);
  var consignment = selectConsignment(state, 'search') || {};
  var rec_nms = [];
  if(consignment && consignment.record_names){
    rec_nms = consignment.record_names.values;
  }

  return {
    'model_names': magma.model_names(),
    'model_name':consignment.model_name,
    'record_names': rec_nms,
    'templateFor': (model_name)=>{

      return magma.template(model_name);
    },
    'hasCompleteRecords': function(model_name, record_names){

      var documents = magma.documents(model_name,record_names);
      var template = magma.template(model_name);
      return record_names.every(
        completeRecord(documents, displayedAttributes(template))
      );
    }
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    getModels: function(){
      dispatch(requestModels());
    },

    query: function(manifest, success){
      dispatch(requestConsignments(
        [{'name': 'search','manifest': manifest}],
        success
      ));
    },

    submitRevisions: function(model_name,revisions,success,error){
      dispatch(sendRevisions(model_name, revisions, success, error));
    },

    discardRevisions: function(model_name,record_names){
      if(!record_names || !record_names.length) return;

      record_names.forEach(function(record_name){
        dispatch(discardRevision(record_name, model_name));
      });
    },

    requestDocuments: function(model_name, record_names, success){
      dispatch(requestDocuments({
        model_name,
        record_names,
        'attribute_names': 'all',
        'collapse_tables': true,
        success,
        'exchange_name': `request-${model_name}`
      }));
    },

    requestTSV: function(model_name, record_names){
      dispatch(requestTSV(model_name, record_names));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
