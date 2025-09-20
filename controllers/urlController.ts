import { Request, Response } from 'express';
import { urlService } from '../services/urlService';
import { sendErrorResponse } from '../helpers/responseHelpers';



export class UrlController {
  /**
   * Add a single URL to the queue
   * POST /api/urls
   */
  async addUrl(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;
      if (!url) {
        sendErrorResponse(res, 400, 'URL is required in request body');
        return;
      }

      const queueLength = await urlService.addUrlToQueue(url);

      res.status(201).json({
        success: true,
        message: 'URL added to queue successfully',
        data: {
          url,
          queueLength
        }
      });
    } catch (error) {
      console.error('Error adding URL to queue:', error);
      sendErrorResponse(res, 400, error instanceof Error ? error.message : 'Failed to add URL to queue');
    }
  }

  /**
   * Add multiple URLs to the queue
   * POST /api/urls/batch
   */
  async addUrls(req: Request, res: Response): Promise<void> {
    try {
      const { urls } = req.body;

      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        sendErrorResponse(res, 400, 'URLs array is required and must not be empty');
        return;
      }

      const results = await urlService.addUrlsToQueue(urls);

      res.status(201).json({
        success: true,
        message: `Successfully added ${urls.length} URLs to queue`,
        data: {
          urls,
          queueLengths: results,
          totalAdded: urls.length
        }
      });
    } catch (error) {
      console.error('Error adding URLs to queue:', error);
      sendErrorResponse(res, 400, error instanceof Error ? error.message : 'Failed to add URLs to queue');
    }
  }

  
  /**
   * Health check for URL service
   * GET /api/urls/health
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const isHealthy = await urlService.healthCheck();
      
      if (isHealthy) {
        res.status(200).json({
          success: true,
          message: 'URL service is healthy',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          message: 'URL service is unhealthy - Redis connection issue',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('URL service health check failed:', error);
      sendErrorResponse(res, 500, 'URL service health check failed');
    }
  }
}

// Export a singleton instance
export const urlController = new UrlController();
