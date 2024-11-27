import express from 'express';
import { getAllEngines, createEngine } from '../controllers/engineController.js';

const router = express.Router();

router.get('/', getAllEngines);
router.post('/', createEngine);

export default router;
