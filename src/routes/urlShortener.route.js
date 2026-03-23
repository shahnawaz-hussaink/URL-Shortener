import { Router } from 'express';
import {
  creatShortURL,
  getClickCounts,
  redirectURL,
} from '../controllers/shortURL.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/short-url').post(verifyToken, creatShortURL);
router.route('/get-short-url/:shortURL').get(redirectURL);
router.route('/get-url-clicks/:shortURL').get(getClickCounts);

export default router;
