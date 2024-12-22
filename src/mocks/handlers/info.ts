import { rest } from 'msw';

const mockInfoPosts = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: `정보공유 게시글 ${index + 1}`,
  content: `<p>정보공유 내용 ${index + 1}</p>`,
  createdAt: new Date(
    Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
  ).toISOString(),
}));

export const infoHandlers = [
  rest.get('/api/info-posts/search', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '0');
    const size = parseInt(req.url.searchParams.get('size') || '12');
    const searchTitle = req.url.searchParams.get('searchTitle') || '';

    let filteredData = [...mockInfoPosts];

    if (searchTitle) {
      filteredData = filteredData.filter(post =>
        post.title.toLowerCase().includes(searchTitle.toLowerCase()),
      );
    }

    const start = page * size;
    const paginatedData = filteredData.slice(start, start + size);

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

  rest.get('/api/info-posts/:id', (req, res, ctx) => {
    const { id } = req.params;
    const post = mockInfoPosts.find(post => post.id === parseInt(id as string));

    if (!post) {
      return res(
        ctx.status(404),
        ctx.json({ message: '게시글을 찾을 수 없습니다.' }),
      );
    }

    return res(ctx.status(200), ctx.json(post));
  }),
];
