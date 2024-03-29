import React, { useEffect, useState } from 'react';
import { makeStyles, Modal, Backdrop, Fade, Grid, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import axios from '../../api/axios';

const AddMemberForm = ({ onAdd, open, handleClose, role, openingId, projectId }) => {
    const useStyles = makeStyles(theme => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        submitButton: {
            color: '#fff',
            backgroundColor: '#1976d2',
            '&:hover': {
                backgroundColor: '#115293',
            },
            margin: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employees`)
            .then(response => {
                setOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/projects/${projectId}/openings/${openingId}/addResource`, { id: selectedValue}).then(res => {
      window.location.reload();
    });
        // You can perform additional validation here before sending the data
    };


    return (
        <Modal
            aria-labelledby="add-job-modal"
            aria-describedby="add-job-form"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Add Member
                    </Typography>
                    <form onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexdirection: 'column',
                        margin: '39px',
                        padding: '0px',
                        flexDirection: 'column',
                    }}>
                        <Grid container spacing={40} style={{display: 'flex'}}>
                            <Grid item xs={40} sm={20}>
                                <FormControl variant="outlined" width ='100px'>
                                    <InputLabel id="title-label">Title</InputLabel>
                                    <Select
                                        labelId="title-label"
                                        id="title"
                                        value={selectedValue}
                                        onChange={handleChange}
                                        label="Title"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {options.map(option => (
                                            !option.projectId && (
                                                <MenuItem key={option.id} value={option.id}>{option.firstName} {option.lastName}</MenuItem>
                                            )

                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Button color="primary" variant="contained" type="submit" alignItems="center" style={{marginTop: '20px'}}>Submit</Button>
                    </form>
                </div>
            </Fade>
        </Modal>
    )
}

export default AddMemberForm;