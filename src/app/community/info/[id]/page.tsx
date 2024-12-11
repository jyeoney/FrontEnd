'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  profileImageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InfoPost {
  id: number;
  user: User;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function InfoDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<InfoPost | null>(null);
  const { isSignedIn, userInfo } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/info-posts/${params.id}`,
        );
        setPost(response.data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
      }
    };

    fetchPost();
  }, [params.id]);

  const isAuthor = isSignedIn && userInfo?.id === post?.user.id;

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-between text-sm text-base-content/60">
            <span>작성자: {post.user.username}</span>
            <span>
              작성일: {dayjs(post.createdAt).format('YYYY.MM.DD HH:mm')}
            </span>
          </div>
        </div>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {isAuthor && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => router.push(`/community/info/edit/${post.id}`)}
              className="btn btn-primary"
            >
              수정
            </button>
            <button
              onClick={async () => {
                if (window.confirm('정말로 삭제하시겠습니까?')) {
                  try {
                    await axios.delete(`/api/info-posts/${post.id}`);
                    router.push('/community/info');
                  } catch (error) {
                    console.error('삭제 실패:', error);
                  }
                }
              }}
              className="btn btn-error"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
