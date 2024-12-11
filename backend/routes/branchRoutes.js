import express from 'express';
import { getAllBranches, createBranch, updateBranch, deleteBranch } from '../controllers/branchController.js';

const router = express.Router();

router.get('/', getAllBranches);
router.post('/', createBranch);
router.put('/:brand_id', updateBranch);
router.delete('/:brand_id', deleteBranch);

export default router;
