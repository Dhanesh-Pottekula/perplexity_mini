import { chatController } from "../controllers/chatController";
import { Router } from "express";

const chatRouter = Router();

chatRouter.post('/', chatController.chat.bind(chatController));

export default chatRouter;