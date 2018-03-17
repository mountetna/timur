// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as MessageActions from '../actions/message_actions';

var help_nodes = {
  edit: [
    "Click the pencil to edit this record.  \n"+
    "Any changes you make (adding/deleting associations, editing text) will not be saved until you submit them (click the checkmark). The revision can be canceled at any time prior to submitting.  \n" +
    "Once approved, changes to the record cannot be undone (except through further edits)."
  ],
  timur: [ 
    ">...Who, from a Scythian Shephearde  \n"+
    ">by his rare and woonderfull Conquests, became a most  \n"+
    ">puissant and mightye Monarque.  And (for his tyranny,  \n"+
    ">and terrour in Warre) was tearmed, The Scourge of God.  \n  \n"+
    "&mdash; Tamburlaine the Great, by Christopher Marlowe",

    "![Alliteration and Variation in Old Germanic Name-Giving](names.png)  \n"+
    "&mdash; George T. Flom, _Modern Language Notes_ Vol. 32, No. 1 (Jan., 1917), pp. 7-17 "
  ],
  table_viewer: [
    "### Table Viewer\n"+
    "Fittingly, this viewer displays a set of records in a table format.\n  \n"+
    "You may filter/search the table via the search box. The table will display a subset of the records that match the filter criterion",
    "### Filtering the Table\n"+
    "The table will show records matching each space-delimited term in the query string.\n"+
    "For example, the query:  \n\n"+
    "    foo bar\n"+
    "will only display records where at least one string column contains 'foo' and at least one string column contains 'bar' (case insensitive).\n  \n"+
    "You may indicate the column you wish to search in each query term:  \n\n"+
    "    column_1=foo column_2=bar\n"+
    "Here we only wish to show records where the value of column_1 is exactly 'foo' (case sensitive) and the value of column_2 is exactly 'bar'.\n  \n"+
    "There are several column comparison operators:  \n\n"+
    "    = exact string match or numeric equality\n"+
    "    < or > alphabetic, numeric or date comparison (dates are like 2015-01-01@23:00)\n"+
    "    ~ case-insensitive regular expression match\n"+
    "This last is extremely powerful (if you know regular expressions), but is most often useful for doing case-insensitive matches within a column (i.e., not exact strings), for example, column_1~foo.\n\n"+
    "By combining terms we can generate more precise subsets of the table for export. For example the query:\n\n"+
    "    sample_name~CRC date_of_surgery>2012-01-06@12:20\n"+
    "can reduce a set of sample records to a given date and indication range."
    ,
    "### Exporting Data\n"+
    "After filtering (or before), you may export the data in TSV format. In some cases, string fields may have contained tab or newline characters; these will be converted."
  ]
}

export class HelpButton extends React.Component{
  render(){
    var self = this;
    if (!this.props.helpShown) return <div style={{display: "none"}}></div>

    let props = {
      className: "help",
      onClick: function() {
        self.props.dispatch(MessageActions.showMessages(help_nodes[self.props.info]))
      }
    }
    return(
      <div {...props}>
        <span className="fa-stack">
          <span className="circle fa fa-circle fa-stack-1x"/>
          <span className="question fa fa-question fa-stack-1x"/>
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    helpShown: state.timur.help_shown
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {};
};

export const HelpContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpButton);
