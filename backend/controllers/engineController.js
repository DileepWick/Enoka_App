import Engine from '../models/Engine.js';

export const getAllEngines = async (req, res) => {
  try {
    const engines = await Engine.find();
    res.json(engines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Utility function to generate custom IDs with prefix
const generateCustomId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

export const createEngine = async (req, res) => {
  const { engine_name } = req.body;

  try {
    const engine_id = generateCustomId('ENG-');
    const engine = new Engine({ engine_id, engine_name });
    const newEngine = await engine.save();
    res.status(201).json(newEngine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
