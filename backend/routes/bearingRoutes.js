import express from 'express';
import {
    getAllBearings,
    createBearing,
    deleteBearing,
} from '../controllers/bearingController.js';

const router = express.Router();

router.get('/', getAllBearings);
router.post('/', createBearing);
router.delete('/:id', deleteBearing);

export default router;