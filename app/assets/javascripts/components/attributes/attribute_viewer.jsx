import React, { Component } from 'react';

import Attribute from './attribute';
import MetricsAttribute from './metrics_attribute';
import MarkdownAttribute from './markdown_attribute';
import SelectAttribute from './select_attribute';
import ImageAttribute from './image_attribute';
import DocumentAttribute from './document_attribute';
import CheckboxAttribute from './checkbox_attribute';
import LinePlotAttribute from './line_plot_attribute';
import BoxPlotAttribute from './box_plot_attribute';
import DateTimeAttribute from './date_time_attribute';
import TableAttribute from './table_attribute';
import LinkAttribute from './link_attribute';
import StackedBarPlotAttribute from './stacked_bar_plot_attribute';
import BarPlotAttribute from './bar_plot_attribute';
import BarGraphAttribute from './bar_graph_attribute';
//import HistogramAttribute from './histogram_attribute';
//import SwarmAttribute from './swarm_attribute';
import { IntegerAttribute, FloatAttribute } from './numeric_attribute';
import CollectionAttribute from './collection_attribute';
import TextAttribute from './text_attribute';

export default class AttributeViewer extends Component {
  render() {
    let { attribute } = this.props;

    switch(attribute.attribute_class){
      case 'BarPlotAttribute':
        return <BarPlotAttribute {...this.props} />;
      case 'StackedBarPlotAttribute':
        return <StackedBarPlotAttribute {...this.props} />;
      case 'BarGraphAttribute':
        return <BarGraphAttribute {...this.props} />;
//      case 'HistogramAttribute':
//        return <HistogramAttribute {...this.props} />;
//      case 'SwarmAttribute':
//        return <SwarmAttribute {...this.props} />;
      case 'BoxPlotAttribute':
        return <BoxPlotAttribute {...this.props} />;
      case 'TextAttribute':
        return <TextAttribute {...this.props} />;
      case 'LinePlotAttribute':
        return <LinePlotAttribute {...this.props} />;
      case 'MarkdownAttribute':
        return <MarkdownAttribute {...this.props} />;
      case 'MetricsAttribute':
        return <MetricsAttribute {...this.props} />;
      case 'Magma::CollectionAttribute':
        return <CollectionAttribute {...this.props} />;
      case 'Magma::ForeignKeyAttribute':
      case 'Magma::ChildAttribute':
        return <LinkAttribute {...this.props} />;
      case 'Magma::TableAttribute':
        return <TableAttribute {...this.props} />;
      case 'Magma::FileAttribute':
        return <DocumentAttribute {...this.props} />;
      case 'Magma::ImageAttribute':
        return <ImageAttribute {...this.props} />;

      case 'Magma::Attribute':
        if(attribute.options) return <SelectAttribute {...this.props} />;
        switch(attribute.type){
          case 'TrueClass':
            return <CheckboxAttribute {...this.props} />;
          case 'Integer':
            return <IntegerAttribute {...this.props} />;
          case 'Float':
            return <FloatAttribute {...this.props} />;
          case 'DateTime':
            return <DateTimeAttribute {...this.props} />;
          default:
            return <Attribute {...this.props} />;
        }

      default:
        var msg = 'Could not match attribute '+attribute.name;
        msg += ' with class'+attribute.attribute_class+' to a display class!';
        throw msg;
        return null;
    }
  }
}
