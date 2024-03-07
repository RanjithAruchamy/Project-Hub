import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from '../api/axios';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import TeamFormDialog from '../components/TeamFormDialog/TeamFormDialog';
import ConfirmDialog from '../components/Dialogs/ConfirmDialog/ConfirmDialog';
import { deleteTeam } from '../actions/teams';
import MembersPanel from '../components/MemberCard/MembersPanel';
import TeamInfo from '../components/TeamInfo/TeamInfo';
import ProjectPanel from '../components/ProjectPanel/ProjectPanel';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  mt: {
    marginTop: '25px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
  },
  edtBtn: {
    position: 'fixed',
    bottom: '120px',
    right: '40px',
  },
  progress: {
    left: '50%',
    top: '300px',
    marginLeft: '-4em',
    position: 'absolute',
  },
}));

const InterestTeamDetails = ({ match, role, history , projectId}) => {
  const classes = useStyles();
  const [team, setTeam] = useState();
  const [teamMembers, setTeamMembers] = useState();

  const [loading, setLoading] = useState(true);

  const getTeam = async () => {
    console.log("get team")
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/projects/${projectId}/employees`
    );
    if (data) {
      console.log("team data", data)
      setTeam(data);
      setTeamMembers(getTeamMembers(data))
      setLoading(false);
    }
  };

  const onUpdateTeam = () => {
    getTeam();
  };

  const onDeleteTeam = () => {
    axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/teams/${team.id}`);
    deleteTeam(team.id);
    history.replace('/teams');
  };

  useEffect(() => {
    if(projectId) getTeam();
  }, [projectId]);

  useEffect(() => {
    if (team) {
      setTeamMembers(getTeamMembers(team))
    }
  }, [team]);

  return (
    <>
      {loading ? (
        <div className={classes.progress}>
          <CircularProgress color="primary" thickness={4} size={100} />
        </div>
      ) : (
        <Container>
           <Grid item className={classes.mt} xs={4}>
                <MembersPanel
                  teamId={team.id}
                  team={team}
                  Members={teamMembers}
                  title = "Applied Team Members"
                  getTeam = {getTeam}
                  projectId = {projectId}
                ></MembersPanel>
              </Grid>
        </Container>
      )}
    </>
  );
};

const getTeamMembers = (team) => {
  console.log("filter team ",team)
  return team.filter((member) => member.status === 'applied');
}
const mapStateToProps = (state) => ({
  role: state.auth.role,
});
const mapDispatchToProps = (dispatch) => ({
  deleteTeam: (teamId) => dispatch(deleteTeam(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InterestTeamDetails);
