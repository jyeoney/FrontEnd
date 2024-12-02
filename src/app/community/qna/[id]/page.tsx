'use client';

import { useEffect, useState } from 'react';
import { QnAPost } from '@/types/post';
import dayjs from 'dayjs';

export default function QnADetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<QnAPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/qna-posts/${params.id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
      }
    };

    fetchPost();
  }, [params.id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="text-sm text-base-content/60">
            작성일: {dayjs(post.createdAt).format('YYYY.MM.DD HH:mm')}
          </div>
        </div>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
}
