import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateRefreshAndAccessToken } from '../utils/generateRefreshAndAccessToken.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, emailId, fullname, password } = req.body;
  console.log(`${username} \n ${emailId} \n ${fullname} \n ${password}`);
  if (!(username && emailId && fullname && password)) {
    throw new apiError(400, 'All fields are required!!!');
  }

  const existedUser = await User.findOne({ $or: [{ emailId, username }] });

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
  console.log(user);

  return res
    .status(200)
    .json(new apiResponse(200, user, 'User Registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailId, username, password } = req.body;
  if (!(emailId && username && password)) {
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
    .cookie('refreshToken', accessToken, options)
    .json(new apiResponse(200, loggedInUser, 'User logged in successfully!'));
});

export { registerUser,loginUser };
