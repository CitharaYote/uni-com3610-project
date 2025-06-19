import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentRoles,
  selectCurrentToken,
  setCredentials,
} from "../../redux/auth/authSlice";
import { useForceRefreshMutation } from "../../redux/auth/authApiSlice";

type RequireAuthProps = {
  children: React.ReactNode;
  requiredRoles?: number[];
  strict?: boolean;
};

const RequireAuth = ({
  children,
  requiredRoles = [],
  strict = false,
}: RequireAuthProps) => {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const roles = useSelector(selectCurrentRoles);

  try {
    return token ? (
      requiredRoles.length > 0 ? (
        strict ? (
          requiredRoles.every((role) => roles.includes(role)) ? (
            children
          ) : (
            <Navigate to="/unauthorised" state={{ from: location }} replace />
          )
        ) : requiredRoles.some((role) => roles.includes(role)) ? (
          children
        ) : (
          <Navigate to="/unauthorised" state={{ from: location }} replace />
        )
      ) : (
        children
      )
    ) : (
      <Navigate to="/auth/login" state={{ from: location }} replace />
    );
  } catch (error) {
    console.error("Error in RequireAuth: ", error);
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
