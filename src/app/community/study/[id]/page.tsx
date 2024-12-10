import StudyDetailContent from './components/StudyDetailContent';

export default async function StudyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <div id="map-container" />
      <StudyDetailContent studyId={params.id} />
    </div>
  );
}
