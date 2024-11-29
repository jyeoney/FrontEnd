'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { QnAPost, PostResponse } from '@/types/post';
import { PostList } from '../components/PostList';

export default function QnAListPage() {
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

      const response = await axios.get('/api/qna-posts/search', { params });
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

  return (
    <PostList<QnAPost>
      title="Q&A"
      posts={posts?.data || []}
      totalPages={posts?.total_pages || 0}
      currentPage={page}
      isLoading={isLoading}
      onPageChange={setPage}
      onSearch={setSearchTitle}
      renderPostCard={post => (
        <div key={post.id} className="card bg-base-100 shadow-xl">
          <figure className="px-4 pt-4">
            <img
              src={post.thumbnail || '/default-qna-thumbnail.png'}
              alt={post.title}
              className="rounded-xl h-48 w-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{post.title}</h2>
            <p className="text-base-content/70">
              {post.content.slice(0, 100)}...
            </p>
          </div>
        </div>
      )}
    />
  );
}
