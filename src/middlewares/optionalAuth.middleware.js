import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

const optionalAuth = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessToken ||
    req.header('Authorization')?.replace('Bearer', '');
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new apiError(401, 'Not Authorized!');
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new apiError(400, 'Invalid or Expired Access Code');
    }
    req.user = user;
  } catch (error) {
    throw new apiError(
      400,
      error.message || 'Something went wrong whileverifying the optional auth',
    );
  }
  next();
});

export { optionalAuth };
