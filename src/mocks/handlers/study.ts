import { rest } from 'msw';
import { DayType, StudyMeetingType, StudyPost } from '@/types/study';

// 온라인 전용 스터디
const mockOnlineStudies = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  title: `[온라인] 스터디 모집합니다 ${index + 1}`,
  content: `<p>온라인 스터디 상세 내용 ${index + 1}</p>`,
  subject: [
    'CONCEPT_LEARNING',
    'PROJECT',
    'CHALLENGE',
    'CERTIFICATION',
    'JOB_PREPARATION',
    'ETC',
  ][index % 6] as StudyPost['subject'],
  difficulty: ['HIGH', 'MEDIUM', 'LOW'][index % 3] as StudyPost['difficulty'],
  thumbnail: '',
  recruitmentStartDate: '2024-01-01',
  recruitmentEndDate: '2024-02-01',
  studyStartDate: '2024-02-01',
  studyEndDate: '2024-03-01',
  currentMembers: Math.floor(Math.random() * 3) + 1,
  maxMembers: 4,
  meetingTime: '20:00',
  status: ['RECRUITING', 'IN_PROGRESS', 'CANCELED'][
    index % 3
  ] as StudyPost['status'],
  meeting_type: 'ONLINE' as StudyMeetingType,
  dayType: ['월', '수', '금'] as DayType[],
  createdAt: new Date(
    Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  location: null,
}));

