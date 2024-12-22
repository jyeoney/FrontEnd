import InfoDetailContent from '@/app/community/components/InfoDetailContent';

type InfoDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const InfoDetailPage = async ({ params }: InfoDetailPageProps) => {
  const { id } = await params;
  return <InfoDetailContent postId={id} />;
};

export default InfoDetailPage;
