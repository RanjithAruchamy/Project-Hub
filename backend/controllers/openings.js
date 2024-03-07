const Openings = require('../models/Openings');

const createOpening = async (req, res) => {
    const openings = new Openings({
        ...req.body,
        organizationId: req.employee.organizationId,
        projectId: req.params.id
      });
      await openings.save();
      res.status(201).json(openings);
};

const fetchOpenings = async (req, res) => {
  const projectId = req.params.id;
  console.log(projectId);
    try {
        const openings = await Openings.find({ projectId: projectId });
        res.status(200).json(openings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOpenings = async(req, res) => {
const openings = await Openings.find({
    organizationId: req.employee.organizationId,
  }).sort({ startDate: -1 });

  res.json(openings);
}

const deleteOpening = async (req, res) => {
  const opening = await Openings.findById(req.params.id);
  await opening.remove();
  res.json({ message: 'Deleted Successfully' });
};

module.exports = {
  createOpening,
  fetchOpenings,
  getAllOpenings,
  deleteOpening
};
