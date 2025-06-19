const verifyRoles = (...allowedRoles: any[]) => {
  return (req: any, res: any, next: () => void) => {
    if (!req?.roles)
      return res.status(401).json({ message: "Unauthorised (verifyRoles 1)" });
    const rolesArray = [...allowedRoles];
    console.log("ROLES ARRAY: ", rolesArray);

    const result = req.roles
      .map((role: any) => rolesArray.includes(role))
      .find((val: any) => val === true);
    if (!result)
      return res.status(401).json({ message: "Unauthorised (verifyRoles 2)" });
    next();
  };
};

export default verifyRoles;
