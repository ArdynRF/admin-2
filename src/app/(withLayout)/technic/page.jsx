// import ProductTypes from "@/screens/product-type";
// import { getProductTypes } from "@/actions/productTypesAction";

import Technics from "@/screens/technic";
import { getTechnics } from "@/actions/technicActions";

const TechnicManagement = async () => {
  const technics = await getTechnics();

  return (
    <div>
      <Technics technics={technics} />
    </div>
  );
};

export default TechnicManagement;
