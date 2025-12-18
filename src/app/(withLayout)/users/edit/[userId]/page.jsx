import { getUniqueUser } from "@/actions/userActions";
import EditUser from "@/screens/users/edit"; // asumsinya komponen client

const EditUserPage = async ({ params }) => {
  const id = parseInt(params.userId);
  const userData = await getUniqueUser(id);

  return <EditUser userData={userData} userId={id} />;
};

export default EditUserPage;
