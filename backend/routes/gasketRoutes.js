import express from 'express';
import {
  getAllGaskets,
  createGasket,
  updateGasket,
  deleteGasket,
} from '../controllers/gasketController.js';

const router = express.Router();

router.get('/', getAllGaskets);
router.post('/', createGasket);
router.put('/:id', updateGasket);
router.delete('/:id', deleteGasket);

export default router;
