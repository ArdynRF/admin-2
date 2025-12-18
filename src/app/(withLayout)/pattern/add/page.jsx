import AddPattern from "@/screens/pattern/add";

const AddPatternPage = async ({ searchParams }) => {
  const { errorMessage } = searchParams;

  return <AddPattern errorMessage={errorMessage ?? null} />;
};

export default AddPatternPage;
