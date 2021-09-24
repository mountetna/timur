// From https://material-ui.com/components/switches/#CustomizedSwitches.tsx
import React from 'react';
import {withStyles, Theme, createStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex'
    },
    switchBase: {
      padding: 2,
      color: theme.palette.common.white,
      '&$checked': {
        color: theme.palette.common.white,
        transform: 'translateX(12px)',
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main
        }
      }
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none'
    },
    track: {
      opacity: 1,
      backgroundColor: theme.palette.secondary.main
    },
    checked: {}
  })
)(Switch);

const useStyles = makeStyles((theme) => ({
  container: {
    marginRight: '30px'
  }
}));

export default ({
  leftOption,
  rightOption,
  checked,
  onChange,
  name
}: {
  leftOption: string;
  rightOption: string;
  checked: boolean;
  onChange: (event: any, checked: boolean) => void;
  name: string;
}) => {
  const classes = useStyles();

  return (
    <Typography component='div' className={classes.container}>
      <Grid component='label' container alignItems='center' spacing={1}>
        <Grid item>{leftOption}</Grid>
        <Grid item>
          <AntSwitch checked={checked} onChange={onChange} name={name} />
        </Grid>
        <Grid item>{rightOption}</Grid>
      </Grid>
    </Typography>
  );
};