// 온/오프라인 병행 스터디
const mockHybridStudies = Array.from({ length: 15 }, (_, index) => ({
  id: index + 16, // 온라인 스터디 다음 번호부터
  title: `[온/오프라인] 스터디 모집합니다 ${index + 1}`,
  content: `<p>온/오프라인 병행 스터디 상세 내용 ${index + 1}</p>`,
  subject: [
    'CONCEPT_LEARNING',
    'PROJECT',
    'CHALLENGE',
    'CERTIFICATION',
    'JOB_PREPARATION',
    'ETC',
  ][index % 6] as StudyPost['subject'],
  difficulty: ['HIGH', 'MEDIUM', 'LOW'][index % 3] as StudyPost['difficulty'],
  thumbnail: '',
  recruitmentStartDate: '2024-01-01',
  recruitmentEndDate: '2024-02-01',
  studyStartDate: '2024-02-01',
  studyEndDate: '2024-03-01',
  currentMembers: Math.floor(Math.random() * 3) + 1,
  maxMembers: 4,
  meetingTime: '20:00',
  status: ['RECRUITING', 'IN_PROGRESS', 'CANCELED'][
    index % 3
  ] as StudyPost['status'],
  meeting_type: 'HYBRID' as StudyMeetingType,
  dayType: ['화', '목', '토'] as DayType[],
  createdAt: new Date(
    Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  location: {
    latitude: 37.5665 + (Math.random() * 0.02 - 0.01),
    longitude: 126.978 + (Math.random() * 0.02 - 0.01),
    address: `서울시 중구 테스트동 ${index + 1}번지`,
  },
}));

// 두 배열 합치기
const mockStudies = [...mockOnlineStudies, ...mockHybridStudies];

export const studyHandlers = [
  rest.get('/api/study-posts/search', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '0');
    const size = parseInt(req.url.searchParams.get('size') || '12');
    const searchTitle = req.url.searchParams.get('searchTitle') || '';
    const subjects = req.url.searchParams.getAll('subjects[]');
    const status = req.url.searchParams.getAll('status[]');
    const difficulty = req.url.searchParams.getAll('difficulty[]');
    const days = req.url.searchParams.getAll('days[]');
    const meeting_type = req.url.searchParams.get('meeting_type') || '';

    let filteredData = [...mockStudies];

    // 제목 검색
    if (searchTitle) {
      filteredData = filteredData.filter(study =>
        study.title.toLowerCase().includes(searchTitle.toLowerCase()),
      );
    }

    // 주제 필터
    if (subjects.length > 0) {
      filteredData = filteredData.filter(study =>
        subjects.includes(study.subject),
      );
    }

    // 상태 필터
    if (status.length > 0) {
      filteredData = filteredData.filter(study =>
        status.includes(study.status),
      );
    }

    // 난이도 필터
    if (difficulty.length > 0) {
      filteredData = filteredData.filter(study =>
        difficulty.includes(study.difficulty),
      );
    }

    // 요일 필터
    if (days.length > 0) {
      filteredData = filteredData.filter(study =>
        study.dayType.some(day => days.includes(day)),
      );
    }

    // 미팅 타입 필터
    if (meeting_type) {
      filteredData = filteredData.filter(
        study => study.meeting_type === meeting_type,
      );
    }

    const start = page * size;
    const end = start + size;
    const paginatedData = filteredData.slice(start, end);

    return res(
      ctx.status(200),
      ctx.json({
        data: paginatedData,
        page,
        size,
        total_pages: Math.ceil(filteredData.length / size),
      }),
    );
  }),
  rest.get('/api/study-posts/:id', (req, res, ctx) => {
    const { id } = req.params;
    const study = mockStudies.find(
      study => study.id === parseInt(id as string),
    );

    if (!study) {
      return res(
        ctx.status(404),
        ctx.json({ message: '스터디를 찾을 수 없습니다.' }),
      );
    }

    return res(ctx.status(200), ctx.json(study));
  }),
  rest.put('/api/study-posts/:id', (req, res, ctx) => {
    const { id } = req.params;
    const updatedStudy = req.body as Partial<StudyPost>;

    // 스터디 찾기
    const studyIndex = mockStudies.findIndex(
      study => study.id === parseInt(id as string),
    );

    if (studyIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: '스터디를 찾을 수 없습니다.' }),
      );
    }

    // 스터디 업데이트
    mockStudies[studyIndex] = {
      ...mockStudies[studyIndex],
      ...updatedStudy,
    };

    return res(
      ctx.status(200),
      ctx.json({ message: '스터디 모집 글이 업데이트되었습니다.' }),
    );
  }),
  rest.post('/api/study-posts', (req, res, ctx) => {
    // 인증 헤더 확인
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: '인증이 필요합니다.' }));
    }

    // Content-Type 확인
    const contentType = req.headers.get('Content-Type');
    if (contentType !== 'application/json') {
      return res(
        ctx.status(400),
        ctx.json({ message: '잘못된 요청 형식입니다.' }),
      );
    }

    const studyPost = req.body as {
      title: string;
      studyName: string;
      subject:
        | 'CONCEPT_LEARNING'
        | 'PROJECT'
        | 'CHALLENGE'
        | 'CERTIFICATION'
        | 'JOB_PREPARATION'
        | 'ETC';
      difficulty: 'HIGH' | 'MEDIUM' | 'LOW';
      dayType: Array<'월' | '화' | '수' | '목' | '금' | '토' | '일'>;
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      meetingType: 'ONLINE' | 'HYBRID';
      recruitmentPeriod: string;
      description: string;
      latitude?: number;
      longitude?: number;
      maxParticipants: number;
      userId: number;
    };

    // 필수 필드 검증
    const requiredFields = [
      'title',
      'studyName',
      'subject',
      'difficulty',
      'dayType',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'meetingType',
      'recruitmentPeriod',
      'description',
      'maxParticipants',
      'userId',
    ] as const;

    const missingFields = requiredFields.filter(field => !studyPost[field]);
    if (missingFields.length > 0) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '필수 항목이 누락되었습니다.',
          missingFields,
        }),
      );
    }

    // HYBRID 타입일 경우 위치 정보 필수
    if (
      studyPost.meetingType === 'HYBRID' &&
      (!studyPost.latitude || !studyPost.longitude)
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '위치 정보가 필요합니다.',
        }),
      );
    }

    // 새 스터디 게시글 생성
    const now = new Date().toISOString();
    const newStudy = {
      id: mockStudies.length + 1,
      ...studyPost,
      status: 'RECRUITING' as const,
      thumbnailImgUrl: null,
      currentParticipants: 0,
      createdAt: now,
      updatedAt: now,
    };

    mockStudies.push(newStudy);

    return res(ctx.status(200), ctx.json(newStudy));
  }),
];
