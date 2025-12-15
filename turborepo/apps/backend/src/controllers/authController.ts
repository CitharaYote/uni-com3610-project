// const User = require("../model/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

import User from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleLogin = async (req: any, res: any) => {
  const cookies = req.cookies;

  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorised (authController 1)" });
  }
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match && foundUser.roles) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const userId = foundUser._id;
    console.log("roles: ", roles);
    console.log("rolesObj: ", foundUser.roles);

    // create JWTs
    // TODO: adjust expiration times
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          userId: foundUser._id,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 15 }
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username, userId: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: 24 * 60 * 60 * 1000 }
    );

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      // maxAge: 24 * 60 * 60 * 1000,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("New Refresh Token ");

    // Send authorization roles and access token to user
    res.json({ accessToken, roles, userId });
  } else {
    res.status(401).json({ message: "Unauthorised (authController 2)" });
  }
};

export { handleLogin };
