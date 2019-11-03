// Framework libraries.
import * as React from 'react';

import Attribute from './attribute';
import SelectAttribute from './select_attribute';
import ImageAttribute from './image_attribute';
import DocumentAttribute from './document_attribute';
import CheckboxAttribute from './checkbox_attribute';
import DateTimeAttribute from './date_time_attribute';
import TableAttribute from './table_attribute';
import MatrixAttribute from './matrix_attribute';
import LinkAttribute from './link_attribute';
import { IntegerAttribute, FloatAttribute } from './numeric_attribute';
import CollectionAttribute from './collection_attribute';
import TextAttribute from './text_attribute';
import {MetricsAttributeContainer as MetricsAttribute} from './metrics_attribute';
import MarkdownAttribute from './markdown_attribute';

import PlotAttribute from './plot_attribute';

export default class AttributeViewer extends React.Component{
  render(){

    let {attribute} = this.props;

    switch(attribute.attribute_class){
      case 'LinePlotAttribute':
      case 'BoxPlotAttribute':
      case 'BarGraphAttribute':
      case 'TimelineGroupPlotAttribute':
      case 'BarPlotAttribute':
      case 'StackedBarPlotAttribute':
      case 'SwarmAttribute':
      case 'HistogramAttribute':
      case 'PlotAttribute':
        return <PlotAttribute {...this.props} />;

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
      case 'Magma::MatrixAttribute':
        return <MatrixAttribute {...this.props} />;

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
        let msg = 'Could not match attribute '+attribute.name;
        msg += ' with class '+attribute.attribute_class+' to a display class!';
        console.log(msg);
        return null;
    }
  }
}
