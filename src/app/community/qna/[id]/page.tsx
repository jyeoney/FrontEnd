import QnADetailContent from '@/app/community/components/QnADetailContent';

type QnADetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const QnADetailPage = async ({ params }: QnADetailPageProps) => {
  const { id } = await params;
  return <QnADetailContent postId={id} />;
};

export default QnADetailPage;
