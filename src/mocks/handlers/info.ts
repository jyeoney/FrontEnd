import { rest } from 'msw';
import { InfoPost } from '@/types/post';

const mockInfos = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: `정보공유 제목 ${index + 1}`,
  content: `정보공유 내용 ${index + 1}입니다. 이것은 테스트를 위한 긴 내용입니다...`,
  thumbnail: '/default-info-thumbnail.png',
}));

export const infoHandlers = [
  rest.get('/api/info-posts/search', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '0');
    const size = parseInt(req.url.searchParams.get('size') || '12');
    const searchTitle = req.url.searchParams.get('searchTitle') || '';

    let filteredData = [...mockInfos];

    if (searchTitle) {
      filteredData = filteredData.filter(info =>
        info.title.toLowerCase().includes(searchTitle.toLowerCase()),
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
