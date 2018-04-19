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

// The plot components.
import {LinePlotAttributeContainer} from './plot_attributes/line_plot_attribute';
import {BoxPlotAttributeContainer} from './plot_attributes/box_plot_attribute';
import {BarGraphAttributeContainer} from './plot_attributes/bar_graph_attribute';
import {BarPlotAttributeContainer} from './plot_attributes/bar_plot_attribute';
import {StackedBarPlotAttributeContainer} from './plot_attributes/stacked_bar_attribute';
import {SwarmPlotAttributeContainer} from './plot_attributes/swarm_plot_attribute';
import {HistogramAttributeContainer} from './plot_attributes/histogram_attribute';

// The clinical components.
import {DemographicAttributeContainer} from './clinical_attributes/demographic_attribute';
import {DiagnosticAttributeContainer} from './clinical_attributes/diagnostic_attribute';
import {TreatmentAttributeContainer} from './clinical_attributes/treatment_attribute';
import {AdverseEventAttributeContainer} from './clinical_attributes/adverse_event_attribute';

export default class AttributeViewer extends Component{
  render(){
    let {attribute} = this.props;
    switch(attribute.attribute_class){

      // Plot components.
      case 'LinePlotAttribute':
        return <LinePlotAttributeContainer {...this.props} />;
      case 'BoxPlotAttribute':
        return <BoxPlotAttributeContainer {...this.props} />;
      case 'BarGraphAttribute':
        return <BarGraphAttributeContainer {...this.props} />;
      case 'BarPlotAttribute':
        return <BarPlotAttributeContainer {...this.props} />;
      case 'StackedBarPlotAttribute':
        return <StackedBarPlotAttributeContainer {...this.props} />;
      case 'SwarmAttribute':
        return <SwarmPlotAttributeContainer {...this.props} />;
      case 'HistogramAttribute':
        return <HistogramAttributeContainer {...this.props} />;

      // Clinical components.
      case 'DemographicAttribute':
        return <DemographicAttributeContainer {...this.props} />;
      case 'DiagnosticAttribute':
        return <DiagnosticAttributeContainer {...this.props} />;
      case 'TreatmentAttribute':
        return <TreatmentAttributeContainer {...this.props} />;
      case 'AdverseEventAttribute':
        return <AdverseEventAttributeContainer {...this.props} />;

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
