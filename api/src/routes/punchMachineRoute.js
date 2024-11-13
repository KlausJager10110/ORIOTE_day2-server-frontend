import express from "express";
const router = express.Router();

import { addPunchMachineData, getPunchMachineData, updatePunchMachineData, deletePunchMachineData, getPunchMachineDataById } from "../controllers/punchMachineController.js";
router.get('/', getPunchMachineData);
router.get('/:id', getPunchMachineDataById);
router.post('/', addPunchMachineData);
router.put('/:id', updatePunchMachineData);
router.delete('/:id', deletePunchMachineData);

export default router