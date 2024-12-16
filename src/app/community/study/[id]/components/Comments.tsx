'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

interface CommentsProps {
  studyId: string;
  postType: 'STUDY' | 'INFO' | 'QNA';
}

interface CommentResponse {
  content: Comment[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    nickname: string;
    email: string;
    profileImageUrl: string | null;
  };
  userDto?: {
    id: number;
    nickname: string;
    email: string;
    profileImageUrl: string | null;
  };
  replies: Comment[];
}

const getCommentsEndpoint = (postType: string, postId: string) => {
  switch (postType) {
    case 'STUDY':
      return `/study-posts/${postId}/comments`;
    case 'INFO':
      return `/info-posts/${postId}/comments`;
    case 'QNA':
      return `/qna-posts/${postId}/comments`;
    default:
      throw new Error('Invalid post type');
  }
};

const getReplyEndpoint = (postType: string) => {
  switch (postType) {
    case 'STUDY':
      return `/study-posts/comments`;
    case 'INFO':
      return `/info-posts/comments`;
    case 'QNA':
      return `/qna-posts/comments`;
    default:
      throw new Error('Invalid post type');
  }
};

export default function Comments({ studyId, postType }: CommentsProps) {
  const { isSignedIn } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<CommentResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}${getCommentsEndpoint(postType, studyId)}?page=${page + 1}&size=5`,
        );
        if (response.status === 200) {
          const { content: commentData, totalPages: total } = response.data;
          setComments(commentData);
          setTotalPages(total);
        }
      } catch (error) {
        console.error('댓글 목록 조회 실패:', error);
        setComments([]);
      }
    };

    fetchComments();
  }, [studyId, page, postType]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isSignedIn) return;

    try {
      const response = await axios.post(
        replyTo
          ? `${process.env.NEXT_PUBLIC_API_ROUTE_URL}${getReplyEndpoint(postType)}/${replyTo}`
          : `${process.env.NEXT_PUBLIC_API_ROUTE_URL}${getCommentsEndpoint(postType, studyId)}`,
        {
          content: content,
          isSecret: false,
        },
      );

      if (response.status === 200) {
        const newComment = response.data;
        if (replyTo) {
          setComments(prev =>
            prev.map(comment =>
              comment.id === replyTo
                ? {
                    ...comment,
                    replies: Array.isArray(comment.replies)
                      ? [...comment.replies, newComment]
                      : [newComment],
                  }
                : comment,
            ),
          );
        } else {
          setComments(prev => [...prev, { ...newComment, replies: [] }]);
        }
        setContent('');
        setReplyTo(null);
        setPage(0);
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div className="mb-4">
      <div className="bg-base-200 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">
            {comment.user?.nickname || comment.userDto?.nickname}
          </span>
          <span className="text-sm text-gray-500">
            {dayjs.utc(comment.createdAt).tz().format('YYYY.MM.DD HH:mm')}
          </span>
        </div>
        <p className="mb-2">{comment.content}</p>
        {isSignedIn && !isReply && (
          <button
            onClick={() => setReplyTo(comment.id)}
            className="text-sm text-primary hover:underline"
          >
            답글 달기
          </button>
        )}
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-2">
          {comment.replies.map((reply: Comment) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">댓글</h3>

      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="댓글을 입력하세요..."
            rows={3}
          />
          <div className="flex justify-end mt-2">
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="btn btn-ghost mr-2"
              >
                답글 취소
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {replyTo ? '답글 작성' : '댓글 작성'}
            </button>
          </div>
        </form>
      ) : (
        <div className="alert alert-info mb-6">
          <span>댓글을 작성하려면 로그인이 필요합니다.</span>
        </div>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`join-item btn ${page === i ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
