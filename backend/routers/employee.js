const express = require('express');
const Employee = require('../models/Employee');
const {
  signIn,
  getEmployees,
  getEmployee,
  assignToTeam,
  createEmployee,
} = require('../controllers/employee');
const {
  approveProject,
  declineProject
} = require('../controllers/project');
const { authenticate, isBusinessOwner } = require('../middlewares/auth');
const { isValidEmailInOrganization } = require('../middlewares/employee');
const { validateProjectOwner } = require('../middlewares/project');


const router = express.Router();

// Employee Login
router.post('/sign-in', signIn);

// Create Employee
router.post('/', authenticate, isBusinessOwner, createEmployee);

// Get Employees
router.get('/', authenticate, getEmployees);

// Get Employee
router.get('/:id', authenticate, getEmployee);

// Assign Team to Employee
router.post(
  '/assign-to-team',
  authenticate,
  isValidEmailInOrganization,
  assignToTeam
);

// Approve the project
router.patch(
  '/:id/approve',
  authenticate,
  isBusinessOwner,
  approveProject
);

// Decline the project
router.patch(
  '/:id/decline',
  authenticate,
  isBusinessOwner,
  declineProject
);

module.exports = router;
