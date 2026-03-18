import { Router } from 'express';
import {
  creatShortURL,
  redirectURL,
} from '../controllers/shortURL.controller.js';

const router = Router();

router.route('/short-it/:customId').post(creatShortURL);
router.route('/getUrl/:shortURL').get(redirectURL);

export default router;
