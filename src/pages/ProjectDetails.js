import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';


import CreateIcon from '@material-ui/icons/Create';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BusinessIcon from '@material-ui/icons/Business';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TimelineIcon from '@material-ui/icons/Timeline';
import GroupIcon from '@material-ui/icons/Group';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ConfirmDialog from '../components/Dialogs/ConfirmDialog/ConfirmDialog';
import ProjectDetailsCard from '../components/ProjectDetailsCard/ProjectDetailsCard';
import ProjectFormDialog from '../components/ProjectFormDialog/ProjectFormDialog';
import {
  toggleTeam,
  deleteProjectSuccess,
  getProjectById,
} from '../actions/projects';
import { fetchTeams } from '../actions/teams';
import { assignTeamToProject } from '../api/projectHelpers';

import moment from 'moment';
import { toast } from 'react-toastify';
import formatter from '../helper/currencyFormater';
import TeamDetails from './TeamDetails';
import InterestTeamDetails from './InterestTeamDetails';
import JobOpeningsTable from './OpeningsAdminOrUser/Openings';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    justifyContent: 'space-evenly',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  deleteBtn: {
    right: '40px',
    bottom: '112px',
    position: 'fixed',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  progress: {
    left: '50%',
    top: '300px',
    marginLeft: '-4em',
    position: 'absolute',
  },
  panel: {
    marginBottom: theme.spacing(3),
  },
  mr: {
    marginRight: theme.spacing(2),
  },
}));

const ProjectDetails = ({
  teams,
  toggleTeam,
  match,
  deleteProjectSuccess,
  history,
  getProjectById,
  fetchTeams,
  role,
  propAssignedProjectId
}) => {
  const [switchState, setSwitchState] = useState({});
  const [project, setProject] = useState(null);
  const [load, setLoad] = useState(true);

  const { id: projectId } = match.params;

  const classes = useStyles();
  useEffect(() => {
    (async () => {
      const teamsData = await fetchTeams();
      getProjectById().then((res) => {
        setProject(res.data);
        const switchBtnsState = teamsData.reduce((acc, team) => {
          acc[`teamCheck-${team._id}`] = res.data?.teams?.includes(team._id)
            ? true
            : false;
          return acc;
        }, {});
        setSwitchState(switchBtnsState);
        setLoad(false);
      });
    })();
  }, [propAssignedProjectId]);

  const handleProjectUpdate = (project) => {
    setProject(project);
  };

  const handleChange = (event) => {
    setSwitchState({
      ...switchState,
      [event.target.name]: event.target.checked,
    });
    //toggleTeam(+event.target.value, +match.params.id);
    if (event.target.checked) {
      toast.success('Team assigned successfuly to this project');
    } else {
      toast.warn('Team removed!');
    }
    assignTeamToProject(match.params.id, event.target.value)
      .then((res) => console.log(res))
      .catch((err) => toast.error('Something went wrong please try again!'));
  };

  const handelDelete = () => {
    deleteProjectSuccess().then((res) => {
      toast.success(res.data.message);
      history.replace('/projects');
    });
  };

  let pageLoading = (
    <div className={classes.progress}>
      <CircularProgress color='primary' thickness={4} size={100} />
    </div>
  );
  if (!load) {
    pageLoading = (
      <Fragment>
        <Typography variant='h2' gutterBottom align='center'>
          Project Overview
        </Typography>
        <Grid container  className={classes.gridContainer} spacing={6}>
          <Grid item xs={12} md={6}>
            <ProjectDetailsCard
              title='Project Name'
              description={project.title}
            >
              <CreateIcon
                color='secondary'
                fontSize='large'
                className={classes.icon}
              ></CreateIcon>
            </ProjectDetailsCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ProjectDetailsCard
              title='Organization/Company'
              description={project.organizationId.name}
            >
              <BusinessIcon
                color='secondary'
                fontSize='large'
                className={classes.icon}
              />
            </ProjectDetailsCard>
          </Grid>
          <Grid item xs={12}>
            <ProjectDetailsCard
              title='Description'
              description={project.description}
            >
              <AssignmentIcon
                color='secondary'
                fontSize='large'
                className={classes.icon}
              />
            </ProjectDetailsCard>
          </Grid>
          {/* <Grid item xs={12} md={3} sm={6}>
            <ProjectDetailsCard
              title='Budget'
              description={formatter.format(project.budget)}
            >
              <MonetizationOnIcon
                color='secondary'
                fontSize='large'
                className={classes.icon}
              />
            </ProjectDetailsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectDetailsCard title='State' description={project.state}>
              <TimelineIcon
                color='secondary'
                fontSize='large'
                className={classes.icon}
              />
            </ProjectDetailsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectDetailsCard
              title='Deadline'
              description={
                <time
                  date={moment(new Date(project.deadLine)).format('YYYY-MM-DD')}
                >
                  {moment(new Date(project.deadLine)).format('D MMMM YYYY')}
                </time>
              }
            >
              <ScheduleIcon
                color='secondary'
                fontSize='large'
                className={classes.icon}
              />
            </ProjectDetailsCard>
          </Grid> */}
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-start'}}>
           <TeamDetails projectId={projectId}/>
           {role === 'business-owner' && (
           <InterestTeamDetails projectId={projectId} />)}
          </Grid>
        </Grid>
        <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-start'}}>
        {/* <Card variant="outlined"> */}
        <JobOpeningsTable projectId={projectId || null} role={role} propAssignedProjectId={propAssignedProjectId}/>       
         {/* </Card> */}
        </Grid>
        
        {role === 'business-owner' && (
          <Fragment>
            <ProjectFormDialog
              isEdit={true}
              editingProject={project}
              handleProjectUpdate={handleProjectUpdate}
            />
            <div className={classes.deleteBtn}>
              <ConfirmDialog
                title='Delete Project'
                content='Are you sure you want to delete this Project?'
                onConfirm={handelDelete}
              >
                <DeleteIcon />
              </ConfirmDialog>
            </div>{' '}
          </Fragment>
        )}
      </Fragment>
    );
  }

  return <Container>{pageLoading}</Container>;
};

const mapStateToProps = (state, ownProps) => ({
  teams: state.teams,
  role: state.auth.role,
  propAssignedProjectId: state.auth.projectId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleTeam: (teamId, projectId) => dispatch(toggleTeam(teamId, projectId)),
  deleteProjectSuccess: () =>
    dispatch(deleteProjectSuccess(ownProps.match.params.id)),
  getProjectById: () => dispatch(getProjectById(ownProps.match.params.id)),
  fetchTeams: () => dispatch(fetchTeams()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
