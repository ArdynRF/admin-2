import AddProducts from "@/screens/products/add";
import { getProductTypes } from "@/actions/productTypesAction";
import { getTechnics } from "@/actions/technicActions";
import { getStyles } from "@/actions/styleActions";
import { getPatterns } from "@/actions/patternActions";

const AddProductPage = async ({ searchParams }) => {
  const productTypes = await getProductTypes();
  const technics = await getTechnics();
  const styles = await getStyles();
  const patterns = await getPatterns();
  const { errorMessage } = searchParams;

  return (
    <AddProducts
      errorMessage={errorMessage ?? null}
      productTypes={productTypes}
      technics={technics}
      styles={styles}
      patterns={patterns}
    />
  );
};

export default AddProductPage;
