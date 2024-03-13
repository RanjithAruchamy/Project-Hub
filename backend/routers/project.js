const express = require('express');
const {
  createProject,
  deleteProject,
  updateProject,
  getProject,
  getProjects,
  assignTeam,
  applyProject,
  fetchEmployees,
  addTeamMembers
} = require('../controllers/project');
const {
  createOpening,
  fetchOpenings
} = require('../controllers/openings');
const { authenticate, isBusinessOwner } = require('../middlewares/auth');
const { validateProjectOwner } = require('../middlewares/project');

const router = express.Router();

// Create Project
router.post('/', authenticate, isBusinessOwner, createProject);

// Delete Project
router.delete(
  '/:id',
  authenticate,
  isBusinessOwner,
  validateProjectOwner,
  deleteProject
);

// Update Project
router.patch(
  '/:id',
  authenticate,
  validateProjectOwner,
  isBusinessOwner,
  updateProject
);

// Apply for the project
router.patch(
  '/:id/openings/:openingId/apply',
  authenticate,
  applyProject
);


// Get Project
router.get('/:id', authenticate, validateProjectOwner, getProject);

// Get Projects
router.get('/', authenticate, getProjects);

// Assign Team to Prorject
router.post(
  '/:id/assign-team',
  authenticate,
  isBusinessOwner,
  validateProjectOwner,
  assignTeam
);

// Create Openings
router.post('/:id/openings', authenticate, isBusinessOwner, createOpening);

// Fetch Openings
router.get('/:id/openings', authenticate, fetchOpenings);

// Get team members of a project
router.get('/:id/employees', authenticate, fetchEmployees)

// add team member to a opening
router.post('/:id/openings/:openingId/addResource', authenticate, isBusinessOwner, addTeamMembers);

module.exports = router;
