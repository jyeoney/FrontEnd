import InfoDetailContent from '@/app/community/components/InfoDetailContent';

export default async function InfoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <InfoDetailContent postId={params.id} />;
}
