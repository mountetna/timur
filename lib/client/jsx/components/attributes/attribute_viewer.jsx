// Framework libraries.
import * as React from 'react';

import {MetricsAttributeContainer as MetricsAttribute} from './metrics_attribute';
import TableAttribute from './table_attribute';

// Standard attributes.
import {AttributeContainer as Attribute} from './attribute';
import {CheckboxAttributeContainer as CheckboxAttribute} from './checkbox_attribute';
import {ClinicalAttributeContainer as ClinicalAttribute} from './clinical_attribute';
import {CollectionAttributeContainer as CollectionAttribute} from './collection_attribute';
import {DateTimeAttributeContainer as DateTimeAttribute} from './date_time_attribute';
import {DocumentAttributeContainer as DocumentAttribute} from './document_attribute';
import {FloatAttributeContainer as FloatAttribute} from './float_attribute';
import {ImageAttributeContainer as ImageAttribute} from './image_attribute';
import {IntegerAttributeContainer as IntegerAttribute} from './integer_attribute';
import {LinkAttributeContainer as LinkAttribute} from './link_attribute';
import {MarkdownAttributeContainer as MarkdownAttribute} from './markdown_attribute';
import {SelectAttributeContainer as SelectAttribute} from './select_attribute';
import {TextAttributeContainer as TextAttribute} from './text_attribute';

// The plots.
import {LinePlotAttributeContainer as LinePlotAttribute} from './plot_attributes/line_plot_attribute';
import {BoxPlotAttributeContainer as BoxPlotAttribute} from './plot_attributes/box_plot_attribute';
import {BarGraphAttributeContainer as BarGraphAttribute} from './plot_attributes/bar_graph_attribute';
import {BarPlotAttributeContainer as BarPlotAttribute} from './plot_attributes/bar_plot_attribute';
import {StackedBarPlotAttributeContainer} from './plot_attributes/stacked_bar_attribute';
import {SwarmPlotAttributeContainer as SwarmPlotAttribute} from './plot_attributes/swarm_plot_attribute';
import {HistogramAttributeContainer as HistogramAttribute} from './plot_attributes/histogram_attribute';

export default class AttributeViewer extends React.Component{
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
        return <HistogramAttribute {...this.props} />;

      case 'DemographicAttribute':
      case 'DiagnosticAttribute':
      case 'TreatmentAttribute':
      case 'AdverseEventAttribute':
        return <ClinicalAttribute  {...this.props} />;

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
        console.log(msg);
        return null;
    }
  }
}
