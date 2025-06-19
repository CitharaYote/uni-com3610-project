import { useGetUsersQuery } from "../redux/users/usersApiSlice";
import PageSkeleton from "../utils/PageSkeleton";

const Users = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery({});

  return (
    <PageSkeleton heading="Users">
      <h1>Users</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {JSON.stringify(error)}</p>}
      {isSuccess && users && (
        <ul>
          {users.map((user, index: number) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
      )}
    </PageSkeleton>
  );
};

export default Users;
