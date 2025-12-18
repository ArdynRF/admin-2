import AddStyle from "@/screens/style-type/add";

const AddStylePage = async ({ searchParams }) => {
  const { errorMessage } = searchParams;

  return <AddStyle errorMessage={errorMessage ?? null} />;
};

export default AddStylePage;
