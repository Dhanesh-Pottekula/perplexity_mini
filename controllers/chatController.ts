import { Request, Response } from 'express';
import { urlService } from '../services/urlService';
import { sendErrorResponse } from '../helpers/responseHelpers';
import { RetrivalAgent } from '../agents/retrivalAgent';



export class ChatController {
    private readonly retrivalAgent: RetrivalAgent;
    constructor() {
        this.retrivalAgent = new RetrivalAgent();
    }

    async chat(req: Request, res: Response): Promise<any> {
        try {
            const { query } = req.body;

            const chat = await this.retrivalAgent.retrieve_relevant_content(query);
            console.log("chat", chat);
            res.status(200).json({
                success: true,
                message: 'Chat generated successfully',
                data: chat
            });
        } catch (error) {
            console.error('Error generating chat:', error);
            sendErrorResponse(res, 400, 'Failed to generate chat');
        }
    }
}

// Export a singleton instance
export const chatController = new ChatController();
