import express from 'express';
import {
  getAllEngines,
  createEngine,
  updateEngine,
  deleteEngine,
} from '../controllers/engineController.js';

const router = express.Router();

router.get('/', getAllEngines);
router.post('/', createEngine);
router.put('/:engine_id', updateEngine);
router.delete('/:engine_id', deleteEngine);

export default router;
