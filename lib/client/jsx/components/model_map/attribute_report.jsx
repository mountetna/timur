import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import MapHeading from './map_heading';

const ATT_ATTS = [
  'attribute_type',
  'link_model_name',
  'description',
  'display_name',
  'format_hint',
  'attribute_group',

  'validation_type',
  'validation',

  'restricted',
  'read_only',
  'hidden'
];

const useStyles = makeStyles((theme) => ({
  clauseTitle: {
    fontSize: '1.2rem'
  },
  attribute_report: {
    height: '50%',
    borderTop: '1px solid #bbb'
  },
  attribute_card: {
    background: '#eee',
    padding: '15px',
    height: 'calc(100% - 30px)'
  },
  content: {
    height: 'calc(100% - 64px)',
    overflowY: 'auto'
  },
  type: {
    color: 'gray'
  },
  value: {
    color: '#131',
    borderBottom: '1px solid rgba(34, 139, 34, 0.1)',
    maxHeight: '90px',
    overflowY: 'auto'
  }
}));

const AttributeReport = ({attribute, counts}) => {
  if (!attribute) return null;

  const classes = useStyles();

  return <Grid className={ classes.attribute_report }>
    <Card className={ classes.attribute_card} >
      <MapHeading name='Attribute' title={attribute.attribute_name}/>
      <CardContent className={ classes.content }>
        {
          ATT_ATTS.map(att => {
            switch(att) {
              case 'validation':
                return [ att, attribute.validation ? JSON.stringify(attribute.validation.value) : null ];
              case 'validation_type':
                return [ att, attribute.validation?.type ]
              default:
                return [ att, attribute[att] ];
            }
          }).filter( ([name,value]) => value).map( ([name, value]) =>
            <Grid container key={name}>
              <Grid item xs={3} className={ classes.type }>{name}</Grid>
              <Grid item xs={9} className={ classes.value }>{value}</Grid>
            </Grid>
          )
        }
      </CardContent>
    </Card>
  </Grid>;
}

export default AttributeReport;
