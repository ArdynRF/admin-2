import UpdateNegotiate from "@/screens/negotiate/update";
import { getNegotiateById } from "@/actions/negotiateActions";

const UpdateNegotiatePage = async ({ params }) => {
  const negotiateId = params.negotiateId;
  const negotiate = await getNegotiateById(negotiateId);

  return <UpdateNegotiate negotiate={negotiate} />;
};

export default UpdateNegotiatePage;