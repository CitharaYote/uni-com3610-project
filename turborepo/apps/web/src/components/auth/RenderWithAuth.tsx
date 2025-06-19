import { useSelector } from "react-redux";
import {
  selectCurrentRoles,
  selectCurrentToken,
} from "../../redux/auth/authSlice";

type RenderWithAuthProps = {
  children: React.ReactNode;
  requiredRoles?: number[];
  strict?: boolean;
  inverted?: boolean;
  fallback?: React.ReactNode;
};

const RenderWithAuth = ({
  children,
  requiredRoles = [],
  strict = false,
  inverted = false,
  fallback = null,
}: RenderWithAuthProps) => {
  const token = useSelector(selectCurrentToken);
  const roles = useSelector(selectCurrentRoles);

  try {
    return token
      ? requiredRoles.length > 0
        ? strict
          ? requiredRoles.every((role) => roles.includes(role))
            ? inverted
              ? fallback
              : children
            : inverted
              ? children
              : fallback
          : requiredRoles.some((role) => roles.includes(role))
            ? inverted
              ? fallback
              : children
            : inverted
              ? children
              : fallback
        : inverted
          ? fallback
          : children
      : inverted
        ? children
        : fallback;
  } catch (error) {
    console.error("Error in RenderWithAuth: ", error);
  }
};

export default RenderWithAuth;
