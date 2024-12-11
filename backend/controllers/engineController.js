import Engine from '../models/Engine.js';

// Utility function to generate custom IDs with prefix
const generateCustomId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

// Get all engines
export const getAllEngines = async (req, res) => {
  try {
    const engines = await Engine.find();
    res.json(engines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new engine
export const createEngine = async (req, res) => {
  const { engine_name } = req.body;

  try {
    const existingEngine = await Engine.findOne({ engine_name });
    if (existingEngine) {
      return res.status(400).json({ message: "Engine name already exists." });
    }

    const engine_id = generateCustomId('ENG-');
    const engine = new Engine({ engine_id, engine_name });
    const newEngine = await engine.save();
    res.status(201).json(newEngine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an engine by ID
export const updateEngine = async (req, res) => {
  const { engine_id } = req.params;
  const { engine_name } = req.body;

  try {
    const engine = await Engine.findOne({ engine_id });
    if (!engine) {
      return res.status(404).json({ message: "Engine not found." });
    }

    engine.engine_name = engine_name;
    const updatedEngine = await engine.save();
    res.json(updatedEngine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an engine by ID
export const deleteEngine = async (req, res) => {
  const { engine_id } = req.params;

  try {
    const engine = await Engine.findOneAndDelete({ engine_id });
    if (!engine) {
      return res.status(404).json({ message: "Engine not found." });
    }

    res.json({ message: "Engine deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
