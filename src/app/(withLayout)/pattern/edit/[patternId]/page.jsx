import { getUniquePattern } from "@/actions/patternActions";
import EditPattern from "@/screens/pattern/edit";

const EditPatternPage = async ({ params, searchParams }) => {
  const pattern = await getUniquePattern(params.patternId);

  return <EditPattern pattern={pattern} searchParams={searchParams} />;
};

export default EditPatternPage;
