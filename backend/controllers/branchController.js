import Branch from '../models/Branch.js';

// Utility function to generate custom IDs with prefix
const generateCustomId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

// Get all branches
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new branch
export const createBranch = async (req, res) => {
  const { name, location } = req.body;

  try {
    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
      return res.status(400).json({ message: "Branch name already exists." });
    }

    const branch_id = generateCustomId('BRANCH-');
    const branch = new Branch({ branch_id, name, location });
    const newBranch = await branch.save();
    res.status(201).json(newBranch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a branch by ID
export const updateBranch = async (req, res) => {
  const { branch_id } = req.params;
  const { name, location } = req.body;

  try {
    const branch = await Branch.findOne({ branch_id });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    branch.name = name || branch.name;
    branch.location = location || branch.location;
    const updatedBranch = await branch.save();
    res.json(updatedBranch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a branch by ID
export const deleteBranch = async (req, res) => {
  const { branch_id } = req.params;

  try {
    const branch = await Branch.findOneAndDelete({ branch_id });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    res.json({ message: "Branch deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
