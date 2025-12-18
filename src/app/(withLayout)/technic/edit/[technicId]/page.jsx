import { getUniqueTechnic } from "@/actions/technicActions";
import EditTechnic from "@/screens/technic/edit";

const EditTechnicPage = async ({ params, searchParams }) => {
  const technic = await getUniqueTechnic(params.technicId);

  return <EditTechnic technic={technic} searchParams={searchParams} />;
};

export default EditTechnicPage;
