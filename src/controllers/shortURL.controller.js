import { Url } from '../models/url.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { nanoid } from 'nanoid';

const creatShortURL = asyncHandler(async (req, res) => {
  const { originalURL } = req.body;

  if (!originalURL) {
    throw new apiError(400, 'All fields required');
  }

  let shortURL = nanoid();

  while (await Url.findOne({ shortURL })) {
    shortURL = nanoid();
  }

  const url = await Url.create({
    originalURL,
    shortURL,
    owner: req.user?._id || null,
  });

  if (!url) {
    throw new apiError(200, 'Something went wrong while saving the URLs');
  }

  return res
    .status(200)
    .json(new apiResponse(200, { shortURL: shortURL }, 'successfull'));
});

const redirectURL = asyncHandler(async (req, res) => {
  const { shortURL } = req.params;
  if (!shortURL) {
    throw new apiError(400, 'No Short URL found in Params!!');
  }

  const url = await Url.findOneAndUpdate(
    { shortURL },
    { $inc: { clicks: 1 } },
    {
      new: true,
    },
  );

  console.log(url);

  if (!url) {
    throw new apiError(400, 'SHORT URL NOT FOUND');
  }

  return res.redirect(url.originalURL);
});

const getClickCounts = asyncHandler(async (req, res) => {
  const { shortURL } = req.params;
  if (!shortURL) {
    throw new apiError(400, 'No Short URL found in Params!!');
  }
  const url = await Url.findOne({ shortURL });

  if (!url) {
    throw new apiError(404, 'SHORT URL NOT FOUND');
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { clickCounts: url.clicks },
        'Fetched Clicked Successfully',
      ),
    );
});

export { creatShortURL, redirectURL, getClickCounts };
