'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QnAPost, PostResponse } from '@/types/post';
import { PostList } from '@/app/community/components/PostList';
import { useAuthStore } from '@/store/authStore';
import SearchForm from '@/app/community/components/SearchForm';

export default function QnAList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuthStore();
  const page = Number(searchParams.get('page')) || 0;

  const { data: posts, isLoading } = useQuery<PostResponse<QnAPost>>({
    queryKey: ['qna-posts', { page, title: searchParams.get('title') }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '12',
      });

      const title = searchParams.get('title');
      if (title) {
        params.append('title', title);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/qna-posts`,
        { params },
      );
      return response.data;
    },
  });

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleWrite = () => {
    router.push('/community/qna/write');
  };

  return (
    <div className="space-y-4">
      <SearchForm
        initialKeyword={searchParams.get('title') || ''}
        placeholder="Q&A 제목을 검색하세요"
      />
      <PostList<QnAPost>
        title="Q&A"
        posts={posts?.content || []}
        totalPages={posts?.totalPages || 0}
        currentPage={page}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onWrite={handleWrite}
        isSignedIn={isSignedIn}
        renderPostCard={post => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <figure className="px-4 pt-4">
              <img
                src={post.thumbnailImgUrl || '/default-qna-thumbnail.png'}
                alt={post.title}
                className="rounded-xl h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{post.title}</h2>
              <p className="text-base-content/70">
                {post.content?.slice(0, 100) || '내용이 없습니다.'}
                {post.content && post.content.length > 100 ? '...' : ''}
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-base-content/60">
                  작성자: {post.user.nickname}
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => router.push(`/community/qna/${post.id}`)}
                >
                  상세보기
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
