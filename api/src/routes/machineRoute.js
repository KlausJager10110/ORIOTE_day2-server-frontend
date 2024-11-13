import express from "express";
const router = express.Router();

import { getAllMachines } from "../controllers/machineController.js";

router.get('/', getAllMachines);
router.post('/', () => { });
router.put('/', () => { });
router.delete('/', () => { });

export default router