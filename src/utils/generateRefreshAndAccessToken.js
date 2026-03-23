import { User } from '../models/user.model.js';
import { apiError } from './apiError.js';

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(400, 'NO userId');
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new apiError(
      500,
      error.message || 'Something went wrong while generating Tokens!!!',
    );
  }
};

export { generateRefreshAndAccessToken };
