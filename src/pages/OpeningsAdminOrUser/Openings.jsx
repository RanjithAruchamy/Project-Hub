import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import {
  Grid,
  Typography,
  Button,
  makeStyles,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import AddOpeningForm from './AddOpeningForm';
import AddMemberForm from './AddMemberForm';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
}));

const JobOpeningsTable = ({ projectId, role, propAssignedProjectId }) => {

  const classes = useStyles();
  const [jobOpenings, setJobOpenings] = useState([]);
  const [showhide, setshowHide] = useState(false);
  const [assignedProjectId, setAssignedProjectId] = useState(propAssignedProjectId);
  const [showMemberForm, setShowMemberForm] = useState(false);

  console.log("assignedProjectId",assignedProjectId, role);

  const getApi = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/projects/${projectId}/openings`).then(res => setJobOpenings(res.data));
  }

  useEffect(() => {
    if (projectId) getApi();
  }, [projectId, assignedProjectId])

  const handleAddOpening = (newOpening) => {
    setshowHide(true);
    axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/projects/${projectId}/openings`, newOpening).then(res => {
      if (!res.data) toast.error('Unable to add opening!');
      toast.success(`${newOpening.title} is added!`);
    });
    setshowHide(false);
    getApi();
    window.location.reload();

  };

  const handleAddMember = (newOpening) => {
    setshowHide(true);
    axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/projects/${projectId}/openings`, newOpening);
    setshowHide(false);
    getApi();
  };

  const handleApply = (id) => {
    axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/projects/${projectId}/openings/${id}/apply`).then(res => {
      getApi();
    });
  }

  axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${JSON.parse(localStorage.user).id}`).then(res => {
    setAssignedProjectId(res.data.projectId);
  });

  const handleDelete = (id) => {
    axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/openings/${id}`).then(res => {
      getApi()
    });
  }

  const handleOpen = () => {
    setshowHide(true);
  }

  const handleClick = (id) => {
    setShowMemberForm(true);
    
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h6">
            Openings
          </Typography>
        </Grid>
        <Grid item xs={6} container style={{ display: 'flex', justifyContent: "flex-end" }}>
        {role === 'business-owner' && (
          <Button color="primary" variant="contained" onClick={handleOpen}>
            Add
          </Button>
        )}
        </Grid>
      </Grid>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Description</TableCell>
            {/* <TableCell>Opening</TableCell> */}
            <TableCell>Skills</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobOpenings.map(opening => (
            <TableRow key={opening.id}>
              <TableCell>{opening.title}</TableCell>
              <TableCell>{opening.location}</TableCell>
              <TableCell>{opening.description}</TableCell>
              {/* <TableCell>{opening.openings}</TableCell> */}
              <TableCell>{opening.skills}</TableCell>
              <TableCell>
                  {role === 'business-owner' && (
                    <>
                    <Button color="primary" variant="contained" onClick={() => handleClick(opening.id)}>
                      Add Member
                    </Button>
                    <>
                      <AddMemberForm open={showMemberForm} handleClose={() => setShowMemberForm(false)} onAdd={handleAddMember} role={role} openingId={opening.id} projectId={projectId}/>
                    </>
                    &nbsp; &nbsp;
                    <Button color="primary" variant="contained" onClick={() => handleDelete(opening.id)}>
                      Delete
                    </Button>
                    </>
                  )}
                  {role === 'employee' && (
                  <div>
                    {!assignedProjectId ? (
                      <Button color="primary" variant="contained" disabled={assignedProjectId != null} onClick={() => handleApply(opening.id)}>
                        Apply
                      </Button>
                    ) : (
                      <abbr title="You have already applied for a project!">
                        <Button color="primary" variant="contained" disabled={assignedProjectId != null}  onClick={() => handleApply(opening.id)}>
                          Apply
                        </Button>
                      </abbr>
                    )}
                  </div>
                )}

            </TableCell>
             </TableRow>
          ))}
        </TableBody>
      </Table>
      <>
        <AddOpeningForm open={showhide} handleClose={() => setshowHide(false)} onAdd={handleAddOpening} role={role} />
      </>


    </div >
  );
};

export default JobOpeningsTable;
