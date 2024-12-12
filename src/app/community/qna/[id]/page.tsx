import QnADetailContent from '@/app/community/components/QnADetailContent';

export default async function QnADetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <QnADetailContent postId={params.id} />;
}
