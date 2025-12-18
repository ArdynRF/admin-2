import { getUniqueStyle } from "@/actions/styleActions";
import EditStyle from "@/screens/style-type/edit";

const EditStylePage = async ({ params, searchParams }) => {
  const style = await getUniqueStyle(params.styleTypeId);

  return <EditStyle style={style} searchParams={searchParams} />;
};

export default EditStylePage;
