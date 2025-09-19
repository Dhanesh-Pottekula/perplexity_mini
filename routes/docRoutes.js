import { Router } from "express";
import { addDoc, search } from "../controllers/docController.js";

const router = Router();

router.post("/add-doc", addDoc);
router.post("/search", search);

export default router;


