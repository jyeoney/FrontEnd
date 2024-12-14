import StudyDetailContent from './components/StudyDetailContent';

export default async function StudyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div>
      <div id="map-container" />
      <StudyDetailContent studyId={id} />
    </div>
  );
}
