import { Router } from "express";
import { createTicket, getTicket } from "../../controllers/purchase.controller.js";


const router = Router();

router.get('/', getTicket)

router.post('/', createTicket);

export default router;