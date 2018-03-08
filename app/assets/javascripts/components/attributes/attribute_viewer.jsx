import React, { Component } from 'react';

import Attribute from './attribute';
import MarkdownAttribute from './markdown_attribute';
import SelectAttribute from './select_attribute';
import ImageAttribute from './image_attribute';
import DocumentAttribute from './document_attribute';
import CheckboxAttribute from './checkbox_attribute';
import DateTimeAttribute from './date_time_attribute';
import TableAttribute from './table_attribute';
import LinkAttribute from './link_attribute';
import { IntegerAttribute, FloatAttribute } from './numeric_attribute';
import CollectionAttribute from './collection_attribute';
import TextAttribute from './text_attribute';
import {MetricsAttributeContainer as MetricsAttribute} from './metrics_attribute';

// The plots.
import {LinePlotAttributeContainer as LinePlotAttribute} from './plot_attributes/line_plot_attribute';
import {BoxPlotAttributeContainer as BoxPlotAttribute} from './plot_attributes/box_plot_attribute';
import {BarGraphAttributeContainer as BarGraphAttribute} from './plot_attributes/bar_graph_attribute';
import {BarPlotAttributeContainer as BarPlotAttribute} from './plot_attributes/bar_plot_attribute';
import {StackedBarPlotAttributeContainer} from './plot_attributes/stacked_bar_attribute';
import {SwarmPlotAttributeContainer as SwarmPlotAttribute} from './plot_attributes/swarm_plot_attribute';
import {HistogramAttributeContainer as HistogramAttribute} from './plot_attributes/histogram_attribute';

export default class AttributeViewer extends Component{
  render(){
    let {attribute} = this.props;

    switch(attribute.attribute_class){
      case 'LinePlotAttribute':
        return <LinePlotAttribute {...this.props} />;
      case 'BoxPlotAttribute':
        return <BoxPlotAttribute {...this.props} />;
      case 'BarGraphAttribute':
        return <BarGraphAttribute {...this.props} />;
      case 'BarPlotAttribute':
        return <BarPlotAttribute {...this.props} />;
      case 'StackedBarPlotAttribute':
        return <StackedBarPlotAttributeContainer {...this.props} />;
      case 'SwarmAttribute':
        return <SwarmPlotAttribute {...this.props} />;
      case 'HistogramAttribute':
        return null;//<HistogramAttribute {...this.props} />;

      case 'BoxPlotAttribute':
        return <BoxPlotAttribute {...this.props} />;
      case 'TextAttribute':
        return <TextAttribute {...this.props} />;
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
        msg += ' with class '+attribute.attribute_class+' to a display class!';
        throw msg;
        return null;
    }
  }
}
