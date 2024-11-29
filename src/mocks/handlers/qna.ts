import { rest } from 'msw';
import { QnAPost } from '@/types/post';

const mockQnAs = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: `Q&A 제목 ${index + 1}`,
  content: `Q&A 내용 ${index + 1}입니다. 이것은 테스트를 위한 긴 내용입니다...`,
  thumbnail: '/default-qna-thumbnail.png',
}));

export const qnaHandlers = [
  rest.get('/api/qna-posts/search', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '0');
    const size = parseInt(req.url.searchParams.get('size') || '12');
    const searchTitle = req.url.searchParams.get('searchTitle') || '';

    let filteredData = [...mockQnAs];

    if (searchTitle) {
      filteredData = filteredData.filter(qna =>
        qna.title.toLowerCase().includes(searchTitle.toLowerCase()),
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
