import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../../redux/auth/authSlice";
import { Link } from "react-router-dom";
import PageSkeleton from "../../utils/PageSkeleton";

const Welcome = () => {
  const user = useSelector(selectCurrentUser);
  console.log("user: ", user);

  const token = useSelector(selectCurrentToken);

  return (
    <PageSkeleton>
      <div>
        <h1>Welcome, {user}!</h1>
        <p>You are logged in with token: {token.substring(0, 10)}...</p>
        <Link to="/auth/logout">Logout</Link>
      </div>
    </PageSkeleton>
  );
};

export default Welcome;
