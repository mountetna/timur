import React, {useState, useEffect, useContext} from 'react';
import * as _ from 'lodash';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu, {MenuProps} from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import BarChart from '@material-ui/icons/BarChart';
import ScatterPlot from '@material-ui/icons/ScatterPlot';

import {SvgIconTypeMap} from '@material-ui/core/SvgIcon';
import {OverridableComponent} from '@material-ui/core/OverridableComponent';

import {QueryColumnContext} from '../../contexts/query/query_column_context';
import {QueryResultsContext} from '../../contexts/query/query_results_context';
import {fetchWorkflows, createAndOpenFigure} from '../../api/vulcan_api';
import {Workflow} from '../../contexts/query/query_types';
import {
  queryPayload,
  createFigurePayload
} from '../../selectors/query_selector';

const PlotIcons: {
  [key: string]: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
} = {
  BarChart: BarChart,
  ScatterPlot: ScatterPlot
};

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: '5px',
    display: 'inline-block'
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const QueryPlotMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [plottingWorkflows, setPlottingWorkflows] = useState([] as Workflow[]);

  const {
    state: {columns}
  } = useContext(QueryColumnContext);
  const {
    state: {expandMatrices, queryString}
  } = useContext(QueryResultsContext);

  const classes = useStyles();

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchWorkflows().then(({workflows}) => {
      setPlottingWorkflows(workflows);
    });
  }, []);

  function handleOnClickMenuItem(workflow: Workflow) {
    createAndOpenFigure(
      workflow,
      createFigurePayload({
        query: queryPayload({query: queryString, columns, expandMatrices}),
        workflow,
        title: `${workflow.displayName} - from query`
      })
    );
  }

  if (plottingWorkflows?.length === 0) return null;

  return (
    <div className={classes.button}>
      <Button
        aria-controls='plot-menu'
        aria-haspopup='true'
        variant='contained'
        color='primary'
        onClick={handleClickMenu}
      >
        Plot as
      </Button>
      <StyledMenu
        id='plot-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {plottingWorkflows.map((workflow: Workflow, index: number) => {
          let IconComponent =
            workflow.icon && workflow.icon in PlotIcons
              ? PlotIcons[workflow.icon]
              : MultilineChartIcon;

          return (
            <StyledMenuItem
              key={index}
              onClick={() => handleOnClickMenuItem(workflow)}
            >
              <ListItemIcon>
                <IconComponent fontSize='small' />
              </ListItemIcon>
              <ListItemText primary={workflow.displayName} />
            </StyledMenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
};

export default QueryPlotMenu;
