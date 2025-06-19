import jwt from "jsonwebtoken";
import User from "../model/User";

const verifyJWT = (req: any, res: any, next: () => void) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorised (verifyJWT 1)" });
  const token = authHeader.split(" ")[1];
  // console.log(token);
  // const user = User.findOne({ username: req.user })
  // if (!user)
  //   return res.status(401).json({ message: "Unauthorised (verifyJWT 2)" });

  // if (!user.roles)
  //   return res.status(401).json({ message: "Unauthorised (verifyJWT 3)" });

  // const roles = Object.values(user.roles).filter(Boolean);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (err: any, decoded: any) => {
      console.log("token go brerr");

      if (err) {
        console.log("invalid token beep boop");
        console.log(err);

        return res.status(403).json({ message: "Forbidden (verifyJWT 2)" });
      } //invalid token
      req.user = decoded.UserInfo.username;
      req.userId = decoded.UserInfo.userId;
      req.roles = decoded.UserInfo.roles;
      console.log("ROLES: ", req.roles);

      next();
    }
  );
};

export default verifyJWT;
