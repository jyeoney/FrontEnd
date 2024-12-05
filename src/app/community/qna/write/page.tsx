'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function QnAWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { isSignedIn, userInfo } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/signin');
    }
  }, [isSignedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/qna-posts', {
        title: title,
        content: content,
        userId: userInfo?.id,
      });

      router.push('/community/qna');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        name="content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button type="submit">작성하기</button>
    </form>
  );
}
