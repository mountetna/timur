import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo
} from 'react';
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

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {showMessages} from 'etna-js/actions/message_actions';
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
  },
  disabledButton: {
    marginLeft: '5px',
    display: 'inline-block',
    cursor: 'not-allowed'
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

const usePlotActions = ({
  plotLoading,
  setPlotLoading
}: {
  plotLoading: boolean[];
  setPlotLoading: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const invoke = useActionInvoker();
  const {
    state: {columns}
  } = useContext(QueryColumnContext);
  const {
    state: {expandMatrices, queryString}
  } = useContext(QueryResultsContext);

  const openPlot = useCallback(
    (workflow: Workflow, index: number) => {
      let clone = [...plotLoading];
      let original = [...plotLoading];
      clone.splice(index, 1, true);
      setPlotLoading(clone);
      createAndOpenFigure(
        createFigurePayload({
          query: queryPayload({query: queryString, columns, expandMatrices}),
          workflow,
          title: `${workflow.displayName} - from query`
        })
      )
        .then(() => {
          setPlotLoading(original);
        })
        .catch((e) => invoke(showMessages([e])));
    },
    [plotLoading, setPlotLoading, columns, expandMatrices, queryString, invoke]
  );

  return {
    openPlot
  };
};

const MultiplePlotOptionsMenu = ({
  workflows,
  disabled
}: {
  workflows: Workflow[];
  disabled: boolean;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [plotLoading, setPlotLoading] = useState(
    Array(workflows.length).fill(false)
  );
  const {openPlot} = usePlotActions({plotLoading, setPlotLoading});

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnClickMenuItem = useCallback(
    (workflow: Workflow, index: number) => {
      openPlot(workflow, index);
    },
    [openPlot]
  );

  return (
    <>
      <Button
        aria-controls='plot-menu'
        aria-haspopup='true'
        variant='contained'
        color='primary'
        onClick={handleClickMenu}
        disabled={disabled}
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
        {workflows.map((workflow: Workflow, index: number) => {
          let IconComponent =
            workflow.icon && workflow.icon in PlotIcons
              ? PlotIcons[workflow.icon]
              : MultilineChartIcon;

          return (
            <StyledMenuItem
              key={index}
              disabled={disabled || plotLoading[index]}
              onClick={() => {
                if (!plotLoading[index]) handleOnClickMenuItem(workflow, index);
              }}
            >
              <ListItemIcon>
                <IconComponent fontSize='small' />
              </ListItemIcon>
              <ListItemText primary={workflow.displayName} />
            </StyledMenuItem>
          );
        })}
      </StyledMenu>
    </>
  );
};

const SinglePlotButton = ({
  workflow,
  disabled
}: {
  workflow: Workflow;
  disabled: boolean;
}) => {
  const [plotLoading, setPlotLoading] = useState([false]);
  const {openPlot} = usePlotActions({plotLoading, setPlotLoading});

  const handleOnClick = useCallback(() => {
    openPlot(workflow, 0);
  }, [openPlot, workflow]);

  return (
    <Button
      aria-controls='plot-menu'
      aria-haspopup='true'
      variant='contained'
      color='primary'
      onClick={handleOnClick}
      startIcon={<MultilineChartIcon />}
      disabled={disabled || plotLoading[0]}
    >
      Plot
    </Button>
  );
};

const QueryPlotMenu = () => {
  const [plottingWorkflows, setPlottingWorkflows] = useState([] as Workflow[]);

  const invoke = useActionInvoker();

  const classes = useStyles();

  useEffect(() => {
    fetchWorkflows()
      .then(({workflows}) => {
        setPlottingWorkflows(workflows);
      })
      .catch((e) => invoke(showMessages(Array.isArray(e) ? e : [e])));
  }, []);

  const buttonDisabled = !plottingWorkflows || plottingWorkflows.length === 0;

  const useSingletonButton = useMemo(() => {
    return plottingWorkflows.length <= 1;
  }, [plottingWorkflows]);

  return (
    <div className={buttonDisabled ? classes.disabledButton : classes.button}>
      {useSingletonButton ? (
        <SinglePlotButton
          workflow={plottingWorkflows[0]}
          disabled={buttonDisabled}
        />
      ) : (
        <MultiplePlotOptionsMenu
          disabled={buttonDisabled}
          workflows={plottingWorkflows}
        />
      )}
    </div>
  );
};

export default QueryPlotMenu;
