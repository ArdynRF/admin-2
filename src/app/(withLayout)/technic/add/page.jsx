import AddTechnic from "@/screens/technic/add";

const AddTechnicPage = async ({ searchParams }) => {
  const { errorMessage } = searchParams;

  return <AddTechnic errorMessage={errorMessage ?? null} />;
};

export default AddTechnicPage;
