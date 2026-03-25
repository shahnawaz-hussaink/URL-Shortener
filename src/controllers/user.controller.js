import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Url } from '../models/url.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateRefreshAndAccessToken } from '../utils/generateRefreshAndAccessToken.js';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
  const { username, emailId, fullname, password } = req.body;
  if (!(username && emailId && fullname && password)) {
    throw new apiError(400, 'All fields are required!!!');
  }

  const existedUser = await User.findOne({ $or: [{ emailId }, { username }] });

  if (existedUser) {
    throw new apiError(400, 'User already exists');
  }

  const newUser = await User.create({
    username,
    emailId,
    fullname,
    password,
  });

  const user = await User.findById(newUser?._id).select(
    '-password -refreshToken',
  );

  if (!user) {
    throw new apiError(500, 'Somethign went wrong while user registration');
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, 'User Registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailId, username, password } = req.body;
  if (!((emailId || username) && password)) {
    throw new apiError(400, 'All fields are required to login');
  }

  const user = await User.findOne({
    $or: [{ emailId }, { username }],
  });

  if (!user) {
    throw new apiError(400, 'Invalid Email or Username');
  }

  // passwor check

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(400, 'Invalid Password');
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user?._id,
  ); // after this function call then only token will be generated and save into cookies and db

  if (!(accessToken && refreshToken)) {
    throw new apiError(500, 'Error on generting token while login');
  }

  const loggedInUser = await User.findById(user?._id).select(
    '-password -refreshToken',
  );

  if (!loggedInUser) {
    throw new apiError(
      500,
      'something went wrong while finding logged in user after generating token',
    );
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new apiResponse(200, loggedInUser, 'User logged in successfully!'));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
      new apiResponse(
        200,
        { username: req.user?.username },
        'User loggedOut successfully!!',
      ),
    );
});

const regenerateAccessToken = asyncHandler(async (req, res) => {
  const gotRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!gotRefreshToken) {
    throw new apiError(401, 'Invalid refresh token');
  }

  try {
    const decodedToken = jwt.verify(
      gotRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!decodedToken) {
      throw new apiError(400, 'refresh Token not matching to the cookie token');
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new apiError(400, 'Invalid Refresh Token, user not found');
    }

    if (gotRefreshToken !== user?.refreshToken) {
      throw new apiError(400, 'Refresh token is expired or used');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateRefreshAndAccessToken(decodedToken._id);

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { refreshToken: newRefreshToken, accessToken },
          'Successfully generated Tokens',
        ),
      );
  } catch (error) {
    throw new apiError(
      400,
      error.message ||
        'Somehting went wrong while verifying the refresh token ',
    );
  }
});

// change password

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword) {
    throw new apiError(400, 'Password field is empty');
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new apiError(400, 'Invalid Call to update password');
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new apiError(400, 'Wrong password, check password');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new apiResponse(200, {}, 'Password Changed successfully'));
});

// get user
const getUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, 'Got user successfully'));
});

// get all url of user created till data

const getAllUserUrl = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, 'Unauthorized');
  }

  const allUserUrls = await Url.find({ owner: userId });

  return res
    .status(200)
    .json(new apiResponse(200, allUserUrls, 'Got user urls successfully'));
});

const getUserIpAdress = asyncHandler(async (req, res) => {
  const ipAddress =
    req.headers['x-forwarded-for']?.split(",")[0].trim() || req.connection.remoteAddress
  return res
    .status(200)
    .json(new apiResponse(200, ipAddress, 'Fetched Ip Address successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  regenerateAccessToken,
  changePassword,
  getUser,
  getAllUserUrl,
  getUserIpAdress,
};
