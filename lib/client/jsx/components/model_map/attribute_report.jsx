import React, { useState, Component } from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {requestAnswer} from 'etna-js/actions/magma_actions';
import MapHeading from './map_heading';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

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

const AttributeReport = ({attribute, model_name, counts}) => {
  if (!attribute) return null;

  const dispatch = useDispatch();

  const [ sample, setSample ] = useState(null);

  const showSample = () => {
    requestAnswer({ query: [
      model_name, '::distinct', attribute.attribute_name
    ]})(dispatch).then(
      ({answer}) => setSample(answer)
    )
  }

  const classes = useStyles();

  return <Grid className={ classes.attribute_report }>
    <Card className={ classes.attribute_card} >
      <MapHeading name='Attribute' title={attribute.attribute_name}>
        {
          <Tooltip title='Show data sample'>
            <Button
              onClick={ showSample }
              size='small'
              color='secondary'>Sample</Button>
          </Tooltip>
        }
      </MapHeading>
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
        {
          sample && 
            <Grid container>
              <Grid item xs={3} className={ classes.type }>sample</Grid>
              <Grid item xs={9} className={ classes.value }>{JSON.stringify(sample)}</Grid>
            </Grid>
        }
      </CardContent>
    </Card>
  </Grid>;
}

export default AttributeReport;
