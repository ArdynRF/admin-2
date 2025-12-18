import Patterns from "@/screens/pattern";
import { getPatterns } from "@/actions/patternActions";

const PatternManagement = async () => {
  const patterns = await getPatterns();

  return (
    <div>
      <Patterns patterns={patterns} />
    </div>
  );
};

export default PatternManagement;
