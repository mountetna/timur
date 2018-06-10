// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import MagmaLink from '../magma_link';
import * as MessageActions from '../../actions/message_actions';
import * as ManifestActions from '../../actions/manifest_actions';
import * as ConsignmentSelector from '../../selectors/consignment_selector';

export class CategoryControl extends React.Component{

  renderCategories(){
    let categories = Object.keys(this.props.metric_names);
    return categories.map((category)=>{
      let category_props = {
        key: category,
        className: this.props.hidden[category] ? 'category_label hidden' : 'category_label',
        onClick: ()=>{
          this.props.toggleHidden(category);
        }
      };

      return <div {...category_props}>{category}</div>;
    });
  }

  renderMetricNames(){
    let categories = Object.keys(this.props.metric_names);
    return categories.map((category)=>{

      if(this.props.hidden[category]) return null;

      let metric_names = this.props.metric_names[category].map((metric_name)=>{
        return <div key={metric_name} className='metric'>{metric_name}</div>
      });

      return(
        <div className='category' key={category}>

          {metric_names}
        </div>
      );
    });
  }

  render(){
    return(
      <div className='categories'>

        {this.renderCategories()}
        <div className='metrics_names'>

          {this.renderMetricNames()}
        </div>
      </div>
    );
  }
}

export class RecordMetrics extends React.Component{
  renderCategoryMetrics(){
    let categories = Object.keys(this.props.metric_names);
    return categories.map((category)=>{

      let {
        hidden,
        record_name,
        metric_names,
        metrics
      } = this.props;

      if(hidden[category]) return null;

      metrics = metric_names[category].map((metric_name)=>{
        return metrics[metric_name];
      });

      let category_props = {
        record_name,
        key: category,
        metrics
      };

      return <CategoryMetrics {...category_props} />;
    });
  }

  render(){
    let {
      metric_names,
      record_name,
      model_name
    } = this.props;

    return(
      <div className='metrics'>

        <div className='record_name'>

          <MagmaLink link={record_name} model={model_name} />
        </div>
        {this.renderCategoryMetrics()}
      </div>
    );
  }
}

export class Metric extends React.Component{
  render(){
    let {
      metric,
      showDetails
    } = this.props;

    let metric_props = {
      className: 'metric_box',
      onClick: ()=>{
        this.props.showDetails();
      }
    };

    let title_props = {
      className: metric.score + ' metric',
      title: metric.details.length ? metric.message + " [ Click for details ]" : metric.message
    };

    return(
      <div {...metric_props}>

        <div {...title_props}>&nbsp;</div>
      </div>
    );
  }
}

const metricMapStateToProps = (state = {}, own_props)=>{
  return state;
};

const metricMapDispatchToProps = (dispatch, own_props)=>{
  let metric = own_props.metric;
  let details = metric.details;

  let detail_messages = metric.details.map((detail)=>{

    let details = detail.entries.map((entry)=>{
      return `- ${entry}`
    });
    details = details.join('\n');

    return `## ${detail.title} ${details}`;
  });

  detail_messages = detail_messages.join('\n');

  let messages = `# The test ${metric.name} on ${props.record_name} failed. ${detail_messages}`;

  return {
    showDetails: function(){
      if(details.length) dispatch(MessageActions.showMessages(messages));
    }
  };
};

export const MetricContainer = ReactRedux.connect(
  metricMapStateToProps,
  metricMapDispatchToProps
)(Metric);


export class CategoryMetrics extends React.Component{
  render(){

    let categories = this.props.metrics.map((metric)=>{
      let metric_props = {
        key: metric.name,
        record_name: this.props.record_name,
        metric
      };

      return <Metric {...metric_props} />;
    });

    return(
      <div className='category'>

        {categories}
      </div>
    );
  }
}

export class MetricsAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      category_hidden: {},
      fetched_consignment: false
    };
  }

  componentDidMount(){
    let {
      document,
      template,
      selected_consignment,
      selected_manifest,
      fetchConsignment
    } = this.props;

    /*
     * If we don't have the consignment (data) we need for the plot but we do
     * have the manifest (data request), then go ahead and make the request.
     */
    if(selected_consignment == undefined){
      if(selected_manifest != undefined){
        if(!this.state.fetched_consignment){
          fetchConsignment(selected_manifest.id, document[template.identifier]);
          this.setState({fetched_consignment: true});
        }
      }
    }
  }

  renderMetrics(){
    let {
      model_name,
      metric_names,
      metrics
    } = this.props;

    return metrics.map((identifier, metric_set)=>{

      let record_props = {
        model_name,
        metric_names,
        hidden: this.state.category_hidden,
        record_name: identifier,
        key: identifier,
        metrics: metric_set
      };

      return <RecordMetrics {...record_props} />;
    });
  }

  render(){
    let category_props = {
      hidden: this.state.category_hidden,
      metric_names: this.props.metric_names,
      toggleHidden: (category)=>{
        this.setState({
          category_hidden: {
            ...this.state.category_hidden,
            [category]: !this.state.category_hidden[category]
          }
        });
      }
    };

    return(
      <div className='value'>

        <CategoryControl {...category_props} />
        <div className='metrics_view'>

          {this.renderMetrics()}
        </div>
      </div>
    );
  }
}

const metricAttrStateToProps = (state = {}, own_props)=>{

  /*
   * Pull the data required for this attribute.
   */
  let selected_manifest, selected_consignment = undefined;
  selected_manifest = state.manifests[own_props.attribute.manifest_id];
  if(selected_manifest != undefined){
    selected_consignment = ConsignmentSelector.selectConsignment(
      state,
      selected_manifest.md5sum
    );
  }

  let metric_names = {};
  let metrics = [];
  let model_name;

  if(selected_consignment && selected_consignment.metrics){
    for(let metric_name in selected_consignment.metrics.values[0]){
      let metric = selected_consignment.metrics.values[0][metric_name];
      metric_names = {
        ...metric_names,
        [metric.category]: [
          metric_name,
          ...(metric_names[metric.category] || [])
        ]
      };
    }

    metrics = selected_consignment.metrics;
    model_name = selected_consignment.model_name;
  }

  return {
    metrics,
    metric_names,
    model_name,
    selected_manifest,
    selected_consignment
  };
};

const metricAttrDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchConsignment: (manifest_id, record_name)=>{
      dispatch(ManifestActions.requestConsignmentsByManifestId(
        [manifest_id],
        record_name
      ));
    }
  };
};

export const MetricsAttributeContainer = ReactRedux.connect(
  metricAttrStateToProps,
  metricAttrDispatchToProps
)(MetricsAttribute);
