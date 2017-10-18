import StackedBarPlotAttribute from './stacked_bar_plot_attribute';
import BarGraphAttribute from './bar_graph_attribute';
import HistogramAttribute from './histogram_attribute';
import SwarmAttribute from './swarm_attribute';
import NumericAttribute from './numeric_attribute';
import CollectionAttribute from './collection_attribute';

var AttributeViewer = React.createClass({
  render: function(){
    var attribute = this.props.attribute;
    var attr_props = {
      'document': this.props.document,
      'template': this.props.template,
      'value': this.props.value,
      'revision': this.props.revision,
      'mode': this.props.mode,
      'attribute': this.props.attribute
    };

    switch(attribute.attribute_class){
      case 'BarPlotAttribute':
        return <BarPlotAttribute {...attr_props} />;
      case 'StackedBarPlotAttribute':
        return <StackedBarPlotAttribute {...attr_props} />;
      case 'BarGraphAttribute':
        return <BarGraphAttribute {...attr_props} />;
      case 'HistogramAttribute':
        return <HistogramAttribute {...attr_props} />;
      case 'SwarmAttribute':
        return <SwarmAttribute {...attr_props} />;
      case 'BoxPlotAttribute':
        return <BoxPlotAttribute {...attr_props} />;
      case 'TextAttribute':
        return <TextAttribute {...attr_props} />;
      case 'LinePlotAttribute':
        return <LinePlotAttribute {...attr_props} />;
      case 'MarkdownAttribute':
        return <MarkdownAttribute {...attr_props} />;
      case 'MetricsAttribute':
        return <MetricsAttribute {...attr_props} />;
      case 'Magma::CollectionAttribute':
        return <CollectionAttribute {...attr_props} />;
      case 'Magma::ForeignKeyAttribute':
      case 'Magma::ChildAttribute':
        return <LinkAttribute {...attr_props} />;
      case 'Magma::TableAttribute':
        return <TableAttribute {...attr_props} />;
      case 'Magma::FileAttribute':
        return <DocumentAttribute {...attr_props} />;
      case 'Magma::ImageAttribute':
        return <ImageAttribute {...attr_props} />;

      case 'Magma::Attribute':
        if(attribute.options) return <SelectAttribute {...attr_props} />;
        switch(attribute.type){
          case 'TrueClass':
            return <CheckboxAttribute {...attr_props} />;
          case 'Integer':
            return <NumericAttribute inputType='int' {...attr_props} />;
          case 'Float':
            return <NumericAttribute inputType='float' {...attr_props} />;
          case 'DateTime':
            return <DateTimeAttribute {...attr_props} />;
          default:
           return <Attribute {...attr_props} />;
        }

      default:
        var msg = 'Could not match attribute '+attribute.name;
        msg += ' with class'+attribute.attribute_class+' to a display class!';
        throw msg;
        return null;
    }
  }
});

module.exports = AttributeViewer;
