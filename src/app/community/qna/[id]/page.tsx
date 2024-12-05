'use client';

import { useEffect, useState } from 'react';
import { QnAPost } from '@/types/post';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import axios from 'axios';

export default function QnADetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<QnAPost | null>(null);
  const { isSignedIn, userInfo } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/qna-posts/${params.id}`);
        setPost(response.data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
      }
    };

    fetchPost();
  }, [params.id]);

  const isAuthor = isSignedIn && userInfo?.id === post?.userId;

  const handleEdit = () => {
    router.push(`/community/qna/edit/${params.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/api/qna-posts/${params.id}`);
      router.push('/community/qna');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    }
  };

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

        {isAuthor && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleEdit} className="btn btn-primary">
              수정
            </button>
            <button onClick={handleDelete} className="btn btn-error">
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
