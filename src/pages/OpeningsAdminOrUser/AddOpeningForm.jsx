import React, { useState } from 'react';
import { makeStyles, Modal, Backdrop, Fade, Grid, TextField, Button, Typography } from '@material-ui/core';

const AddOpeningForm = ({ onAdd, open, handleClose, role}) => {
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
    const [jobData, setJobData] = useState({
        title: '',
        location: '',
        description: '',
        openings: '',
        skills: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData({
            ...jobData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can perform additional validation here before sending the data
        onAdd(jobData);
        // Clear the form after submission
        setJobData({
            title: '',
            location: '',
            description: '',
            openings: '',
            skills: ''
        });
    };

    { console.log(open) }

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
                Add Opening
            </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="title"
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    value={jobData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="location"
                                    label="Location"
                                    variant="outlined"
                                    fullWidth
                                    value={jobData.location}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    value={jobData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="skills"
                                    label="Skills"
                                    variant="outlined"
                                    fullWidth
                                    value={jobData.skills}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="openings"
                                    label="Openings"
                                    variant="outlined"
                                    fullWidth
                                    value={jobData.openings}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button color="primary" variant="contained" type="submit" className={classes.submitButton}>Submit</Button>
                    </form>
                </div>
            </Fade>
        </Modal>
    )
}

export default AddOpeningForm;