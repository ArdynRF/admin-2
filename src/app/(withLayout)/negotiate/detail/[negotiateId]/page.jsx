import { getNegotiateById } from "@/actions/negotiateActions";
import Detail from "@/screens/negotiate/detail";

const NegotiateDetailPage = async ({ params,searchParams }) => {
  const detail = await getNegotiateById(params.negotiateId);
  return <Detail detail={detail} searchParams={searchParams} />;
};

export default NegotiateDetailPage;