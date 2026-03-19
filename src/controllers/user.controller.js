import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, emailId, fullname, password } = req.body;
  console.log(`${username} \n ${emailId} \n ${fullname} \n ${password}`)
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

  const user = await User.findById(newUser?._id).select('-password -refreshToken');

  if (!user) {
    throw new apiError(500, 'Somethign went wrong while user registration');
  }
  console.log(user);

  return res
    .status(200)
    .json(new apiResponse(200, user, 'User Registered successfully'));
});

export { registerUser };
