import User from "../model/User";
// const jwt = require('jsonwebtoken');
import jwt, {
  Jwt,
  JwtPayload,
  VerifyCallback,
  VerifyErrors,
} from "jsonwebtoken";

const handleRefreshToken = async (req: any, res: any) => {
  console.log("handleRefreshToken");

  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res
      .status(403)
      .json({ message: "Forbidden (refreshTokenController 1)" });
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
          if (err)
            return res
              .status(403)
              .json({ message: "Forbidden (refreshTokenController 2)" });
          // Delete refresh tokens of hacked user
          const hackedUser = await User.findOne({
            username: decoded.username,
          }).exec();
          if (hackedUser) {
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
          }
        }
      );
      console.log("Refresh token not found in db");

      return res
        .status(403)
        .json({ message: "Forbidden (refreshTokenController 3)" });
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: any, decoded: any) => {
        if (err) {
          // expired refresh token
          console.log("Refresh token expired");

          foundUser.refreshToken = [...newRefreshTokenArray];
          try {
            const result = await foundUser.save();
          } catch (err) {
            console.log(err);
          }
        }
        if (err || foundUser.username !== decoded.username) {
          console.log("Refresh token invalid 21312");
          return res
            .status(403)
            .json({ message: "Forbidden (refreshTokenController 4)" });
        }

        console.log("Refresh token valid");

        // Refresh token was still valid
        const roles = Object.values(foundUser.roles!);
        const userId = foundUser._id;
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
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
          { expiresIn: 24 * 60 * 60 }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
          // maxAge: 2 * 60 * 1000,
        });

        res.json({ accessToken, roles, userId });
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ message: "Forbidden (refreshTokenController 5)" });
  }
};

export { handleRefreshToken };
