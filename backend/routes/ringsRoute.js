import express from 'express';
import {
    getAllRings,
    createRing,
    deleteRing,
    
} from '../controllers/ringController.js';

const router = express.Router();

router.get('/', getAllRings);
router.post('/', createRing);
router.delete('/:id', deleteRing);

export default router;