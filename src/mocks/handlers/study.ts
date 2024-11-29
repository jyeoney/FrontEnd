import { rest } from 'msw';
import { StudyPost } from '@/types/post';

const mockStudies = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: `스터디 모집합니다 ${index + 1}`,
  subject: [
    '프로젝트',
    '알고리즘',
    '코딩테스트',
    '개념 학습',
    '코딩테스트',
    '챌린지',
    '자격증/시험',
    '취업/코테',
    '기타',
  ][index % 8] as StudyPost['subject'],
  difficulty: ['상', '중', '하'][index % 3] as StudyPost['difficulty'],
  thumbnail: '',
  recruitmentStartDate: '2024-01-01',
  recruitmentEndDate: '2024-02-01',
  studyStartDate: '2024-02-01',
  studyEndDate: '2024-03-01',
  currentMembers: Math.floor(Math.random() * 3) + 1,
  maxMembers: 4,
  meetingTime: '20:00',
  status: ['모집 중', '모집 완료', '진행 중', '종료'][
    index % 4
  ] as StudyPost['status'],
  meeting_type: index % 2 === 0 ? 'Online' : '오프라인',
  days: ['월', '수', '금'],
}));

export const studyHandlers = [
  rest.get('/api/study-posts/search', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '0');
    const size = parseInt(req.url.searchParams.get('size') || '12');
    const searchTitle = req.url.searchParams.get('searchTitle') || '';
    const subjects = req.url.searchParams.getAll('subjects[]');
    const status = req.url.searchParams.getAll('status[]');
    const difficulty = req.url.searchParams.getAll('difficulty[]');
    const days = req.url.searchParams.getAll('days[]');

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
        study.days.some(day => days.includes(day)),
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
];
