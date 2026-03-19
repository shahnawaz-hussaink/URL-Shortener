import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Password Hashing

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  else {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

// Password Check...

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT Access Token
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      email: this.email,
    },
    // secret key
    process.env.ACCESS_TOKEN_SECRET,
    {
      // options -> like , expiery , issuer and more
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
    },
    // secret key
    process.env.REFRESH_TOKEN_SECRET,
    {
      // options -> like , expiery , issuer and more
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model('User', userSchema);
