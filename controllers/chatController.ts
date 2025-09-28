import { Request, Response } from "express";
import { RetrivalAgent } from "../agents/retrivalAgent";
import { prepareSse, sendSseError, streamSse } from "../helpers/apiHelpers";



export class ChatController {
    private readonly retrivalAgent: RetrivalAgent;
    constructor() {
        this.retrivalAgent = new RetrivalAgent();
    }

    async chat(req: Request, res: Response): Promise<void> {
        const queryParam = req.query.query;
        const bodyQuery = (req.body || {}).query;
        const query = typeof queryParam === "string" ? queryParam : bodyQuery;

        if (!query) {
            prepareSse(res);
            sendSseError(res, "Query is required");
            return;
        }

        try {
            await streamSse(req, res, async () => {
                const stream = await this.retrivalAgent.retrieve_relevant_content(query);
                return stream;
            }, {
                errorMessage: () => "Failed to generate chat",
            });
        } catch (error) {
            console.error("Error generating chat:", error);
        }
    }
}

// Export a singleton instance
export const chatController = new ChatController();
