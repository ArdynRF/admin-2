import Detail from "@/screens/negotiate/detail";

const NegotiateDetailPage = async ({ searchParams }) => {
    const { errorMessage } = searchParams;
    return <Detail errorMessage={errorMessage ?? null} />;
};

export default NegotiateDetailPage;