import { getStyles } from "@/actions/styleActions";
import Styles from "@/screens/style-type";

const StyleManagement = async () => {
  const styles = await getStyles();

  return (
    <div>
      <Styles styles={styles} />
    </div>
  );
};

export default StyleManagement;
