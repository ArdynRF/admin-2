import Negotiate from "@/screens/negotiate";
import { getNegotiates } from "@/actions/negotiateActions";

const NegotiateManagement = async () => {
  const negotiates = await getNegotiates();
    return (
    <div>
      <Negotiate negotiates={negotiates} />
    </div>
  );
};
export default NegotiateManagement;