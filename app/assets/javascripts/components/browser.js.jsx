/*
 * The Browser presents views of a record/model. The views are organized into
 * tabs/panes.
 * 
 * The Browser should request data for a record/model/tab - this comes with an
 * associated payload and any extra data required to draw this tab.
 * 
 * The Browser has state in the form of mode (edit or not) and tab (which one is
 * shown).
 */

// Class imports.
import Magma from 'magma';
import BrowserTab from './browser_tab';
import Tab from '../models/tab';

// Module imports.
import {discardRevision, sendRevisions} from '../actions/magma_actions';
import {requestView} from '../actions/timur_actions';

var Browser = React.createClass({
  componentDidMount: function(){
    var suc = ()=>{this.setState({mode: 'browse'})};
    var err = (e)=>{ console.log(e) };

    let req_view_args = [
      this.props.model_name,
      this.props.record_name,
      null,
      suc,
      err
    ];

    this.props.requestView(...req_view_args);
  },

  setMode: function(){
    this.setState({'mode': 'browse'});
  },

  getInitialState: function(){
    return {'mode': 'loading', 'current_tab_name': null};
  },

  camelize: function(str){
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index){
      return letter.toUpperCase();
    }).replace(/\s+/g, '');
  },

  headerHandler: function(action){
    switch(action){
      case 'cancel':

        this.setState({'mode': 'browse'});
        this.props.discardRevision(
          this.props.record_name,
          this.props.model_name
        );
        return;
      case 'approve':

        if(this.props.hasRevisions){

          this.setState({'mode': 'submit'});
          this.props.sendRevisions(
            this.props.model_name,
            {[this.props.record_name] : this.props.revision},
            ()=>this.setState({'mode': 'browse'}),
            ()=>this.setState({'mode': 'edit'})
          );
        }
        else{

          this.setState({'mode': 'browse'});
          this.props.discardRevision(
            this.props.record_name,
            this.props.model_name
          );
        }
        return;
      case 'edit':

        this.setState({'mode': 'edit'});
        return;
    }
  },

  render: function(){
    var self = this;
    var view = this.props.view;
    if(!view || !this.props.template || !this.props.document){
      return(
        <div className='browser'>
          <div id='loader-container'>

            <div className="loader">Loading...</div>
          </div>
        </div>
      );
    }

    var current_tab_name = this.state.current_tab_name || Object.keys(view)[0];
    var skin = 'browser';
    if(this.state.mode == 'browse') skin = 'browser '+this.props.model_name;

    var header_props = {
      'mode': this.state.mode,
      'handler': this.headerHandler,
      'can_edit': this.props.can_edit
    };

    var tab_bar_props = {
      'mode': this.state.mode,
      'revision': this.props.revision,
      'current_tab_name': current_tab_name,
      'view': view,
      'clickTab': function(tab_name){

        // Set the new requested tab state.
        self.setState({'current_tab_name': tab_name});

        // If the current tab data isn't in the store then request the tab data.
        if(!view[tab_name]){

          let req_view_args = [
            self.props.model_name,
            self.props.record_name,
            tab_name
          ];

          self.props.requestView(...req_view_args);
        }
      }
    };

    var browser_tab = null;
    if(view[current_tab_name]){
      let browser_tab_args = [
        this.props.model_name,  // model_name
        this.props.record_name, // record_name
        current_tab_name,       // tab_name
        view[current_tab_name], // config
        this.props.template     // template
      ];

      browser_tab = new Tab(...browser_tab_args);
    }

    var browser_tab_props = {
      'template': this.props.template,
      'document': this.props.document,
      'revision': this.props.revision,
      'mode': this.state.mode,
      'name': current_tab_name,
      'tab': browser_tab
    };

    return(
      <div className={skin}>

        <Header {...header_props}>

          <div className='model_name'>

            {this.camelize(this.props.model_name)}
          </div>
          <div className='record_name'>

            {this.props.record_name}
          </div>
          <Help info='edit' />
        </Header>
        <TabBar {...tab_bar_props} />
        <BrowserTab {...browser_tab_props} />
      </div>
    );
  }
})

Browser = connect(
  function(state, props){
    var magma = new Magma(state);
    var template = magma.template(props.model_name);
    var document = magma.document(props.model_name, props.record_name);
    var revision = magma.revision(props.model_name, props.record_name) || {};
    var view = (state.timur.views ? state.timur.views[props.model_name] : null);

    var data = {
      template,
      document,
      revision,
      view,
      'hasRevisions': (Object.keys(revision).length > 0)
    };

    return data;
  },
  {
    requestView,
    discardRevision,
    sendRevisions
  }
)(Browser);

module.exports = Browser;
