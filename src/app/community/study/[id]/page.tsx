import StudyDetailContent from './components/StudyDetailContent';

type StudyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const StudyDetailPage = async ({ params }: StudyDetailPageProps) => {
  const { id } = await params;
  return (
    <div>
      <div id="map-container" />
      <StudyDetailContent studyId={id} />
    </div>
  );
};

export default StudyDetailPage;
