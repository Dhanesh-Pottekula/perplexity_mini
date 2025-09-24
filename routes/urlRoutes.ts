import { Router } from 'express';
import { urlController } from '../controllers/urlController';

const router = Router();

/**
 * @route POST /api/urls
 * @desc Add a single URL with depth to the urls_queue
 * @body { url: string, depth: number }
 * @access Public
 */
router.post('/', urlController.addUrl.bind(urlController));

/**
 * @route POST /api/urls/batch
 * @desc Add multiple URLs with depth to the urls_queue
 * @body { urls: string[], depth: number }
 * @access Public
 */
router.post('/batch', urlController.addUrls.bind(urlController));

/**
 * @route GET /api/urls/health
 * @desc Health check for URL service
 * @access Public
 */
router.get('/health', urlController.healthCheck.bind(urlController));

export default router;
