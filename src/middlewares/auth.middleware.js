import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesToken ||
      req.header('Authorization')?.replace('Bearer', '');
    console.log(token, 'From auth middleware');

    if (!token) {
      throw new apiError(400, 'Unauthorized request failed');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new apiError(400, 'Invalid Access Token');
    }
    const user = await User.findById(decodedToken._id).select(
      '-password -refreshToken',
    );

    if (!user) {
      throw new apiError(400, 'Invalid Access Token');
    }

    req.user = user;
    next;
  } catch (error) {
    throw new apiError(401, error?.message || 'Invalid Access Token');
  }
});

export { verifyToken };
