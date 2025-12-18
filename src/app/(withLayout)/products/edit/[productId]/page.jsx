import { getProductById } from "@/actions/ProductActions";
import { getProductTypes } from "@/actions/productTypesAction";
import EditProducts from "@/screens/products/edit";
import { getPatterns } from "@/actions/patternActions";
import { getTechnics } from "@/actions/technicActions";
import { getStyles } from "@/actions/styleActions";

const EditProductPage = async ({ params, searchParams }) => {
  const { productId } = await params;
  const { errorMessage } = await searchParams;

  const product = await getProductById(productId);
  const productTypes = await getProductTypes();
  const technics = await getTechnics();
  const styles = await getStyles();
  const patterns = await getPatterns();

  return (
    <EditProducts
      product={product}
      productTypes={productTypes}
      technics={technics}
      styles={styles}
      patterns={patterns}
      errorMessage={errorMessage ?? null}
    />
  );
};

export default EditProductPage;
