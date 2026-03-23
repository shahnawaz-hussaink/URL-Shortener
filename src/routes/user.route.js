import { Router } from 'express';
import {
  changePassword,
  getAllUserUrl,
  getUser,
  loginUser,
  logoutUser,
  regenerateAccessToken,
  registerUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(verifyToken, logoutUser);
router.route('/refresh-token').patch(verifyToken, regenerateAccessToken);
router.route('/change-password').patch(verifyToken, changePassword);
router.route('/get-user').get(verifyToken, getUser);
router.route('/get-all-urls').get(verifyToken, getAllUserUrl);
export default router;
