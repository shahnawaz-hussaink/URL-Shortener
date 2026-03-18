import { Url } from '../models/url.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';

const shortURL = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: 'will start working on this' },
        'successfull',
      ),
    );
});

export { shortURL };
