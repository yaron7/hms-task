const UserItem = ({ user }: any) => {
  return (
    <li key={user.id} className="border-b py-2">
      {user.firstname} {user.lastname}
    </li>
  );
};

export default UserItem;