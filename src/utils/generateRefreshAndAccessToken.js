import { User } from '../models/user.model';
import { apiError } from './apiError';

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new apiError(500, 'Something went wrong while generating Tokens!!!');
  }
};

export {generateRefreshAndAccessToken}
