'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { QnAPost, PostResponse } from '@/types/post';
import { PostList } from '../components/PostList';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function QnAListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostResponse<QnAPost> | null>(null);
  const [page, setPage] = useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '12',
        searchTitle,
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/qna-posts?${params}`,
      );
      setPosts(response.data);
    } catch (error) {
      console.error('Q&A 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, searchTitle]);

  const { isSignedIn } = useAuthStore();

  const handleWrite = () => {
    router.push('/community/qna/write');
  };

  return (
    <PostList<QnAPost>
      title="Q&A"
      posts={posts?.content || []}
      totalPages={posts?.totalPages || 0}
      currentPage={page}
      isLoading={isLoading}
      onPageChange={setPage}
      onSearch={setSearchTitle}
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
                작성자: {post.user.username}
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
  );
}
