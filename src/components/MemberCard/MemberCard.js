import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import axios from '../../api/axios';

import TeamDetails from '../../pages/TeamDetails';
import cx from 'clsx';

import useStyles from './MemberCardStyle';
import { Link } from 'react-router-dom';

const MemberCard = ({ member, auth, getTeam, projectId }) => {
  const classes = useStyles();
  console.log(`projectId ${projectId}`)
  const handleApprove = async (member) => {
    const { data } = await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${member._id}/approve`);
    if (data) {
      window.location.reload();
    }
  }

  const handleDecline = async (member) => {
    const { data } = await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${member._id}/decline`);
    if (data) {
      window.location.reload();

    }
  }

  return (
    <Grid item>
      <Card
        className={cx(classes.root, classes.flex, classes.cardmargin)}
        elevation={2}
      >
        <CardHeader
          avatar={
            <Avatar
              alt="team member"
              variant="square"
              className={classes.avatar}
            >
              {member.firstName.charAt(0).toUpperCase() +
                member.lastName.charAt(0).toUpperCase()}
            </Avatar>
          }
        />
        <CardContent>
          <Typography
            variant="h6"
            component={Link}
            to={`/profile/${member._id}`}
            className={classes.link}
          >
            {member.firstName + ' ' + member.lastName}
          </Typography>
          <Typography className={classes.mb} color="textSecondary">
            {member.role}
          </Typography>
          <Typography variant="body2" component="p">
            {member.phoneNumber}
            <br />
            {member.email}
          </Typography>
          &nbsp; &nbsp;
          {auth.role === 'business-owner' && member.status === 'applied' && (
            <div style={{ display: 'flex' }}>
              <Button color="primary" variant="contained" onClick={() => handleApprove(member)}>
                Approve
              </Button>
              &nbsp; &nbsp;
              <Button color="secondary" variant="contained" onClick={() => handleDecline(member)}>
                Decline
              </Button>
            </div>
          )}
          {auth.role === 'business-owner' && member.status === 'approved' && (
            <div style={{ display: 'flex' }}>
              <Button color="secondary" variant="contained" onClick={() => handleDecline(member)}>
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MemberCard;
