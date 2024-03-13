const Project = require('../models/Project');
const Employee = require('../models/Employee');
const CustomError = require('../helper/CustomError');

const createProject = async (req, res) => {
  req.body.organizationId = req.employee.organizationId;
  const project = new Project(req.body);
  await project.save();
  res.status(201).json(project);
};

const deleteProject = async (req, res) => {
  await req.project.remove();
  res.json({ message: 'Deleted Successfully' });
};

const updateProject = async (req, res) => {
  const updates = Object.keys(req.body);
  updates.forEach((update) => {
    req.project[update] = req.body[update];
  });
  await req.project.save();
  res.json(req.project);
};

const applyProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  // var isEmployeeExist = project.teamMembers.filter(tm => {
  //   req.employee._id.equals(tm._id);
  // });
  // if (project.teamMembers.length != 0 && isEmployeeExist) {
  //   throw new CustomError(400, 'Employee already applied!');
  // }
  req.employee.projectId = project._id;
  req.employee.status = "applied";
  await req.employee.save();
  res.json(req.employee);
};

const approveProject = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  employee.status = 'approved';
  // var isEmployeeApproved = project.teamMembers.some(tm => {
  //   return req.employee._id.equals(tm._id) && tm.status === 'approved';
  // });
  // if (project.teamMembers.length != 0 && isEmployeeApproved == true) {
  //   throw new CustomError(400, 'Employee already approved!');
  // }
  // var teamMemberIndex = project.teamMembers.findIndex(tm => tm._id.equals(req.employee._id));

  // if (teamMemberIndex !== -1) {
  //   project.teamMembers[teamMemberIndex].status = 'approved';
  //   await project.save();
  //   console.log('Team member status updated successfully.');
  // }
  await employee.save();
  res.json(employee);
};

const declineProject = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  employee.status = 'not-approved';
  employee.projectId = null;
  // var isEmployeeApproved = project.teamMembers.some(tm => {
  //   return req.employee._id.equals(tm._id) && tm.status === 'approved';
  // });
  // if (project.teamMembers.length != 0 && isEmployeeApproved == true) {
  //   throw new CustomError(400, 'Employee already approved!');
  // }
  // var teamMemberIndex = project.teamMembers.findIndex(tm => tm._id.equals(req.employee._id));

  // if (teamMemberIndex !== -1) {
  //   project.teamMembers[teamMemberIndex].status = 'approved';
  //   await project.save();
  //   console.log('Team member status updated successfully.');
  // }
  await employee.save();
  res.json(employee);
};

const getProject = async (req, res) => {
  const project = await Project.populate(req.project, [
    { path: 'organizationId', select: 'name' },
    { path: 'employees', select: 'firstName lastName phoneNumber email role' }
  ]
  );
  res.json(project);
};

const getProjects = async (req, res) => {
  const projects = await Project.find({
    organizationId: req.employee.organizationId,
  }).sort({ startDate: -1 });

  res.json(projects);
};

const assignTeam = async (req, res) => {
  const isAssigned = req.project.teams.some((id) => id.equals(req.body.teamId));
  const operator = isAssigned ? '$pull' : '$addToSet';
  const message = `${isAssigned ? 'Removed' : 'Assigned'} Successfully`;
  await req.project.updateOne({
    [operator]: {
      teams: req.body.teamId,
    },
  });
  res.json({ message });
};

const fetchEmployees = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('employees');
    res.json(project.employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTeamMembers = async (req, res) => {
  const employee = await Employee.findById(req.body.id);
  employee.projectId = req.params.id;
  employee.status = "approved";
  // console.log(employee);
  try {
  await employee.save();
  res.status(201).json(employee);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

module.exports = {
  createProject,
  deleteProject,
  updateProject,
  getProject,
  getProjects,
  assignTeam,
  applyProject,
  approveProject,
  declineProject,
  fetchEmployees,
  addTeamMembers
};
